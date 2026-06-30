import { db } from "@/lib/db";

export interface ScrapedLead {
  name: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  category: string;
  location: string;
}

export class B2BLeadScraperService {
  /**
   * Resolve location name to latitude/longitude using OSM Nominatim API
   */
  private static async geocodeLocation(location: string): Promise<{ lat: number; lon: number } | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "RebuildYourLifeB2BScraper/1.0 (contact: support@rebuildyourlife.com)"
        }
      });
      if (!res.ok) throw new Error(`Nominatim returned status ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (err) {
      console.error("Geocoding failed:", err);
      return null;
    }
  }

  /**
   * Scrapes email addresses from website content
   */
  private static async scrapeEmailFromWebsite(websiteUrl: string): Promise<string | undefined> {
    try {
      let formattedUrl = websiteUrl?.trim();
      if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
        formattedUrl = `https://${formattedUrl}`;
      }

      // 5-second timeout for responsiveness
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(formattedUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      clearTimeout(timeoutId);
      if (!res.ok) return undefined;

      const html = await res.text();

      // Look for mailto hrefs first
      const mailtoRegex = /href=["']mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})["']/i;
      const mailtoMatch = html.match(mailtoRegex);
      if (mailtoMatch && mailtoMatch[1]) {
        return mailtoMatch[1]?.trim();
      }

      // Look for plain email addresses
      const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
      const matches = html.match(emailRegex);
      if (matches) {
        const filtered = matches.filter(email => {
          const lower = email.toLowerCase();
          return (
            !lower.endsWith(".png") &&
            !lower.endsWith(".jpg") &&
            !lower.endsWith(".jpeg") &&
            !lower.endsWith(".gif") &&
            !lower.endsWith(".webp") &&
            !lower.endsWith(".js") &&
            !lower.endsWith(".css") &&
            !lower.endsWith(".svg")
          );
        });
        if (filtered.length > 0) {
          return filtered[0]?.trim();
        }
      }
      return undefined;
    } catch (err) {
      console.warn(`Could not scrape email from ${websiteUrl}:`, err instanceof Error ? err.message : err);
      return undefined;
    }
  }

  /**
   * Perform lead scraping via Overpass API
   */
  public static async scrapeLeads(location: string, category: string, limit: number = 10): Promise<ScrapedLead[]> {
    const coords = await this.geocodeLocation(location);
    if (!coords) {
      throw new Error(`Location '${location}' could not be geocoded.`);
    }

    const { lat, lon } = coords;
    // Map human category names to OpenStreetMap tags
    const catMap: Record<string, string> = {
      dentist: '["amenity"="dentist"]',
      restaurant: '["amenity"="restaurant"]',
      bakery: '["shop"="bakery"]',
      gym: '["leisure"="sports_centre"]',
      lawyer: '["office"="lawyer"]',
      "real estate": '["office"="estate_agent"]',
      hairdresser: '["shop"="hairdresser"]',
      hotel: '["tourism"="hotel"]',
      "car repair": '["shop"="car_repair"]'
    };

    const osmFilter = catMap[category.toLowerCase()] || `["amenity"="${category}"]`;
    const radius = 5000; // 5km radius

    // Construct Overpass query
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node${osmFilter}(around:${radius},${lat},${lon});
        way${osmFilter}(around:${radius},${lat},${lon});
      );
      out center ${limit};
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
    
    const res = await fetch(url, {
      headers: {
        "User-Agent": "RebuildYourLifeB2BScraper/1.0"
      }
    });

    if (!res.ok) {
      throw new Error(`Overpass API returned status ${res.status}`);
    }

    const data = await res.json();
    const elements = data.elements || [];
    const results: ScrapedLead[] = [];

    for (const el of elements) {
      const tags = el.tags || {};
      const name = tags.name || tags.operator || `${category.charAt(0).toUpperCase() + category.slice(1)} Near ${location}`;
      const phone = tags.phone || tags["contact:phone"] || tags["mobile"] || undefined;
      const website = tags.website || tags["contact:website"] || undefined;
      
      let address = tags["addr:street"] 
        ? `${tags["addr:street"]} ${tags["addr:housenumber"] || ""}, ${tags["addr:postcode"] || ""} ${tags["addr:city"] || ""}`
        : undefined;

      let email = tags.email || tags["contact:email"] || undefined;

      // Scrape email from website if website exists but email doesn't
      if (website && !email) {
        email = await this.scrapeEmailFromWebsite(website);
      }

      results.push({
        name,
        phone,
        email,
        website,
        address,
        category,
        location
      });
    }

    return results;
  }

  /**
   * Save scraped leads into Prisma db under BusinessClient
   */
  public static async saveLeadsToDb(userId: string, leads: ScrapedLead[]): Promise<number> {
    let savedCount = 0;
    for (const lead of leads) {
      // Check if lead already exists for this user
      const existing = await db.businessClient.findFirst({
        where: {
          userId,
          name: lead.name,
          email: lead.email || null
        }
      });

      if (!existing) {
        await db.businessClient.create({
          data: {
            userId,
            name: lead.name,
            email: lead.email || null,
            phone: lead.phone || null,
            company: lead.name,
            status: "PROSPECT",
            notes: `Scraped B2B Lead. Location: ${lead.location}, Category: ${lead.category}, Address: ${lead.address || "N/A"}, Website: ${lead.website || "N/A"}`
          }
        });
        savedCount++;
      }
    }
    return savedCount;
  }
}
