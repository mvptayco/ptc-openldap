'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Network, 
  ShieldCheck, 
  Activity, 
  Settings2, 
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  Database,
  Globe,
  Cpu,
  Plus
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function IseIntegrationPage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [nodes, setNodes] = useState([
    { id: '1', name: 'ISE Primary Node', ip: '192.168.10.55', status: 'ONLINE', latency: '12ms', version: '3.2.0.542' },
    { id: '2', name: 'ISE Secondary Node', ip: '192.168.10.56', status: 'ONLINE', latency: '15ms', version: '3.2.0.542' }
  ])

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      toast.success('ISE Policy sync completed successfully')
    }, 2000)
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Cisco ISE Integration</h1>
          <p className="text-slate-400 mt-1">Manage network access control and policy synchronization.</p>
        </div>
        <Button 
          onClick={handleSync}
          disabled={isSyncing}
          className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/20"
        >
          <RefreshCw className={cn("w-4 h-4", isSyncing && "animate-spin")} />
          {isSyncing ? 'Syncing Policies...' : 'Sync Policies'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {nodes.map((node) => (
          <motion.div key={node.id} variants={itemVariants}>
            <Card className="rounded-3xl border-slate-800 shadow-sm overflow-hidden bg-slate-900">
              <CardHeader className="pb-4 bg-slate-800/50 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-slate-900 rounded-xl shadow-sm border border-slate-800">
                    <Server className="w-5 h-5 text-primary" />
                  </div>
                  <Badge className="bg-primary/20 text-primary border-none rounded-full">
                    {node.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-4 text-white">{node.name}</CardTitle>
                <CardDescription className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{node.ip}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Latency</p>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-300">
                      <Activity className="w-3.5 h-3.5 text-primary" />
                      {node.latency}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Version</p>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-300">
                      <Globe className="w-3.5 h-3.5 text-secondary" />
                      {node.version}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>Node Load</span>
                    <span className="text-primary">24%</span>
                  </div>
                  <Progress value={24} className="h-1.5 bg-slate-800" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <motion.div variants={itemVariants}>
          <Card className="rounded-3xl border-dashed border-2 border-slate-800 shadow-none bg-transparent h-full flex flex-col items-center justify-center p-8 text-center hover:bg-slate-900/50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-slate-400" />
            </div>
            <p className="font-bold text-slate-300">Add ISE Node</p>
            <p className="text-xs text-slate-500 mt-1">Register another policy services node.</p>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="rounded-3xl border-slate-800 shadow-sm overflow-hidden h-full bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Trust Verification Policy
              </CardTitle>
              <CardDescription className="text-slate-400">Rules for authenticating devices via ISE RADIUS.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-start gap-4">
                  <div className="p-2 bg-primary/20 rounded-xl text-primary">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-white">RADIUS Proxy Mode</p>
                      <Badge className="bg-primary text-primary-foreground border-none rounded-full px-2 py-0 text-[10px]">ACTIVE</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Intercept and augment RADIUS requests with MFA verification.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-start gap-4 opacity-70">
                  <div className="p-2 bg-slate-800 rounded-xl text-slate-500">
                    <Database className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-500">Policy Enrichment</p>
                      <Badge variant="outline" className="rounded-full px-2 py-0 text-[10px] border-slate-700 text-slate-500">DISABLED</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Inject additional user attributes into ISE authorization profiles.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Button variant="ghost" className="w-full justify-between text-primary hover:text-primary/80 hover:bg-primary/10 rounded-xl">
                  <span>Advanced Configuration</span>
                  <Settings2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="rounded-3xl border-slate-800 shadow-sm overflow-hidden h-full bg-slate-900">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Activity className="w-5 h-5 text-primary" />
                ISE Integration Health
              </CardTitle>
              <CardDescription className="text-slate-400">Real-time status of system integrations.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-white">ERS API Connectivity</span>
                  </div>
                  <span className="text-[10px] font-bold text-primary">PASSED</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-white">PxGrid Communication</span>
                  </div>
                  <span className="text-[10px] font-bold text-primary">PASSED</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/10 border border-secondary/20">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-secondary-foreground" />
                    <span className="text-sm font-medium text-white">Syslog Processing</span>
                  </div>
                  <span className="text-[10px] font-bold text-secondary-foreground">WARNING</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/50 text-[11px] text-slate-400 font-mono leading-relaxed">
                <p>[10:45:22] SYNC: Starting policy push to node 192.168.10.55...</p>
                <p>[10:45:24] SYNC: 142 endpoints synchronized.</p>
                <p>[10:45:25] SYNC: Complete. Next sync scheduled in 58m.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
