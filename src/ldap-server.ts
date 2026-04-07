import ldap from 'ldapjs'
import { prisma } from './lib/prisma'
import { verifyTotp } from './lib/totp'

const server = ldap.createServer()

async function getSetting(key: string, defaultValue: string): Promise<string> {
  try {
    const setting = await prisma.systemSetting.findUnique({ where: { key } })
    return setting?.value || defaultValue
  } catch {
    return defaultValue
  }
}

// Simple authentication (bind)
server.bind('ou=users,dc=ptc,dc=local', async (req: any, res: any, next: any) => {
  const dn = req.dn.toString()
  const password = req.credentials
  
  // Get base DN from settings
  const baseDn = await getSetting('baseDn', 'ou=users,dc=ptc,dc=local')
  const adminDn = await getSetting('adminDn', 'cn=admin,dc=ptc,dc=local')
  const adminPassword = await getSetting('adminPassword', 'admin123')

  // Support Admin/Service account binding
  if (dn === adminDn && password === adminPassword) {
    res.end()
    return next()
  }

  if (!dn.endsWith(baseDn)) return next(new ldap.InvalidCredentialsError())

  // Extract username from DN (e.g., cn=user1,ou=users,dc=ptc,dc=local)
  const usernameMatch = dn.match(/cn=([^,]+)/)
  if (!usernameMatch) return next(new ldap.InvalidCredentialsError())
  
  const username = usernameMatch[1]
  
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    })
    
    if (!user) return next(new ldap.NoSuchObjectError(dn))
    
    // Check if user is enabled for TOTP
    if (user.totpEnabled && user.totpSecret) {
      const isValid = await verifyTotp(password, user.totpSecret)
      if (isValid) {
        res.end()
        return next()
      }
    }
    
    // Check if user is enabled for SMTP OTP
    if (user.otpEnabled) {
      const latestOtp = await prisma.otpLog.findFirst({
        where: {
          userId: user.id,
          type: 'SMTP',
          status: 'PENDING',
          expiresAt: { gt: new Date() },
          code: password,
        },
        orderBy: { createdAt: 'desc' },
      })
      
      if (latestOtp) {
        // Mark as success
        await prisma.otpLog.update({
          where: { id: latestOtp.id },
          data: { status: 'SUCCESS' },
        })
        res.end()
        return next()
      }
    }
    
    return next(new ldap.InvalidCredentialsError())
  } catch (err) {
    console.error('LDAP Bind error:', err)
    return next(new ldap.OperationsError())
  }
})

// Search operation (Cisco ISE will search for the user)
server.search('ou=users,dc=ptc,dc=local', async (req: any, res: any, next: any) => {
  const dn = req.dn.toString()
  const filter = req.filter.toString()
  
  console.log(`Searching for: ${dn} with filter: ${filter}`)
  
  // Example filter: (sAMAccountName=user1) or (uid=user1)
  const usernameMatch = filter.match(/\((?:sAMAccountName|uid|cn)=([^)]+)\)/)
  if (!usernameMatch) {
    res.end()
    return next()
  }
  
  const username = usernameMatch[1]
  
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    })
    
    if (user) {
      const entry = {
        dn: `cn=${user.username},ou=users,dc=ptc,dc=local`,
        attributes: {
          cn: user.username,
          uid: user.username,
          sn: user.username,
          mail: user.email || '',
          objectClass: ['top', 'person', 'organizationalPerson', 'user'],
        }
      }
      res.send(entry)
    }
    
    res.end()
    return next()
  } catch (err) {
    console.error('LDAP Search error:', err)
    return next(new ldap.OperationsError())
  }
})

const PORT = parseInt(process.env.LDAP_PORT || '1389')

async function startServer() {
  const listenPort = parseInt(await getSetting('ldapPort', PORT.toString()))
  const listenIp = await getSetting('ldapIp', '0.0.0.0')

  server.listen(listenPort, listenIp, () => {
    console.log(`LDAP server listening on ldap://${listenIp}:${listenPort}`)
  })
}

startServer()
