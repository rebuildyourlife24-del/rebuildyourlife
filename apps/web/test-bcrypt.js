const bcrypt = require('bcryptjs');

async function test() {
  const hash = "$2a$10$cBC7uVOQpw6epWzW4KcAXeTnMPPmHcZE02TiAvqZDxQl/FwVnQRT6";
  const pass = "Imperialdreams2055";
  const ok = await bcrypt.compare(pass, hash);
  console.log("Password matches:", ok);
}

test();
