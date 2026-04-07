'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  History, 
  Search, 
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Shield,
  Filter,
  Download
} from 'lucide-react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Log {
  id: string
  userId: string
  action: string
  status: 'SUCCESS' | 'FAILED' | 'PENDING'
  details: string | null
  ipAddress: string | null
  createdAt: string
  user: {
    username: string
    displayName: string
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs')
      const data = await res.json()
      setLogs(data)
    } catch (error) {
      toast.error('Failed to fetch logs')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredLogs = logs.filter(log => 
    log.user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
        <p className="text-slate-400 mt-1">Track authentication attempts and security events.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Search logs by user, action or details..." 
            className="pl-10 rounded-xl border-slate-800 bg-slate-900 focus-visible:ring-primary h-10 text-white"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="rounded-xl gap-2 flex-1 sm:flex-initial border-slate-800 hover:bg-slate-800 text-slate-300">
            <Filter className="w-4 h-4" /> Filters
          </Button>
          <Button variant="outline" className="rounded-xl gap-2 flex-1 sm:flex-initial border-slate-800 hover:bg-slate-800 text-slate-300">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-800/50">
              <TableRow className="border-slate-800">
                <TableHead className="pl-6 text-slate-400">Timestamp</TableHead>
                <TableHead className="text-slate-400">User</TableHead>
                <TableHead className="text-slate-400">Action</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">IP Address</TableHead>
                <TableHead className="pr-6 text-slate-400 text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center text-slate-500">
                    No logs found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="group transition-colors border-slate-800 hover:bg-slate-800/30">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                          {log.user.displayName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-white">{log.user.displayName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-300 font-mono">{log.action}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "rounded-full border-none px-2 py-0.5 text-[10px] font-bold",
                        log.status === 'SUCCESS' ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
                      )}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-500 font-mono">{log.ipAddress || 'Internal'}</span>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <span className="text-xs text-slate-400 italic">{log.details || '-'}</span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </motion.div>
  )
}
