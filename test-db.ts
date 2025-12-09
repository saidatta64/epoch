
import { prisma } from './src/lib/prisma';

async function main() {
  try {
    console.log('Connecting to database...');
    const count = await prisma.user.count();
    console.log('Successfully connected! User count:', count);
  } catch (e) {
    console.error('Connection failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
