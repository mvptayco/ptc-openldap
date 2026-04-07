import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const users = await req.json()
    
    if (!Array.isArray(users)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    }

    for (const userData of users) {
      try {
        if (!userData.username) {
          results.failed++
          results.errors.push(`Missing username for record`)
          continue
        }

        await prisma.user.upsert({
          where: { username: userData.username },
          update: {
            email: userData.email,
            displayName: userData.displayName,
            phoneNumber: userData.phoneNumber,
          },
          create: {
            username: userData.username,
            email: userData.email,
            displayName: userData.displayName,
            phoneNumber: userData.phoneNumber,
          }
        })
        results.success++
      } catch (err: any) {
        results.failed++
        results.errors.push(`Error importing ${userData.username}: ${err.message}`)
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Bulk import error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
