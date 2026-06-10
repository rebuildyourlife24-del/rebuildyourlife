const http = require('http');

function request(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1' + path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = 'Bearer ' + token;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 400) {
            reject({ status: res.statusCode, body: parsed });
          } else {
            resolve({ status: res.statusCode, body: parsed });
          }
        } catch (e) {
          reject({ status: res.statusCode, body: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTest() {
  const email = `testuser_${Date.now()}@example.com`;
  const password = "Password123!";

  console.log("1. Registering user:", email);
  try {
    const regRes = await request('/auth/register', 'POST', {
      firstName: "Test",
      lastName: "User",
      email: email,
      password: password
    });
    console.log("Register success:", regRes.body);

    const token = regRes.body.data.tokens.accessToken;

    console.log("2. Fetching dashboard...");
    const dashRes = await request('/user/dashboard', 'GET', null, token);
    console.log("Dashboard success");

    console.log("3. Initiating checkout...");
    const checkoutRes = await request('/payments/checkout', 'POST', { plan: 'PREMIUM' }, token);
    console.log("Checkout success:", checkoutRes.body);

    console.log("All flows working correctly!");
  } catch (err) {
    console.error("Test failed:", err);
  }
}

runTest();
