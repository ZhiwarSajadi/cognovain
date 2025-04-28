// Script to disable Next.js telemetry permanently
const { execSync } = require('child_process');

try {
  console.log('Disabling Next.js telemetry...');
  execSync('npx next telemetry disable', { stdio: 'inherit' });
  console.log('Next.js telemetry has been disabled successfully.');
} catch (error) {
  console.error('Failed to disable telemetry:', error);
  process.exit(1);
}