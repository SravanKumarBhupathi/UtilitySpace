const { execSync } = require('child_process');
try {
  execSync('npm run build', { stdio: 'inherit' });
  execSync('npx jest', { stdio: 'inherit' });
  console.log('Pre-commit checks passed!');
} catch (error) {
  console.error('Pre-commit checks failed!');
  process.exit(1);
}
