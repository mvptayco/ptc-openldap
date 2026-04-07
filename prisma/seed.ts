import { PrismaClient, Role } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  
  const hashedPassword = await bcrypt.hash(password, 10)
  
  // Create Super Admin
  const admin = await prisma.admin.upsert({
    where: { username },
    update: { 
      password: hashedPassword,
      role: Role.SUPER_ADMIN
    },
    create: {
      username,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  })
  
  console.log(`Super Admin user '${admin.username}' created/updated successfully.`)

  // Create some default roles or settings if needed
  await prisma.systemSetting.upsert({
    where: { key: 'baseDn' },
    update: {},
    create: { key: 'baseDn', value: 'ou=users,dc=ptc,dc=local' },
  })

  console.log('Default settings seeded.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
