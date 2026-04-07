import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    const { adminId, code } = await req.json()
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    })
    
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }
    
    // For initial setup, we'll allow '000000' as a bypass or implement real check
    // In a real scenario, check against Redis or DB for SMTP OTP, or verify TOTP
    const isValid = code === '000000' // Placeholder for verification logic
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid OTP code' }, { status: 401 })
    }
    
    // Log final success
    await prisma.adminLoginLog.create({
      data: {
        adminId: admin.id,
        ipAddress: ip,
        status: 'SUCCESS',
      }
    })
    
    // Create JWT tokens
    const accessToken = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '15m' }
    )
    
    const refreshToken = jwt.sign(
      { id: admin.id },
      process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret',
      { expiresIn: '7d' }
    )
    
    // Set cookies
    const response = NextResponse.json({ 
      success: true,
      user: {
        username: admin.username,
        role: admin.role
      }
    })
    
    response.cookies.set('admin_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 900, // 15 mins
      path: '/',
    })
    
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 604800, // 7 days
      path: '/',
    })
    
    return response
  } catch (error) {
    console.error('OTP Verify API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
