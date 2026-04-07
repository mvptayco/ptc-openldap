'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  BarChart3, 
  PieChart as PieChartIcon,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
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

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      toast.success('Report generated successfully')
    }, 1500)
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
          <h1 className="text-3xl font-bold text-white">Security Reports</h1>
          <p className="text-slate-400 mt-1">Generate and export detailed security and compliance audits.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="7d">
            <SelectTrigger className="w-[180px] rounded-xl border-slate-800 bg-slate-900 text-white">
              <Calendar className="w-4 h-4 mr-2 text-slate-500" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white rounded-2xl">
              <SelectItem value="24h" className="focus:bg-slate-800">Last 24 Hours</SelectItem>
              <SelectItem value="7d" className="focus:bg-slate-800">Last 7 Days</SelectItem>
              <SelectItem value="30d" className="focus:bg-slate-800">Last 30 Days</SelectItem>
              <SelectItem value="90d" className="focus:bg-slate-800">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/20 px-6"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants}>
          <Card className="rounded-3xl border-slate-800 shadow-sm overflow-hidden border-t-4 border-t-primary bg-slate-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary/20 rounded-xl text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <Badge className="bg-primary/20 text-primary border-none gap-1 rounded-full">
                  <TrendingUp className="w-3 h-3" /> +12%
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-400">Compliance Score</p>
                <p className="text-2xl font-bold text-white">98.4%</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="rounded-3xl border-slate-800 shadow-sm overflow-hidden border-t-4 border-t-secondary bg-slate-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-secondary/20 rounded-xl text-secondary-foreground">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <Badge className="bg-secondary/20 text-secondary-foreground border-none gap-1 rounded-full">
                  <TrendingUp className="w-3 h-3" /> +5%
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-400">Auth Volume</p>
                <p className="text-2xl font-bold text-white">12,482</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="rounded-3xl border-slate-800 shadow-sm overflow-hidden border-t-4 border-t-secondary bg-slate-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-secondary/20 rounded-xl text-secondary-foreground">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-secondary-foreground border-secondary/20 bg-secondary/10 gap-1 rounded-full">
                  Normal
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-400">Blocked Attempts</p>
                <p className="text-2xl font-bold text-white">24</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="rounded-3xl border-slate-800 shadow-sm overflow-hidden border-t-4 border-t-destructive bg-slate-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-destructive/20 rounded-xl text-destructive">
                  <PieChartIcon className="w-5 h-5" />
                </div>
                <Badge className="bg-destructive/20 text-destructive border-none gap-1 rounded-full">
                  -2%
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-400">System Latency</p>
                <p className="text-2xl font-bold text-white">42ms</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="rounded-3xl border-slate-800 shadow-sm overflow-hidden h-full bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <CardTitle className="text-lg text-white">Recent Reports</CardTitle>
                <CardDescription className="text-slate-400">History of generated audit documents.</CardDescription>
              </div>
              <Button variant="ghost" className="text-primary rounded-xl hover:bg-primary/10">View All</Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[
                  { name: 'Monthly Compliance Audit - March 2026', type: 'PDF', size: '2.4 MB', date: 'Apr 1, 2026' },
                  { name: 'Weekly OTP Authentication Log', type: 'CSV', size: '842 KB', date: 'Mar 28, 2026' },
                  { name: 'ISE Policy Synchronization Report', type: 'XLSX', size: '1.2 MB', date: 'Mar 25, 2026' },
                  { name: 'Annual Security Assessment', type: 'PDF', size: '12.8 MB', date: 'Jan 15, 2026' }
                ].map((report, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 border border-slate-800 group hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{report.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{report.type} • {report.size} • {report.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-900 shadow-sm border border-transparent hover:border-slate-800">
                      <Download className="w-4 h-4 text-slate-500 group-hover:text-primary" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="rounded-3xl border-slate-800 shadow-sm overflow-hidden h-full bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg text-white">Report Configuration</CardTitle>
              <CardDescription className="text-slate-400">Scheduled report generation settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-3">Automated Reports</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Daily Health Check</span>
                      <Badge className="bg-primary text-primary-foreground border-none rounded-full px-2 py-0 text-[10px]">08:00 AM</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Weekly Audit Log</span>
                      <Badge className="bg-primary text-primary-foreground border-none rounded-full px-2 py-0 text-[10px]">MON 00:00</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                  <p className="text-xs font-bold text-primary uppercase mb-2">Delivery Targets</p>
                  <div className="space-y-2">
                    <p className="text-xs text-slate-400">Reports are automatically sent to:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="rounded-full bg-slate-900 border-slate-800 text-slate-300">security-ops@ptc.com</Badge>
                      <Badge variant="outline" className="rounded-full bg-slate-900 border-slate-800 text-slate-300">compliance@ptc.com</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold">
                Configure Automation
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
