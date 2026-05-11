const requiredVariables = ['DATABASE_URL'];

const missing = requiredVariables.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(`Missing required environment variable(s): ${missing.join(', ')}`);
  console.error('Set DATABASE_URL in your deploy platform, for example:');
  console.error('postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public');
  process.exit(1);
}
