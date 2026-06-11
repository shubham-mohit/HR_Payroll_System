import React from 'react';
import { motion } from 'motion/react';

export default function MetricCard({
  title,
  value,
  subtext,
  icon: Icon,
  colorClass = "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400",
  delay = 0,
  id
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="bg-white border-t-4 border-t-slate-900 border-x border-b border-slate-200/80 p-5 shadow-xs flex items-center justify-between transition-shadow hover:shadow-sm rounded-none"
    >
      <div className="space-y-1">
        <span className="metric-label font-sans block">{title}</span>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight font-serif">{value}</h3>
        <p className="text-[11px] text-gray-400 font-sans tracking-tight">{subtext}</p>
      </div>
      <div className={`p-3 rounded-none border border-slate-100/80 ${colorClass.includes('bg-') ? 'bg-slate-50/50 text-slate-800' : colorClass}`}>
        <Icon className="w-5 h-5 text-slate-700" />
      </div>
    </motion.div>
  );
}
