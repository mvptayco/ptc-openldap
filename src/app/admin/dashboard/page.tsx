'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Laptop, 
  History, 
  ShieldCheck,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalEndpoints: 0,
    authorizedEndpoints: 0,
    otpRequestsToday: 0,
    failedLoginsToday: 0
  })
  const [chartData, setChartData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/dashboard/stats')
        const data = await res.json()
        setStats(data.stats)
        setChartData(data.chartData)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const kpis = [
    { 
      label: 'Total Users', 
      value: stats.totalUsers, 
      change: '+5%', 
      trend: 'up',
      icon: Users, 
      color: 'primary' 
    },
    { 
      label: 'Active Endpoints', 
      value: stats.authorizedEndpoints, 
      change: '+12%', 
      trend: 'up',
      icon: Laptop, 
      color: 'secondary' 
    },
    { 
      label: 'OTP Requests (24h)', 
      value: stats.otpRequestsToday, 
      change: '+18%', 
      trend: 'up',
      icon: History, 
      color: 'secondary' 
    },
    { 
      label: 'Failed Auth', 
      value: stats.failedLoginsToday, 
      change: '-2%', 
      trend: 'down',
      icon: ShieldCheck, 
      color: 'primary' 
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary/10 text-primary border-primary/20'
      case 'secondary': return 'bg-secondary/10 text-secondary-foreground border-secondary/20'
      default: return 'bg-slate-800 text-slate-400 border-slate-700'
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-slate-400 mt-1">Real-time security and authentication monitoring.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="rounded-3xl border-slate-800 shadow-sm hover:shadow-md transition-shadow bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "p-2 rounded-xl border",
                    getColorClasses(kpi.color)
                  )}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className={cn(
                    "rounded-full gap-1 border-none",
                    kpi.trend === 'up' ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
                  )}>
                    <TrendingUp className={cn("w-3 h-3", kpi.trend === 'down' && "rotate-180")} />
                    {kpi.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-400">{kpi.label}</p>
                  <p className="text-3xl font-bold text-white tracking-tight">{isLoading ? '...' : kpi.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <Card className="rounded-3xl border-slate-800 shadow-sm h-full overflow-hidden bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-8 border-b border-slate-800 mb-6">
              <div>
                <CardTitle className="text-lg text-white">Authentication Activity</CardTitle>
                <CardDescription className="text-slate-400">OTP and ISE authentication requests over time.</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-xs font-medium text-slate-400">OTP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  <span className="text-xs font-medium text-slate-400">ISE</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorOtp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderRadius: '16px', 
                        border: '1px solid #1e293b',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        color: '#f8fafc'
                      }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="otps" 
                      stroke="var(--primary)" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorOtp)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="iseAuths" 
                      stroke="#475569" 
                      strokeWidth={3}
                      fillOpacity={0}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="rounded-3xl border-slate-800 shadow-sm bg-slate-900 overflow-hidden">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Network Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">ISE Primary Node</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">192.168.10.55</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-primary bg-primary/20 px-2 py-1 rounded-lg">OPERATIONAL</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
                    <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">ISE Secondary Node</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">192.168.10.56</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-secondary bg-secondary/20 px-2 py-1 rounded-lg">OPERATIONAL</span>
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
