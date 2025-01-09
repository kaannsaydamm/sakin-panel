import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get the current time in UTC
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    // Query for the last entry to check data presence and timestamp format
    const lastPacketEntry = await prisma.packetData.findFirst({
      orderBy: { timestamp: 'desc' },
    })

    const lastSniEntry = await prisma.sniData.findFirst({
      orderBy: { timestamp: 'desc' },
    })

    console.log('Last Packet Entry:', lastPacketEntry)
    console.log('Last SNI Entry:', lastSniEntry)

    const [packetData, sniData] = await Promise.all([
      prisma.packetData.findMany({
        where: {
          timestamp: {
            gte: last24Hours,
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
        select: {
            id: true,
            timestamp: true,
        }
      }),
      prisma.sniData.findMany({
        where: {
          timestamp: {
            gte: last24Hours,
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
      }),
    ])

    console.log('Current time (UTC):', now.toISOString())
    console.log('Last 24 hours from:', last24Hours.toISOString())
    console.log('Packet data count:', packetData.length)
    console.log('SNI data count:', sniData.length)

    // If no data in the last 24 hours, fetch the last 100 entries
    if (packetData.length === 0 && sniData.length === 0) {
      const [fallbackPacketData, fallbackSniData] = await Promise.all([
        prisma.packetData.findMany({
          take: 100,
          orderBy: {
            timestamp: 'desc',
          },
          select: {
            id: true,
            timestamp: true,
          }
        }),
        prisma.sniData.findMany({
          take: 100,
          orderBy: {
            timestamp: 'desc',
          }
        }),
      ])

      console.log('Fallback Packet data count:', fallbackPacketData.length)
      console.log('Fallback SNI data count:', fallbackSniData.length)

      return NextResponse.json({ 
        packetData: fallbackPacketData, 
        sniData: fallbackSniData,
        message: 'No data found in the last 24 hours. Showing the last 100 entries.'
      })
    }

    return NextResponse.json({ packetData, sniData })
  } catch (error) {
    console.error('Error fetching network data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export const revalidate = 1;