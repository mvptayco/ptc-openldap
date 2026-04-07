import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const endpoints = await prisma.endpoint.findMany({
      include: {
        user: {
          select: {
            username: true,
            displayName: true,
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
    })
    return NextResponse.json(endpoints)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch endpoints' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const endpoint = await prisma.endpoint.create({
      data: {
        macAddress: data.macAddress,
        hostname: data.hostname,
        status: data.status || 'PENDING',
        userId: data.userId,
      },
    })
    return NextResponse.json(endpoint)
  } catch (error) {
    console.error('Create endpoint error:', error)
    return NextResponse.json({ error: 'Failed to create endpoint' }, { status: 500 })
  }
}
