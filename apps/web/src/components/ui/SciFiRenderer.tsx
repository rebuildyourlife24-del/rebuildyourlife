'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UISpec, InteractionSchema } from '@/lib/semantic-etl/schemas';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { SafeErrorBoundary } from './SafeErrorBoundary';
import { Download, Maximize2, Share2, X } from 'lucide-react';

export function SciFiRenderer({ spec }: { spec: UISpec }) {
  if (!spec || !spec.pages || spec.pages.length === 0) return null;

  const page = spec.pages[0];

  return (
    <div 
      className="space-y-8 w-full"
      style={{ 
        color: spec.palette.text,
        fontFamily: spec.fontTokens.body
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 
          className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2"
          style={{ fontFamily: spec.fontTokens.header, color: spec.palette.primary }}
        >
          {page.title}
        </h1>
      </motion.div>

      {page.panels.map((panel, pIdx) => (
        <motion.div 
          key={panel.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: pIdx * 0.2 }}
          className="mb-8"
        >
          {panel.title && (
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4 opacity-80" style={{ color: spec.palette.accent }}>
              {panel.title}
            </h2>
          )}
          
          <div 
            className="grid gap-6"
            style={{
              gridTemplateColumns: `repeat(${panel.layout.columns}, minmax(0, 1fr))`
            }}
          >
            {panel.components.map((comp) => (
              <SafeErrorBoundary key={comp.id}>
                <SciFiComponent component={comp} spec={spec} />
              </SafeErrorBoundary>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SciFiComponent({ component, spec }: { component: any, spec: UISpec }) {
  const [isDrillthroughOpen, setDrillthroughOpen] = useState(false);
  const [drillData, setDrillData] = useState<any>(null);

  const isNeon = component.style?.neonGlow;
  const bgColor = component.style?.backgroundColor || '#0a0a0a';
  
  // Dummy data generator
  const dummyData = [
    { name: 'Jan', value: 4000, secondary: 2400 },
    { name: 'Feb', value: 3000, secondary: 1398 },
    { name: 'Mar', value: 2000, secondary: 9800 },
    { name: 'Apr', value: 2780, secondary: 3908 },
    { name: 'May', value: 1890, secondary: 4800 },
    { name: 'Jun', value: 2390, secondary: 3800 },
    { name: 'Jul', value: 3490, secondary: 4300 },
  ];

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dummyData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${component.id}_export.json`);
    dlAnchorElem.click();
  };

  const handleChartClick = (dataPoint: any) => {
    // Check if component has a drillthrough interaction defined
    const hasDrillthrough = component.interactions?.some((i: any) => i.action === 'drillthrough');
    if (hasDrillthrough || component.type.includes('Chart')) {
      setDrillData(dataPoint?.activePayload?.[0]?.payload || dataPoint);
      setDrillthroughOpen(true);
    }
  };

  const renderContent = () => {
    switch (component.type) {
      case 'BarChart':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dummyData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#000', border: `1px solid ${spec.palette.primary}` }} cursor={{fill: '#222'}} />
              <Bar dataKey="value" fill={component.style?.colorScheme?.[0] || spec.palette.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'LineChart':
      case 'LineGraph':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dummyData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#000', border: `1px solid ${spec.palette.accent}` }} />
              <Line type="monotone" dataKey="value" stroke={component.style?.colorScheme?.[0] || spec.palette.accent} strokeWidth={3} dot={{ r: 4, fill: '#000', strokeWidth: 2 }} activeDot={{ r: 8, onClick: () => handleChartClick(dummyData[0]) }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'Card':
      case 'Gauge':
      case 'Text':
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[150px] cursor-pointer" onClick={() => handleChartClick({ summary: "Card Clicked" })}>
            <span className="text-4xl font-black" style={{ color: component.style?.colorScheme?.[0] || spec.palette.primary }}>
              {component.type === 'Gauge' ? '84%' : '€ 1.2M'}
            </span>
            {component.dataBinding?.query && (
              <span className="text-xs mt-2 opacity-50 font-mono text-center px-4">
                {component.dataBinding.query}
              </span>
            )}
          </div>
        );
      case 'PieChart':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart onClick={handleChartClick}>
              <Pie data={dummyData.slice(0, 4)} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {dummyData.slice(0,4).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={component.style?.colorScheme?.[index % 2] || (index % 2 === 0 ? spec.palette.primary : spec.palette.accent)} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <div className="flex items-center justify-center h-[200px] border border-dashed border-zinc-700">
            <span className="text-zinc-500 font-mono text-xs">Unsupported Type: {component.type}</span>
          </div>
        );
    }
  };

  return (
    <>
      <div 
        className={`relative rounded-xl border flex flex-col overflow-hidden transition-all duration-500 group`}
        style={{
          gridColumn: `span ${component.size.width}`,
          gridRow: `span ${component.size.height}`,
          backgroundColor: bgColor,
          borderColor: isNeon ? spec.palette.primary : '#222',
          boxShadow: isNeon ? `0 0 20px ${spec.palette.primary}20` : 'none',
        }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(${spec.palette.primary} 1px, transparent 1px), linear-gradient(90deg, ${spec.palette.primary} 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
        
        {component.title && (
          <div className="px-4 py-3 border-b border-white/5 relative z-10 flex justify-between items-center bg-black/40">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300">
                {component.title}
              </h3>
              {isNeon && (
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: spec.palette.accent }}></span>
              )}
            </div>
            
            {/* Office 365 Toolbar (Export, Maximize, Share) */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={handleExport} className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white" title="Export Data">
                 <Download className="w-3 h-3" />
               </button>
               <button className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white" title="Share Panel">
                 <Share2 className="w-3 h-3" />
               </button>
               <button onClick={() => setDrillthroughOpen(true)} className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white" title="Maximize">
                 <Maximize2 className="w-3 h-3" />
               </button>
            </div>
          </div>
        )}
        
        <div className="p-4 relative z-10 flex-1">
          {renderContent()}
        </div>
      </div>

      {/* Drill-through Modal */}
      <AnimatePresence>
        {isDrillthroughOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-black border rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
              style={{ borderColor: spec.palette.primary, boxShadow: `0 0 30px ${spec.palette.primary}40` }}
            >
              <div className="p-4 border-b flex justify-between items-center bg-zinc-900/50" style={{ borderColor: `${spec.palette.primary}40` }}>
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-widest text-white">Drill-through: {component.title}</h2>
                  <p className="text-xs font-mono text-zinc-400 mt-1">Detailed analysis view</p>
                </div>
                <button onClick={() => setDrillthroughOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="p-6 flex-1 min-h-[400px]">
                {/* Re-render the chart but bigger, or show raw data table */}
                <div className="mb-6 h-[300px]">
                  {renderContent()}
                </div>
                <div className="border border-zinc-800 rounded bg-zinc-950 p-4">
                   <h3 className="text-sm font-bold text-zinc-300 mb-4 uppercase">Raw Drill-down Data</h3>
                   {drillData ? (
                     <pre className="text-xs font-mono text-emerald-400 overflow-x-auto">
                       {JSON.stringify(drillData, null, 2)}
                     </pre>
                   ) : (
                     <p className="text-xs font-mono text-zinc-500">Select a specific data point in the chart above to view raw metrics.</p>
                   )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

