import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateTotpSecret, generateOtpAuthUrl } from '@/lib/totp'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const secret = generateTotpSecret()
    const otpAuthUrl = generateOtpAuthUrl(user.username, 'PTC-LDAP', secret)
    
    // Temporarily store the secret in the database until verified
    await prisma.user.update({
      where: { id: userId },
      data: { totpSecret: secret },
    })
    
    return NextResponse.json({ secret, otpAuthUrl })
  } catch (error) {
    console.error('TOTP setup error:', error)
    return NextResponse.json({ error: 'Failed to generate TOTP secret' }, { status: 500 })
  }
}
