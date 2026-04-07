import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTotp } from '@/lib/totp'

export async function POST(req: Request) {
  try {
    const { userId, token } = await req.json()
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    
    if (!user || !user.totpSecret) {
      return NextResponse.json({ error: 'User or secret not found' }, { status: 404 })
    }
    
    const isValid = await verifyTotp(token, user.totpSecret)
    
    if (isValid) {
      await prisma.user.update({
        where: { id: userId },
        data: { totpEnabled: true },
      })
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }
  } catch (error) {
    console.error('TOTP verification error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
