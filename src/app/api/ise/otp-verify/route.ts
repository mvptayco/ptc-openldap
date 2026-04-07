import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTotp } from '@/lib/totp'

export async function POST(req: Request) {
  try {
    const { username, code, macAddress } = await req.json()
    
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return NextResponse.json({ verified: false, reason: 'User not found' }, { status: 404 })
    }

    let isVerified = false

    // Try TOTP first
    if (user.totpEnabled && user.totpSecret) {
      isVerified = verifyTotp(code, user.totpSecret)
    }

    // If not TOTP, try SMTP OTP
    if (!isVerified && user.otpEnabled) {
      const latestOtp = await prisma.otpLog.findFirst({
        where: {
          userId: user.id,
          type: 'SMTP',
          status: 'PENDING',
          expiresAt: { gt: new Date() },
          code: code,
        },
        orderBy: { createdAt: 'desc' },
      })

      if (latestOtp) {
        isVerified = true
        await prisma.otpLog.update({
          where: { id: latestOtp.id },
          data: { status: 'SUCCESS' }
        })
      }
    }

    // Log the result
    await prisma.iseLog.create({
      data: {
        username,
        action: 'OTP_VERIFY',
        status: isVerified ? 'SUCCESS' : 'FAILURE',
        details: `OTP verification for device ${macAddress || 'unknown'}`,
      }
    })

    return NextResponse.json({ verified: isVerified })
  } catch (error) {
    console.error('ISE OTP Verify error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
