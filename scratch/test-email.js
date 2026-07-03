const fetch = require('node-fetch');

async function testEmailWebhook() {
  console.log("Simulating an inbound email webhook from SendGrid/Postmark...");
  
  const payload = {
    sender: "bozeklant@hotmail.com",
    recipient: "support@rebuildyourlife.com",
    subject: "Waar blijft mijn bestelling?!",
    text: "Ik heb vorige week besteld en het is nog steeds niet binnen. Dit is belachelijk. Ik wil nu weten waar het is of mijn geld terug."
  };

  try {
    const res = await fetch('http://localhost:3000/api/webhook/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Response van onze API:", data);
  } catch(e) {
    console.error("Fout bij aanroepen API:", e);
  }
}

testEmailWebhook();
