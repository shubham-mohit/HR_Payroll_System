import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MapPin,
  Briefcase,
  Tag,
  DollarSign,
  Calendar,
  Mail,
  User,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

const COUNTRIES = [
  'United States', 'UK', 'Germany', 'Canada',
  'India', 'Australia', 'Japan', 'Singapore', 'France', 'Brazil'
];

const DEPARTMENTS = [
  'Engineering', 'Product', 'HR', 'Finance', 'Marketing', 'Customer Success'
];

const CURRENCY = ['INR', 'USD', 'DHIRAM']

const JOB_TITLES_BY_DEPT = {
  'Engineering': ['Software Engineer', 'Senior Software Engineer', 'Principal Engineer', 'Tech Lead', 'QA Engineer', 'Devops Engineer', 'Data Scientist'],
  'Product': ['Product Manager', 'Senior Product Manager', 'UI/UX Designer'],
  'HR': ['HR Generalist', 'HR Representative', 'HR Manager', 'HR Director'],
  'Finance': ['Accountant', 'Senior Accountant', 'Financial Analyst', 'Senior Financial Analyst'],
  'Marketing': ['Marketing Coordinator', 'Marketing Manager', 'SEO Specialist'],
  'Customer Success': ['Customer Success Associate', 'Customer Success Manager', 'Support Engineer']
};

export function ViewEmployeeModal({ isOpen, onClose, employee }) {
  if (!isOpen || !employee) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="bg-white rounded-none border border-slate-350 max-w-md w-full shadow-2xl overflow-hidden"
        >
          {/* Top Banner Accent */}
          <div className="h-1.5 bg-slate-900" />

          {/* Header */}
          <div className="p-6 pb-0 flex items-center justify-between">
            <h3 className="metric-label font-bold text-slate-500">Employee Register Card</h3>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-900 hover:text-white text-slate-400 rounded-none transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Profile Core */}
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-none bg-slate-50 text-slate-855 border border-slate-250 flex items-center justify-center font-bold text-xl uppercase font-serif">
                {employee.fullName.substring(0, 2)}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-950 leading-tight font-serif tracking-tight">{employee.fullName}</h2>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{employee.email}</p>
                <div className="mt-2 flex items-center gap-1.5 font-sans">
                  <span className="text-[9px] bg-slate-100 border border-slate-205 text-slate-700 font-bold px-1.5 py-0.5 rounded-none uppercase tracking-wider">
                    {employee.department}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded-none text-[9px] font-bold uppercase tracking-wider border ${
                    employee.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}>
                    {employee.status}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-slate-200/60" />

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
              <div className="space-y-1">
                <span className="metric-label font-bold text-slate-400 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-slate-450" />
                  Job Title
                </span>
                <p className="font-bold text-slate-800 font-sans">{employee.jobTitle}</p>
              </div>

              <div className="space-y-1">
                <span className="metric-label font-bold text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-450" />
                  Jurisdiction
                </span>
                <p className="font-bold text-slate-800 font-sans">{employee.country}</p>
              </div>

              <div className="space-y-1">
                <span className="metric-label font-bold text-slate-400 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-450" />
                  Demographic Age
                </span>
                <p className="font-bold text-slate-800 font-sans">{employee.age} Years Old</p>
              </div>

              <div className="space-y-1">
                <span className="metric-label font-bold text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-450" />
                  Hired Date
                </span>
                <p className="font-semibold text-slate-800 font-mono">{employee.startDate}</p>
              </div>

              {/* Salary Section Block */}
              <div className="col-span-2 bg-slate-50/70 rounded-none p-4 border border-slate-200 space-y-1 mt-1">
                <span className="metric-label font-bold text-slate-455 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-slate-505" />
                  Active Direct Compensation
                </span>
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <h4 className="text-2xl font-bold font-serif text-slate-950">
                      ${employee.salary.toLocaleString()}{' '}
                      <span className="text-[10px] text-slate-400 font-sans font-normal lowercase italic">usd</span>
                    </h4>
                    <p className="text-[10px] text-slate-500">Unified Analytics Benchmark Baseline</p>
                  </div>

                  {employee.currency !== 'USD' && (
                    <div className="text-right">
                      <h4 className="text-lg font-bold font-serif text-slate-900">
                        {employee.salary}{' '}
                        <span className="text-[10px] font-sans font-normal">{employee.currency}</span>
                      </h4>
                      <p className="text-[9px] text-slate-500">Localized Local Payroll Amount</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-5 bg-slate-50/70 border-t border-slate-205 flex justify-end gap-2 pr-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-355 text-[10px] uppercase tracking-wider font-bold text-slate-705 bg-white hover:bg-slate-905 hover:text-white rounded-none transition-all cursor-pointer"
            >
              Dismiss Profile
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function EmployeeFormModal({ isOpen, onClose, employee, onSave }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [country, setCountry] = useState('');
  const [salary, setSalary] = useState('');
  const [age, setAge] = useState('');
  const [startDate, setStartDate] = useState('');
  const [status, setStatus] = useState('Active');
  const [currency, setCurrency] = useState('INR')

  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Suggestions for titles based on current dept
  const jobTitleSuggestions = department ? JOB_TITLES_BY_DEPT[department] || [] : [];

  useEffect(() => {
    if (employee) {
      setFullName(employee.fullName);
      setEmail(employee.email);
      setJobTitle(employee.jobTitle);
      setDepartment(employee.department);
      setCountry(employee.country);
      setSalary(employee.salary.toString());
      setAge(employee.age.toString());
      setStartDate(employee.startDate);
      setStatus(employee.status);
      setCurrency(employee.currency);
    } else {
      setFullName('');
      setEmail('');
      setJobTitle('');
      setDepartment('');
      setCountry('IND');
      setSalary('');
      setAge('');
      // Set to current date as standard default
      const today = new Date().toISOString().split('T')[0];
      setStartDate(today);
      setStatus('Active');
      setCurrency("INR")
    }
    setValidationError('');
  }, [employee, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!fullName || !email || !jobTitle || !department || !country || !salary || !age || !startDate) {
      setValidationError('Please complete all fields prior to saving.');
      return;
    }

    if (isNaN(Number(salary)) || Number(salary) < 0) {
      setValidationError('Salary must be a non-negative numerical threshold.');
      return;
    }

    if (isNaN(Number(age)) || Number(age) < 18 || Number(age) > 100) {
      setValidationError('Valid employee demographic age ranges between 18 and 100.');
      return;
    }

    setSaving(true);
    const success = await onSave({
      fullName,
      email,
      jobTitle,
      department,
      country,
      salary: Number(salary),
      age: Number(age),
      startDate,
      // status,
      currency
    });
    setSaving(false);

    if (success) {
      onClose();
    } else {
      setValidationError('Failed to commit record. The email may already be in use.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="bg-white rounded-none border border-slate-355 max-w-lg w-full shadow-2xl overflow-hidden"
        >
          {/* Top Line Accent */}
          <div className="h-1.5 bg-slate-900" />

          {/* Form Tag */}
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="p-6 pb-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/45">
              <div>
                <h3 className="text-xl font-bold text-slate-950 font-serif tracking-tight">
                  {employee ? 'Modify Profile Record' : 'Enroll New Recruits'}
                </h3>
                <p className="text-[11px] text-slate-550 mt-1">
                  {employee ? `Altering profile conditions for active recruit #${employee.id}` : 'Enroll a fresh payroll profile into the organizational index.'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-slate-900 hover:text-white text-slate-400 rounded-none transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Inputs Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-none flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-650" />
                  <p className="font-bold">{validationError}</p>
                </div>
              )}

              {/* Full Name & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="metric-label font-bold text-slate-500 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    Full Name
                  </label>
                  <input
                    id="form-full-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Miller"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 placeholder-slate-400 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="metric-label font-bold text-slate-500 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Email Address
                  </label>
                  <input
                    id="form-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.miller@acme.org"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 placeholder-slate-400 font-sans"
                  />
                </div>
              </div>

              {/* Department & Job Title */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="metric-label font-bold text-slate-500 flex items-center gap-1">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                    Department Group
                  </label>
                  <select
                    id="form-department"
                    required
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      // Auto pick first title suggestion
                      const suggestions = JOB_TITLES_BY_DEPT[e.target.value] || [];
                      if (suggestions.length > 0) setJobTitle(suggestions[0]);
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-slate-750 font-sans cursor-pointer"
                  >
                    <option value="" disabled>Select Department</option>
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="metric-label font-bold text-slate-500 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    Active Job Title
                  </label>
                  {department ? (
                    <div className="relative">
                      <select
                        id="form-job-title-suggested"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-slate-755 font-sans cursor-pointer"
                      >
                        {jobTitleSuggestions.map(title => (
                          <option key={title} value={title}>{title}</option>
                        ))}
                        <option value="custom">-- Enter Custom --</option>
                      </select>
                    </div>
                  ) : (
                    <input
                      id="form-job-title-text"
                      type="text"
                      required
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Select department first..."
                      disabled={!department}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-205 rounded-none placeholder-slate-400 cursor-not-allowed font-sans"
                    />
                  )}
                </div>
              </div>

              {/* Custom job title text if user wants custom */}
              {jobTitle === 'custom' && (
                <div className="space-y-1">
                  <label className="metric-label font-bold text-slate-500">Custom Title Label</label>
                  <input
                    id="form-job-title-custom"
                    type="text"
                    required
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Enter custom job title..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-slate-750 font-sans"
                  />
                </div>
              )}

              {/* Country & Base Salary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="metric-label font-bold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Work Country
                  </label>
                  <select
                    id="form-country"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-slate-750 font-sans cursor-pointer"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="metric-label font-bold text-slate-500 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-slate-405" />
                    Annual Salary
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-400 text-xs font-semibold font-mono">$</span>
                    </div>
                    <input
                      id="form-salary"
                      type="number"
                      required
                      min="0"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="e.g. 95000"
                      className="w-full pl-7 pr-12 py-2 text-xs bg-white border border-slate-250 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 font-mono text-slate-900"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-slate-455 text-[10px] uppercase font-bold font-sans">USD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Age, Start Date, Status */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="metric-label font-bold text-slate-500">Age</label>
                  <input
                    id="form-age"
                    type="number"
                    required
                    min="18"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="35"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 font-mono text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="metric-label font-bold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Joined Date
                  </label>
                  <input
                    id="form-start-date"
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 font-mono text-slate-900 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="metric-label font-bold text-slate-500 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-slate-400" />
                    Currency
                  </label>
                  <select
                    id="form-status"
                    required
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-slate-750 font-sans cursor-pointer"
                  >
                    <option value="Active">INR</option>
                    {/* <option value="On Leave">On Leave</option> */}
                    {CURRENCY.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}

                  </select>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-5 bg-slate-50/70 border-t border-slate-205 flex justify-end gap-2 pr-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-white hover:bg-slate-100 rounded-none transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider rounded-none transition-colors cursor-pointer border border-transparent shadow-xs disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
