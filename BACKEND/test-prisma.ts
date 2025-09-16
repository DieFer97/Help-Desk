import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@ejemplo.com',
      nombre: 'Usuario Test',
      passwordHash: 'hashed_password',
    },
  });
  console.log('Usuario creado:', user);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());