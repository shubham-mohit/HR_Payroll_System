import React from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ArrowUpDown,
  X
} from 'lucide-react';

const COUNTRIES = [
  'United States', 'United Kingdom', 'Germany', 'Canada',
  'India', 'Australia', 'Japan', 'Singapore', 'France', 'Brazil'
];

const DEPARTMENTS = [
  'Engineering', 'Product', 'HR', 'Finance', 'Marketing', 'Customer Success'
];

export default function EmployeeTable({
  employees,
  pagination,
  currentPage,
  onPageChange,
  search,
  onSearchChange,
  selectedCountry,
  onCountryChange,
  selectedDepartment,
  onDepartmentChange,
  sortBy,
  sortOrder,
  onSort,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onViewEmployee,
  isDeletingId
}) {

  const handleClearFilters = () => {
    onSearchChange('');
    onCountryChange('');
    onDepartmentChange('');
  };

  const hasActiveFilters = search || selectedCountry || selectedDepartment;

  return (
    <div className="bg-white rounded-none border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      {/* Header Utilities */}
      <div className="p-6 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/45">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-serif">
            Employee Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Browse, filter, and modify profiles for the global headcount of 10,000 active recruits.
          </p>
        </div>

        <button
          id="add-employee-btn"
          onClick={onAddEmployee}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-white font-bold text-[10px] uppercase tracking-wider rounded-none transition-all cursor-pointer shadow-sm border border-transparent"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Employee
        </button>
      </div>

      {/* Filters Rails */}
      <div className="p-5 border-b border-slate-200/60 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="relative md:col-span-5 col-span-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="employee-search-input"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search global database..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-250 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 placeholder-slate-455 font-sans"
          />
        </div>

        {/* Country Filter */}
        <div className="md:col-span-3 col-span-1">
          <select
            id="country-filter-select"
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-slate-700 font-medium font-sans cursor-pointer"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div className="md:col-span-3 col-span-1">
          <select
            id="dept-filter-select"
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-slate-700 font-medium font-sans cursor-pointer"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters Reset Button */}
        <div className="md:col-span-1 col-span-1 flex justify-end">
          {hasActiveFilters ? (
            <button
              onClick={handleClearFilters}
              title="Clear Active Filters"
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-655 rounded-none border border-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="p-2 text-slate-300 pointer-events-none">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Grid Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 select-none">
              <th className="p-4 metric-label cursor-pointer hover:bg-slate-100 hover:text-slate-900 transition-colors" onClick={() => onSort('id')}>
                <div className="flex items-center gap-1 font-bold">
                  ID
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-4 metric-label cursor-pointer hover:bg-slate-100 hover:text-slate-900 transition-colors" onClick={() => onSort('fullName')}>
                <div className="flex items-center gap-1 font-bold">
                  Full Name
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-4 metric-label cursor-pointer hover:bg-slate-100 hover:text-slate-900 transition-colors" onClick={() => onSort('jobTitle')}>
                <div className="flex items-center gap-1 font-bold">
                  Job Title
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-4 metric-label cursor-pointer hover:bg-slate-100 hover:text-slate-900 transition-colors" onClick={() => onSort('country')}>
                <div className="flex items-center gap-1 font-bold">
                  Country
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-4 metric-label cursor-pointer hover:bg-slate-100 hover:text-slate-900 transition-colors" onClick={() => onSort('salary')}>
                <div className="flex items-center gap-1 font-bold">
                  Annual Salary
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-4 metric-label cursor-pointer hover:bg-slate-100 hover:text-slate-900 transition-colors" onClick={() => onSort('age')}>
                <div className="flex items-center gap-1 font-bold">
                  Age
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-2 py-4 metric-label text-center font-bold">
                Status
              </th>
              <th className="p-4 metric-label text-right font-bold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-12 text-center text-slate-400 text-xs">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <X className="w-8 h-8 text-slate-300" />
                    <p className="font-bold text-slate-800 uppercase tracking-widest text-[10px]">No records match this criteria.</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">Try clearing filter conditions or modifying search inputs.</p>
                    <button
                      onClick={handleClearFilters}
                      className="mt-2 text-slate-900 text-[10px] font-bold uppercase tracking-wider underline cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr
                  id={`emp-row-${emp.id}`}
                  key={emp.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="p-4 text-xs text-slate-400 font-mono">
                    #{emp.employeeCode}
                  </td>
                  <td className="p-4 font-sans">
                    <div className="font-bold text-slate-900 text-xs">{emp.fullName}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{emp.email}</div>
                  </td>
                  <td className="p-4 font-sans">
                    <div className="text-xs text-slate-800 font-semibold">{emp.jobTitle}</div>
                    {/* <span className="inline-block text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-none mt-1 uppercase tracking-wider font-bold border border-slate-205">
                      {emp.department}
                    </span> */}
                  </td>
                  <td className="p-4 text-xs text-slate-600 font-medium font-sans">
                    {emp.country}
                  </td>
                  <td className="p-4 font-mono font-bold">
                    <div className="text-[13px] text-slate-500 mt-0.5 font-normal">
                       {emp.currency} {emp.salary}
                      </div>

                  </td>
                  <td className="p-4 text-xs text-slate-550 font-mono">
                    {emp.age} <span className="text-[10px] text-slate-400 font-sans">yrs</span>
                  </td>
                  <td className="p-2 py-4">
                    <div className="flex justify-center">
                      <span className={`inline-flex items-center px-2 py-0.5 ... ${!emp.isDeleted
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-255/50'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}>
                        {emp.isDeleted ? 'Inactive' : 'Active'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewEmployee(emp)}
                        title="View Detailed Card"
                        className="p-1.5 hover:bg-slate-900 hover:text-white border border-transparent rounded-none text-slate-500 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditEmployee(emp)}
                        title="Edit Record"
                        className="p-1.5 hover:bg-slate-900 hover:text-white border border-transparent rounded-none text-slate-500 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteEmployee(emp.id)}
                        disabled={isDeletingId === emp.id}
                        title="Delete Record"
                        className="p-1.5 hover:bg-red-650 hover:text-white border border-transparent rounded-none text-slate-450 transition-all cursor-pointer disabled:opacity-40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Rails */}
      {employees.length > 0 && (
        <div className="p-5 border-t border-slate-205 bg-slate-50/45 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
          <div className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-800">{(currentPage - 1) * pagination.limit + 1}</span> to{' '}
            <span className="font-semibold text-slate-800">
              {Math.min(currentPage * pagination.limit, pagination.total)}
            </span> of <span className="font-semibold text-slate-800">{pagination.total}</span> records
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-250 rounded-none hover:bg-white text-slate-700 transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Render subset of page numbers */}
            {(() => {
              const pages = [];
              const totalPages = pagination.totalPages;

              if (totalPages <= 5) {
                for (let p = 1; p <= totalPages; p++) pages.push(p);
              } else {
                if (currentPage <= 3) {
                  pages.push(1, 2, 3, '...', totalPages);
                } else if (currentPage >= totalPages - 2) {
                  pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
                } else {
                  pages.push(1, '...', currentPage, '...', totalPages);
                }
              }

              return pages.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof p === 'number' && onPageChange(p)}
                  disabled={typeof p !== 'number'}
                  className={`px-3 py-1.5 text-xs font-bold rounded-none border transition-colors ${p === currentPage
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs font-mono font-bold'
                      : typeof p === 'number'
                        ? 'border-slate-250 hover:bg-white text-slate-705 hover:border-slate-400 cursor-pointer font-mono'
                        : 'border-transparent text-slate-400 cursor-default font-mono'
                    }`}
                >
                  {p}
                </button>
              ));
            })()}

            <button
              onClick={() => onPageChange(Math.min(currentPage + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages}
              className="p-2 border border-slate-250 rounded-none hover:bg-white text-slate-700 transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
