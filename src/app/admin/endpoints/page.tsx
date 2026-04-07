'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Laptop, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Loader2,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Wifi,
  WifiOff,
  Terminal,
  Clock
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'

interface Endpoint {
  id: string
  macAddress: string
  hostname: string
  status: 'AUTHORIZED' | 'UNAUTHORIZED' | 'PENDING'
  userId: string | null
  user: {
    username: string
    displayName: string
  } | null
  updatedAt: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

export default function EndpointsPage() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEndpoints()
  }, [])

  const fetchEndpoints = async () => {
    try {
      const res = await fetch('/api/endpoints')
      const data = await res.json()
      setEndpoints(data)
    } catch (error) {
      toast.error('Failed to fetch endpoints')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredEndpoints = endpoints.filter(endpoint => 
    endpoint.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    endpoint.macAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
    endpoint.user?.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AUTHORIZED':
        return <Badge className="bg-primary/20 text-primary border-none rounded-full">Authorized</Badge>
      case 'UNAUTHORIZED':
        return <Badge variant="destructive" className="rounded-full">Blocked</Badge>
      default:
        return <Badge variant="outline" className="rounded-full border-slate-700 text-slate-400">Pending</Badge>
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white">Endpoint Management</h1>
        <p className="text-slate-400 mt-1">Monitor and authorize network devices and workstations.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Search by hostname, MAC, or user..." 
            className="pl-10 rounded-xl border-slate-800 bg-slate-900 focus-visible:ring-primary h-10 text-white"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="rounded-xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 w-full sm:w-auto">
          <Plus className="w-4 h-4" /> Add Endpoint
        </Button>
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
                <TableHead className="pl-6 text-slate-400">Endpoint</TableHead>
                <TableHead className="text-slate-400">MAC Address</TableHead>
                <TableHead className="text-slate-400">Assigned User</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Last Seen</TableHead>
                <TableHead className="text-right pr-6 text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEndpoints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center text-slate-500">
                    No endpoints found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEndpoints.map((endpoint) => (
                  <TableRow key={endpoint.id} className="group transition-colors border-slate-800 hover:bg-slate-800/30">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                          <Laptop className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{endpoint.hostname || 'Unknown Device'}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Workstation</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono border border-slate-700">
                        {endpoint.macAddress}
                      </code>
                    </TableCell>
                    <TableCell>
                      {endpoint.user ? (
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                            {endpoint.user.displayName.charAt(0).toUpperCase()}
                          </div>
                          {endpoint.user.displayName}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(endpoint.status)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">
                      {new Date(endpoint.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-800 text-slate-400">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-300">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-800" />
                          <DropdownMenuItem className="hover:bg-slate-800 hover:text-white cursor-pointer rounded-lg m-1">
                            <Terminal className="w-4 h-4 mr-2" /> Remote Console
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-slate-800 hover:text-white cursor-pointer rounded-lg m-1">
                            {endpoint.status === 'AUTHORIZED' ? (
                              <><WifiOff className="w-4 h-4 mr-2" /> Revoke Access</>
                            ) : (
                              <><Wifi className="w-4 h-4 mr-2" /> Authorize Access</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-800" />
                          <DropdownMenuItem className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-lg m-1">
                            <Trash2 className="w-4 h-4 mr-2" /> Remove Endpoint
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
