import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOtpEmail } from '@/lib/mail'

export async function POST(req: Request) {
  try {
    const { username } = await req.json()
    
    const user = await prisma.user.findUnique({
      where: { username },
    })
    
    if (!user || !user.email) {
      return NextResponse.json({ error: 'User or email not found' }, { status: 404 })
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Save OTP to log
    await prisma.otpLog.create({
      data: {
        userId: user.id,
        type: 'SMTP',
        code: otp,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    })
    
    await sendOtpEmail(user.email, otp)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('OTP request error:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
