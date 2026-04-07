import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { username, macAddress, hostname } = await req.json()
    
    // Log the request
    const log = await prisma.iseLog.create({
      data: {
        username,
        action: 'AUTH',
        status: 'PENDING',
        details: `Auth request for device ${macAddress} (${hostname || 'unknown'})`,
      }
    })

    // Find the user
    const user = await prisma.user.findUnique({
      where: { username },
      include: { endpoints: true }
    })

    if (!user || !user.isActive) {
      await prisma.iseLog.update({
        where: { id: log.id },
        data: { status: 'FAILURE', details: 'User not found or inactive' }
      })
      return NextResponse.json({ authenticated: false, reason: 'User not found' }, { status: 401 })
    }

    // Check if endpoint is authorized
    let endpoint = user.endpoints.find(e => e.macAddress.toLowerCase() === macAddress.toLowerCase())
    
    if (!endpoint) {
      // Auto-register if not found (optional policy)
      endpoint = await prisma.endpoint.create({
        data: {
          macAddress,
          hostname,
          userId: user.id,
          status: 'PENDING'
        }
      })
    }

    if (endpoint.status === 'BLOCKED') {
      await prisma.iseLog.update({
        where: { id: log.id },
        data: { status: 'FAILURE', details: 'Endpoint blocked' }
      })
      return NextResponse.json({ authenticated: false, reason: 'Device blocked' }, { status: 403 })
    }

    // If everything is fine, proceed to MFA requirement
    const requireMfa = user.otpEnabled || user.totpEnabled

    await prisma.iseLog.update({
      where: { id: log.id },
      data: { status: 'SUCCESS', details: requireMfa ? 'MFA Required' : 'Authenticated' }
    })

    return NextResponse.json({ 
      authenticated: true, 
      requireMfa,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName
      }
    })
  } catch (error) {
    console.error('ISE Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
