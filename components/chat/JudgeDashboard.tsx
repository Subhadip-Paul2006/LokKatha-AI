'use client'

import { ChatMetrics } from '@/lib/chat/types'
import { Activity, Database, Zap, Clock, Cpu } from 'lucide-react'

interface JudgeDashboardProps {
  metrics?: ChatMetrics
  sourcesCount: number
}

export function JudgeDashboard({ metrics, sourcesCount }: JudgeDashboardProps) {
  if (!metrics) return null

  return (
    <div className="mt-6 mb-2 animate-in fade-in duration-500 rounded-xl bg-slate-900 text-slate-300 p-4 font-mono text-xs shadow-lg border border-slate-700">
      <div className="flex items-center gap-2 border-b border-slate-700/50 pb-2 mb-3 text-emerald-400 uppercase tracking-widest font-semibold">
        <Activity size={14} />
        <span>Judge Dashboard — RAG Telemetry</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Zap size={12} /> Total Latency
          </div>
          <div className="text-sm font-medium text-white">{metrics.totalMs}ms</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Database size={12} /> HNSW Retrieval
          </div>
          <div className="text-sm font-medium text-white">{metrics.retrievalMs}ms</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Cpu size={12} /> Gemma LLM
          </div>
          <div className="text-sm font-medium text-white">{metrics.gemmaMs}ms</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Clock size={12} /> Documents
          </div>
          <div className="text-sm font-medium text-white">{sourcesCount} Retrieved</div>
        </div>
      </div>
    </div>
  )
}
