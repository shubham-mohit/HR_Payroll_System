import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award } from 'lucide-react';

const COUNTRIES = [
  'United States', 'UK', 'Germany', 'Canada',
  'India', 'Australia', 'Japan', 'Singapore', 'France', 'Brazil'
];

export default function InsightsDashboard({ authToken }) {
  const [selectedCountry, setSelectedCountry] = useState('UK');
  const [countryData, setCountryData] = useState(null);
  const [jobTitleData, setJobTitleData] = useState([]);
  const [selectedJobTitle, setJobTitle] = useState('HR Manager');
  const [ageDistribution, setAgeDistribution] = useState([]);
  const [newHiresCount, setNewHiresCount] = useState(0);
  const [newHiresList, setNewHiresList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchCountrySpecificData() {
      if (!authToken) return;
      setLoading(true);
      setErrorMsg('');
      try {
        const countryRes = await fetch(`/api/insight/country/${encodeURIComponent(selectedCountry)}`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const cMetric = await countryRes.json();

        const titlesRes = await fetch(
          `/api/insight/jobTitle?jobTitle=${encodeURIComponent(selectedJobTitle)}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        const tMetric = await titlesRes.json();

        // ✅ API returns { success, data: { country, employee_count, salary: {min,max,avg}, by_job_title } }
        setCountryData(cMetric.data);

        // ✅ API returns { success, data: { by_country: [...] } }
        setJobTitleData((tMetric.data?.by_country || []).slice(0, 10));
      } catch (err) {
        setErrorMsg('Error pulling localized geographic insights.');
      } finally {
        setLoading(false);
      }
    }
    fetchCountrySpecificData();
  }, [selectedCountry, authToken]);

  useEffect(() => {
    async function fetchGlobalInsights() {
      if (!authToken) return;
      try {
        // ✅ API returns { success, data: [{ range, employee_count }] }
        const ageRes = await fetch('/api/insight/age-distribution', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const aDist = await ageRes.json();
        setAgeDistribution(aDist.data || []);

        // ✅ API returns { success, data: { month, employee_count, hires: [...] } }
        const hireRes = await fetch('/api/insight/new-hires', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const hData = await hireRes.json();
        setNewHiresCount(hData.data?.employee_count || 0);
        setNewHiresList(hData.data?.hires || []);
      } catch (err) {
        console.error('Error fetching global trends metrics', err);
      }
    }
    fetchGlobalInsights();
  }, [authToken]);

  return (
    <div className="space-y-6">

      {/* Selection Control Panel */}
      <div className="bg-white rounded-none border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 font-serif">
            Geographic Pay Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare salary dispersion, minimum thresholds, and title pay disparity across global organizational branches.
          </p>
        </div>
        <div>
          <select
            id="insights-country-select"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-3 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer"
          >
            {COUNTRIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {errorMsg ? (
        <div className="p-4 bg-red-50 border border-red-100 text-red-755 text-xs rounded-none">
          {errorMsg}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-8 space-y-6">

            {/* Salary Cards — uses countryData.salary.avg/min/max */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 border-t-4 border-t-slate-900 border-x border-b border-slate-200 shadow-xs space-y-1.5 hover:shadow-sm transition-shadow rounded-none">
                <span className="metric-label flex items-center gap-1 select-none">Average Annual Salary</span>
                <h3 className="text-2xl font-bold font-serif text-slate-950">
                  ${countryData?.salary?.avg?.toLocaleString() || '0'}{' '}
                  <span className="text-[10px] text-slate-400 font-sans font-normal lowercase italic">usd</span>
                </h3>
                <p className="text-[10px] text-slate-500">Realtime mean pay level in {selectedCountry}</p>
              </div>

              <div className="bg-white p-5 border-t-4 border-t-slate-900 border-x border-b border-slate-200 shadow-xs space-y-1.5 hover:shadow-sm transition-shadow rounded-none">
                <span className="metric-label flex items-center gap-1 select-none">Minimum Recipient</span>
                <h3 className="text-2xl font-bold font-serif text-slate-950">
                  ${countryData?.salary?.min?.toLocaleString() || '0'}{' '}
                  <span className="text-[10px] text-slate-400 font-sans font-normal lowercase italic">usd</span>
                </h3>
                <p className="text-[10px] text-slate-500">Floor standard compensation boundary</p>
              </div>

              <div className="bg-white p-5 border-t-4 border-t-slate-900 border-x border-b border-slate-200 shadow-xs space-y-1.5 hover:shadow-sm transition-shadow rounded-none">
                <span className="metric-label flex items-center gap-1 select-none">Ceiling Maximum</span>
                <h3 className="text-2xl font-bold font-serif text-slate-950">
                  ${countryData?.salary?.max?.toLocaleString() || '0'}{' '}
                  <span className="text-[10px] text-slate-400 font-sans font-normal lowercase italic">usd</span>
                </h3>
                <p className="text-[10px] text-slate-500">Peak executive cap in regional branch</p>
              </div>
            </div>

            {/* Job Title Table — uses by_country fields: avg_salary, min_salary, max_salary, employee_count */}
            <div className="bg-white border border-slate-200 shadow-xs p-5 rounded-none">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900 select-none font-serif">Job Title Pay Dispersion</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Comparative salary breakdown for <span className="font-bold">{selectedJobTitle}</span> across countries.
                  </p>
                </div>
                <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-750 font-bold px-2 py-0.5 rounded-none uppercase font-mono">
                  {countryData?.employee_count} headcounts
                </span>
              </div>

              <div className="overflow-x-auto mt-3">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="metric-label text-slate-500 border-b border-slate-200 select-none">
                      <th className="py-2.5 font-bold">Country</th>
                      <th className="py-2.5 text-right font-bold">Average Pay</th>
                      <th className="py-2.5 text-right font-bold">Compensation Range (Min - Max)</th>
                      <th className="py-2.5 text-right font-bold">Active Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobTitleData.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400 font-light">
                          No data available for this job title.
                        </td>
                      </tr>
                    ) : (
                      jobTitleData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 font-semibold text-slate-950 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            {row.country}
                          </td>
                          <td className="py-3 text-right font-bold text-slate-950 font-mono">
                            ${Math.round(row.avg_salary).toLocaleString()}
                          </td>
                          <td className="py-3 text-right text-slate-500 font-mono">
                            ${row.min_salary.toLocaleString()} - ${row.max_salary.toLocaleString()}
                          </td>
                          <td className="py-3 text-right font-medium text-slate-600 font-mono">
                            {row.employee_count} <span className="text-[10px] text-slate-400 font-sans">recruits</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Age Distribution — uses item.range and item.employee_count (no avgSalary in this API) */}
            <div className="bg-white border border-slate-200 shadow-xs p-5 rounded-none">
              <h3 className="text-base font-bold text-slate-900 select-none flex items-center gap-1.5 pb-1 font-serif">
                Demographic Cohort Metrics
              </h3>
              <p className="text-[10px] text-slate-450 pb-4 border-b border-slate-200">
                Unified distribution of organizational personnel split by demographic age-cohorts.
              </p>

              <div className="space-y-4 mt-5 font-sans">
                {ageDistribution.map((item, idx) => {
                  const maxCount = Math.max(...ageDistribution.map(a => a.employee_count), 1);
                  const percentage = (item.employee_count / maxCount) * 100;

                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{item.range} Cohort</span>
                        <span className="font-mono text-slate-900 font-bold">
                          {item.employee_count.toLocaleString()} members
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-none overflow-hidden flex border border-slate-200/50">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.6, delay: idx * 0.1 }}
                          className="h-full rounded-none bg-slate-900"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT: New Hires Feed */}
          <div className="lg:col-span-4 space-y-6">

            <div className="bg-slate-900 text-white rounded-none p-5 shadow-md border border-slate-950 flex flex-col justify-between aspect-video relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-32 h-32 rounded-none bg-white/5 blur-xl pointer-events-none" />
              <div className="space-y-1 relative z-10">
                <span className="text-[9px] font-bold text-slate-350 uppercase tracking-widest flex items-center">
                  <span className="w-2 h-2 rounded-none bg-emerald-500 mr-2 animate-pulse" />
                  Monthly Velocity Index
                </span>
                <h4 className="text-sm font-semibold text-slate-100 font-serif italic">June period additions</h4>
              </div>
              <div className="relative z-10">
                <h2 className="text-4xl font-bold font-serif italic tracking-tight text-white">{newHiresCount}</h2>
                <p className="text-[10px] text-slate-400 mt-1">
                  New employees onboarded across global registries this month.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-none border border-slate-200 shadow-xs p-5 flex flex-col">
              <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider font-sans">Onboarding Registry Log</h3>
                <span className="text-[8px] uppercase font-bold text-slate-400 font-mono tracking-widest">June 2026</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto mt-2 pr-1 space-y-1">
                {newHiresList.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">No recruits onboarded during this period.</p>
                ) : (
                  newHiresList.map((hire, idx) => (
                    <div key={idx} className="py-2.5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-none bg-slate-50 text-slate-800 border border-slate-200 flex items-center justify-center font-bold text-[10px] uppercase shrink-0 font-serif">
                        {hire.fullName.substring(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1 font-sans">
                        <h4 className="text-xs font-bold text-slate-950 truncate leading-tight">{hire.fullName}</h4>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{hire.jobTitle}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="inline-block text-[8px] bg-slate-100 border border-slate-200/60 text-slate-650 px-1 rounded-none uppercase tracking-wider font-bold">
                            {hire.country}
                          </span>
                          <span className="inline-block text-[8px] text-slate-400 font-mono">
                            {hire.startDate}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 font-mono text-[10px] font-bold text-slate-900">
                        ${hire.salary.toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
