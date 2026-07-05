const domains = [
  'rebuildyourlife.myshopify.com',
  'rebuildyourlife24.myshopify.com',
  'rebuild-your-life.myshopify.com',
  'rebuild-your-life-24.myshopify.com',
  'rebuildyourlifesaas.myshopify.com'
];
const token = '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';

async function testDomains() {
  for (const domain of domains) {
    try {
      const res = await fetch(`https://${domain}/admin/api/2024-01/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': token
        }
      });
      console.log(domain, res.status);
      if (res.status === 200) {
        console.log("✅ FOUND DOMAIN:", domain);
        const data = await res.json();
        console.log(data);
        return;
      }
    } catch (e) {
      console.log(domain, 'error');
    }
  }
}
testDomains();
