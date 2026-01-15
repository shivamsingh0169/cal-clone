const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // 1. Create User
  const user = await prisma.user.upsert({
    where: { email: 'admin@cal.com' },
    update: {},
    create: { email: 'admin@cal.com', username: 'admin', name: 'Kumar Shivam' },
  })

  // 2. Create Event
  // We use upsert here too to avoid errors if you run this twice
  const event = await prisma.eventType.findFirst({
    where: { userId: user.id, slug: '30-min' }
  })

  if (!event) {
    await prisma.eventType.create({
      data: {
        userId: user.id,
        title: '30 Min Meeting',
        slug: '30-min',
        duration: 30,
        description: 'Quick catch-up call.'
      }
    })
    console.log("Created Event: 30 Min Meeting")
  }

  // 3. Create Availability (Mon-Fri, 9-5)
  // Delete old availability first to avoid duplicates
  await prisma.availability.deleteMany({ where: { userId: user.id } })
  
  for (let i = 1; i <= 5; i++) {
    await prisma.availability.create({
      data: { userId: user.id, dayOfWeek: i, startTime: '09:00', endTime: '17:00' }
    })
  }
  console.log("Seeding Done!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
  