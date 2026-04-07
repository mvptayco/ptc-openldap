import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    
    // Find admin in DB
    const admin = await prisma.admin.findUnique({
      where: { username },
    })
    
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    // Check password
    const isValid = await bcrypt.compare(password, admin.password)
    if (!isValid) {
      // Log failed attempt
      await prisma.adminLoginLog.create({
        data: {
          adminId: admin.id,
          ipAddress: ip,
          userAgent: userAgent,
          status: 'FAILED',
        }
      })
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    // Log success (no OTP for admin)
    await prisma.adminLoginLog.create({
      data: {
        adminId: admin.id,
        ipAddress: ip,
        userAgent: userAgent,
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
      requireOtp: false,
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
    console.error('Login API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
