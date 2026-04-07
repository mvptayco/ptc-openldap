'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Shield, 
  Mail, 
  Network, 
  Database, 
  Save, 
  Loader2,
  Lock,
  Globe,
  Bell,
  Eye,
  EyeOff
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    ldapHost: 'ldap.ptc.local',
    ldapPort: '636', // LDAPS preferred
    adminDn: 'cn=admin,dc=ptc,dc=local',
    adminPassword: '',
    smtpHost: 'smtp.office365.com', // Updated to M365
    smtpPort: '587',
    smtpUser: 'notifications@ptc.com',
    iseIp: '192.168.10.55',
    radiusSecret: 'shared-secret-123',
    otpExpiry: '60', // Updated to 60s
    enforceMfa: true,
    autoRegisterDevices: false,
    useLdaps: true,
    loggingFormat: 'CEF', // Added for FortiSIEM/NG SIEM
    siemIp: '',
    siemPort: '514',
    siemProtocol: 'UDP'
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      toast.error('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        toast.success('Settings saved successfully')
      } else {
        toast.error('Failed to save settings')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">System Settings</h1>
          <p className="text-slate-400 mt-1">Configure directory, mail, and network integration parameters.</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/20 px-6"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList className="bg-slate-900 p-1 rounded-2xl border border-slate-800 inline-flex">
          <TabsTrigger value="directory" className="rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6">Directory</TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6">Security</TabsTrigger>
          <TabsTrigger value="network" className="rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6">Network</TabsTrigger>
          <TabsTrigger value="mail" className="rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6">Mail</TabsTrigger>
          <TabsTrigger value="logging" className="rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary px-6">SIEM / Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <Card className="rounded-3xl border-slate-800 shadow-sm overflow-hidden bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Database className="w-5 h-5 text-primary" />
                LDAP Configuration
              </CardTitle>
              <CardDescription className="text-slate-400">Connection details for the primary identity provider.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ldapHost" className="text-slate-300">LDAP Host</Label>
                  <Input 
                    id="ldapHost" 
                    placeholder="ldap.example.com" 
                    className="rounded-xl border-slate-800 bg-slate-800 h-11 text-white focus-visible:ring-primary"
                    value={settings.ldapHost}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, ldapHost: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ldapPort" className="text-slate-300">Port</Label>
                  <Input 
                    id="ldapPort" 
                    placeholder="389" 
                    className="rounded-xl border-slate-800 bg-slate-800 h-11 text-white focus-visible:ring-primary"
                    value={settings.ldapPort}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, ldapPort: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminDn" className="text-slate-300">Admin DN</Label>
                  <Input 
                    id="adminDn" 
                    placeholder="cn=admin,dc=example,dc=com" 
                    className="rounded-xl border-slate-800 bg-slate-800 h-11 text-white focus-visible:ring-primary"
                    value={settings.adminDn}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, adminDn: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminPassword" className="text-slate-300">Admin Password</Label>
                  <div className="relative">
                    <Input 
                      id="adminPassword" 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      className="rounded-xl border-slate-800 bg-slate-800 h-11 pr-10 text-white focus-visible:ring-primary"
                      value={settings.adminPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, adminPassword: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="rounded-3xl border-slate-800 shadow-sm overflow-hidden bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Shield className="w-5 h-5 text-primary" />
                Security Policies
              </CardTitle>
              <CardDescription className="text-slate-400">Global authentication and access control rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-white">Enforce MFA</p>
                    <p className="text-xs text-slate-500">Require multi-factor authentication for all users.</p>
                  </div>
                  <Switch 
                    checked={settings.enforceMfa} 
                    onCheckedChange={(checked: boolean) => setSettings({...settings, enforceMfa: checked})}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-white">Auto-register Devices</p>
                    <p className="text-xs text-slate-500">Automatically register new MAC addresses upon first successful login.</p>
                  </div>
                  <Switch 
                    checked={settings.autoRegisterDevices} 
                    onCheckedChange={(checked: boolean) => setSettings({...settings, autoRegisterDevices: checked})}
                  />
                </div>
                <div className="space-y-2 max-w-xs">
                  <Label htmlFor="otpExpiry" className="text-slate-300">OTP Expiry (seconds)</Label>
                  <Input 
                    id="otpExpiry" 
                    type="number" 
                    className="rounded-xl border-slate-800 bg-slate-800 h-11 text-white focus-visible:ring-primary"
                    value={settings.otpExpiry}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, otpExpiry: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card className="rounded-3xl border-slate-800 shadow-sm overflow-hidden bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Network className="w-5 h-5 text-primary" />
                ISE & RADIUS Settings
              </CardTitle>
              <CardDescription className="text-slate-400">Configure communication with network policy servers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="iseIp" className="text-slate-300">Primary ISE IP</Label>
                  <Input 
                    id="iseIp" 
                    placeholder="192.168.1.100" 
                    className="rounded-xl border-slate-800 bg-slate-800 h-11 text-white focus-visible:ring-primary"
                    value={settings.iseIp}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, iseIp: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="radiusSecret" className="text-slate-300">RADIUS Shared Secret</Label>
                  <Input 
                    id="radiusSecret" 
                    type="password" 
                    placeholder="••••••••" 
                    className="rounded-xl border-slate-800 bg-slate-800 h-11 text-white focus-visible:ring-primary"
                    value={settings.radiusSecret}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, radiusSecret: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mail">
          <Card className="rounded-3xl border-slate-800 shadow-sm overflow-hidden bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Mail className="w-5 h-5 text-primary" />
                SMTP Configuration (M365)
              </CardTitle>
              <CardDescription className="text-slate-400">Microsoft 365 SMTP settings for secure OTP delivery.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost" className="text-slate-300">SMTP Host</Label>
                  <Input 
                    id="smtpHost" 
                    placeholder="smtp.office365.com" 
                    className="rounded-xl border-slate-800 bg-slate-800 h-11 text-white focus-visible:ring-primary"
                    value={settings.smtpHost}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, smtpHost: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort" className="text-slate-300">Port (STARTTLS)</Label>
                  <Input 
                    id="smtpPort" 
                    placeholder="587" 
                    className="rounded-xl border-slate-800 bg-slate-800 h-11 text-white focus-visible:ring-primary"
                    value={settings.smtpPort}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, smtpPort: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUser" className="text-slate-300">Sender Email</Label>
                  <Input 
                    id="smtpUser" 
                    type="email" 
                    placeholder="notifications@ptc.com" 
                    className="rounded-xl border-slate-800 bg-slate-800 h-11 text-white focus-visible:ring-primary"
                    value={settings.smtpUser}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, smtpUser: e.target.value})}
                  />
                </div>
              </div>
              <Button variant="outline" className="rounded-xl border-slate-800 hover:bg-slate-800 text-slate-300">Test M365 Connection</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logging">
          <Card className="rounded-3xl border-slate-800 shadow-sm overflow-hidden bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Settings className="w-5 h-5 text-primary" />
                SIEM & Syslog Export
              </CardTitle>
              <CardDescription className="text-slate-400">Configure log formats for FortiSIEM (CEF) and NG SIEM (JSON).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-slate-300">Primary Log Format</Label>
                  <div className="flex gap-4">
                    <Button 
                      variant={settings.loggingFormat === 'CEF' ? 'default' : 'outline'}
                      className="flex-1 rounded-xl"
                      onClick={() => setSettings({...settings, loggingFormat: 'CEF'})}
                    >
                      CEF (FortiSIEM)
                    </Button>
                    <Button 
                      variant={settings.loggingFormat === 'JSON' ? 'default' : 'outline'}
                      className="flex-1 rounded-xl"
                      onClick={() => setSettings({...settings, loggingFormat: 'JSON'})}
                    >
                      JSON (NG SIEM)
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Syslog Server</Label>
                  <Input 
                    placeholder="syslog.internal.local" 
                    className="rounded-xl border-slate-800 bg-slate-800 h-11 text-white focus-visible:ring-primary"
                  />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                <p className="text-xs text-primary font-bold uppercase mb-2">Time Synchronization</p>
                <p className="text-xs text-slate-400">NTP is enforced across all components for TOTP and SIEM correlation accuracy.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
