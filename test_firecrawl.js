// Native fetch is available in Node 18+
async function testFirecrawl() {
  const apiKey = "fc-1e41f9efef06469585c9c753334b8f83";
  const url = "https://rebuildyourlife.eu"; // Using the user's domain as a test

  console.log("Starting Firecrawl Scrape Test for:", url);
  console.log("Using Key:", apiKey.substring(0, 10) + "...");

  try {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: url,
        formats: ["markdown"]
      })
    });

    if (!response.ok) {
      console.error("HTTP Error:", response.status, response.statusText);
      const text = await response.text();
      console.error("Response Body:", text);
      return;
    }

    const data = await response.json();
    if (data.success) {
      console.log("\n✅ SUCCESS! Firecrawl returned data.");
      console.log("Title:", data.data.metadata?.title);
      console.log("\n--- Markdown preview (first 250 chars) ---");
      console.log(data.data.markdown?.substring(0, 250) + "...");
    } else {
      console.error("API returned success: false", data);
    }
  } catch (err) {
    console.error("Request failed:", err);
  }
}

testFirecrawl();
