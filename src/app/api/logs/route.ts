import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const logs = await prisma.otpLog.findMany({
      include: {
        user: {
          select: {
            username: true,
            displayName: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json(logs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}
