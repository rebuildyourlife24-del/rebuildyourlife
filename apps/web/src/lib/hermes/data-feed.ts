/**
 * ══════════════════════════════════════════════════════════════
 * HERMES 2.0 REAL-TIME DATA FEED
 * Zoals geadviseerd door Hermes: Een constante stroom van
 * actuele markt data, crypto trends, en economische gebeurtenissen.
 * ══════════════════════════════════════════════════════════════
 */

// We gebruiken publieke RSS feeds om de "real-time" data te genereren 
// zonder afhankelijk te zijn van dure/betaalde API's.
const DATA_SOURCES = [
  { name: 'TechCrunch (Tech)', url: 'https://techcrunch.com/feed/' },
  { name: 'CoinDesk (Crypto)', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
  { name: 'YCombinator (Startups)', url: 'https://news.ycombinator.com/rss' }
];

/**
 * Simpele XML parser functie (Omdat we geen zware externe library willen toevoegen)
 */
function extractXmlTitles(xml: string): string[] {
  const titles: string[] = [];
  const titleRegex = /<title>(.*?)<\/title>/g;
  let match;
  let count = 0;
  
  while ((match = titleRegex.exec(xml)) !== null && count < 6) {
    let cleanTitle = match[1].replace('<![CDATA[', '').replace(']]>', '');
    // Sla de eerste over (dat is vaak de naam van de feed zelf)
    if (count > 0 && !cleanTitle.includes('TechCrunch') && !cleanTitle.includes('CoinDesk')) {
      titles.push(cleanTitle);
    }
    count++;
  }
  return titles;
}

export async function fetchRealTimeMarketData(): Promise<string> {
  let aggregatedData = '=== REAL-TIME MARKT DATA FEED ===\n';
  
  try {
    for (const source of DATA_SOURCES) {
      aggregatedData += `\n[Bron: ${source.name}]:\n`;
      try {
        const response = await fetch(source.url, { next: { revalidate: 3600 } });
        if (!response.ok) continue;
        
        const xmlData = await response.text();
        const titles = extractXmlTitles(xmlData);
        
        titles.forEach(title => {
          aggregatedData += `- ${title}\n`;
        });
      } catch (err) {
        aggregatedData += `- (Kan bron tijdelijk niet laden)\n`;
      }
    }
    
    return aggregatedData;
  } catch (err: any) {
    console.error('[HERMES DATA-FEED] Fout bij ophalen markt data:', err.message);
    return 'Real-time data feed momenteel offline.';
  }
}
