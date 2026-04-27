function createNonce() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`.replace(
    /[^a-zA-Z0-9_]/g,
    "",
  );
}

function generateZohoUser({ prefix = "rnd.user", displayPrefix = "RND User" } = {}) {
  const safe = createNonce();
  return {
    name: `${displayPrefix} ${safe.slice(-8)}`,
    // Note: some providers disallow "+" aliases. If Zoho rejects it, set ZOHO_EMAIL explicitly.
    email: `${prefix}+${safe}@example.com`,
    password: `Pwd_${safe.slice(-10)}!aA1`,
    phone: `555${Math.floor(Math.random() * 9000000 + 1000000)}`,
  };
}

function resolveZohoUserFromEnv(fallback) {
  return {
    name: process.env.ZOHO_NAME || fallback.name,
    email: process.env.ZOHO_EMAIL || fallback.email,
    password: process.env.ZOHO_PASSWORD || fallback.password,
    phone: process.env.ZOHO_PHONE || fallback.phone,
  };
}

module.exports = { generateZohoUser, resolveZohoUserFromEnv };

