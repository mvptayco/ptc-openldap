import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const totalUsers = await prisma.user.count()
    const activeUsers = await prisma.user.count({ where: { isActive: true } })
    const totalEndpoints = await prisma.endpoint.count()
    const authorizedEndpoints = await prisma.endpoint.count({ where: { status: 'AUTHORIZED' } })
    const otpRequestsToday = await prisma.otpLog.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    })
    const failedLoginsToday = await prisma.adminLoginLog.count({
      where: {
        status: 'FAILED',
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    })

    // Get data for charts (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      d.setHours(0, 0, 0, 0)
      return d
    }).reverse()

    const chartData = await Promise.all(last7Days.map(async (date) => {
      const nextDate = new Date(date)
      nextDate.setDate(date.getDate() + 1)

      const otps = await prisma.otpLog.count({
        where: {
          createdAt: { gte: date, lt: nextDate }
        }
      })

      const iseAuths = await prisma.iseLog.count({
        where: {
          action: 'AUTH',
          createdAt: { gte: date, lt: nextDate }
        }
      })

      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        otps,
        iseAuths
      }
    }))

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        totalEndpoints,
        authorizedEndpoints,
        otpRequestsToday,
        failedLoginsToday
      },
      chartData
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}
