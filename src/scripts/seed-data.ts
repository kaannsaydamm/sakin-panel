import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Generate 1000 packet data entries
  for (let i = 0; i < 1000; i++) {
    await prisma.packetData.create({
      data: {
        srcIp: faker.internet.ip(),
        dstIp: faker.internet.ip(),
        protocol: faker.helpers.arrayElement(['TCP', 'UDP', 'ICMP']),
        timestamp: faker.date.between({ from: oneWeekAgo, to: now }),
      },
    })
  }

  // Generate 1000 SNI data entries
  for (let i = 0; i < 1000; i++) {
    await prisma.sniData.create({
      data: {
        sni: faker.internet.domainName(),
        srcIp: faker.internet.ip(),
        dstIp: faker.internet.ip(),
        protocol: faker.helpers.arrayElement(['TCP', 'UDP']),
        timestamp: faker.date.between({ from: oneWeekAgo, to: now }),
      },
    })
  }

  console.log('Seed data inserted successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

