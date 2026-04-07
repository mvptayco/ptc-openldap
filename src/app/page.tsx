'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldCheck, ArrowRight, Lock, Users, Laptop, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-white">
      {/* Header */}
      <header className="h-20 border-b border-slate-900 flex items-center justify-between px-8 md:px-20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SecureAuth</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/login">
            <Button variant="ghost" className="rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-900">Sign In</Button>
          </Link>
          <Link href="/admin/login">
            <Button className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all font-semibold px-6">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden bg-slate-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-semibold mb-8 border border-secondary/30">
            <Activity className="w-4 h-4" />
            Next Generation Identity Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-8">
            Secure Your Enterprise <br />
            <span className="text-primary">Without Friction</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Advanced LDAP integration, Multi-Factor Authentication, and Network Access Control in one unified security platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/admin/login">
              <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 group">
                Access Admin Panel
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" className="h-14 px-8 rounded-2xl border-slate-800 text-lg font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition-all">
              View Documentation
            </Button>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mt-32 max-w-6xl w-full"
        >
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm text-left hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Directory Integration</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Seamlessly sync with your existing LDAP and Active Directory infrastructure with real-time identity mapping.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm text-left hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary-foreground mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Multi-Factor Auth</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Bulletproof security with TOTP and email-based one-time passwords, ensuring every login is verified.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm text-left hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary-foreground mb-6">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Network Control</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Advanced Cisco ISE integration for granular network access policies based on user identity and device posture.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-slate-900 text-center bg-slate-950">
        <p className="text-slate-500 text-sm font-medium">
          &copy; 2026 SecureAuth Identity Systems. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
