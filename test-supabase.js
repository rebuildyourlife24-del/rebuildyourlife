const { createClient } = require('@supabase/supabase-js');
const url = "https://gjexrxdyddystmvrgsoe.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZXhyeGR5ZGR5c3RtdnJnc29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNDQ1MTgsImV4cCI6MjA5NjYyMDUxOH0.LJB24eXhrGaLwTaQuqgZwVNNumRL3jngffGfRy2hcMg";

const supabase = createClient(url, key);

async function testAuth() {
  console.log("Testing Supabase Auth connection...");
  
  // Try signing in with the dev bypass credentials just to see what happens
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'hsemler50@gmail.com',
    password: 'admin' // Even if it's wrong, we want to see the specific error
  });

  if (error) {
    console.error("Supabase Auth Error:", error.message);
  } else {
    console.log("Supabase Auth Success!", data.user.id);
  }
}

testAuth();
