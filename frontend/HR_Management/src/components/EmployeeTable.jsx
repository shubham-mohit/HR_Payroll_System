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
  pagination,           // { total, page, limit, totalPages, hasNextPage, hasPrevPage }
  currentPage,          // kept for compat; falls back to pagination.page
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

  const activePage = pagination?.page ?? currentPage;

  const handleClearFilters = () => {
    onSearchChange('');
    onCountryChange('');
    onDepartmentChange('');
  };

  const hasActiveFilters = search || selectedCountry || selectedDepartment;

  return (
    <div className="bg-white rounded-none border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">

      {/* Header */}
      <div className="p-6 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/45">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-serif">
            Employee Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Browse, filter, and modify profiles for the global headcount of active recruits.
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

      {/* Filters */}
      <div className="p-5 border-b border-slate-200/60 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
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

        <div className="md:col-span-3 col-span-1">
          <select
            id="country-filter-select"
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-slate-700 font-medium font-sans cursor-pointer"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="md:col-span-3 col-span-1">
          <select
            id="dept-filter-select"
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-slate-700 font-medium font-sans cursor-pointer"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 select-none">
              {[
                { label: 'ID',            key: 'id'        },
                { label: 'Full Name',     key: 'fullName'  },
                { label: 'Job Title',     key: 'jobTitle'  },
                { label: 'Country',       key: 'country'   },
                { label: 'Annual Salary', key: 'salary'    },
                { label: 'Age',           key: 'age'       },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  className="p-4 metric-label cursor-pointer hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  onClick={() => onSort(key)}
                >
                  <div className="flex items-center gap-1 font-bold">
                    {label}
                    {/* Highlight active sort column */}
                    <ArrowUpDown className={`w-3 h-3 ${sortBy === key ? 'text-slate-900' : 'text-slate-400'}`} />
                  </div>
                </th>
              ))}
              <th className="p-4 metric-label text-right font-bold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-400 text-xs">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <X className="w-8 h-8 text-slate-300" />
                    <p className="font-bold text-slate-800 uppercase tracking-widest text-[10px]">
                      No records match this criteria.
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Try clearing filter conditions or modifying search inputs.
                    </p>
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
                  </td>
                  <td className="p-4 text-xs text-slate-600 font-medium font-sans">
                    {emp.country}
                  </td>
                  <td className="p-4 font-mono">
                    <div className="text-[13px] text-slate-500 font-normal">
                      {emp.currency} {emp.salary}
                    </div>
                  </td>
                  <td className="p-4 text-xs text-slate-550 font-mono">
                    {emp.age} <span className="text-[10px] text-slate-400 font-sans">yrs</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewEmployee(emp)}
                        title="View"
                        className="p-1.5 hover:bg-slate-900 hover:text-white border border-transparent rounded-none text-slate-500 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditEmployee(emp)}
                        title="Edit"
                        className="p-1.5 hover:bg-slate-900 hover:text-white border border-transparent rounded-none text-slate-500 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteEmployee(emp.id)}
                        disabled={isDeletingId === emp.id}
                        title="Delete"
                        className="p-1.5 hover:bg-red-600 hover:text-white border border-transparent rounded-none text-slate-450 transition-all cursor-pointer disabled:opacity-40"
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

      {/* Pagination */}
      {employees.length > 0 && (
        <div className="p-5 border-t border-slate-205 bg-slate-50/45 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
          <div className="text-xs text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-800">
              {(activePage - 1) * pagination.limit + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-800">
              {Math.min(activePage * pagination.limit, pagination.total)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-800">{pagination.total}</span> records
          </div>

          <div className="flex items-center gap-1.5">
            {/* Prev — uses hasPrevPage from server */}
            <button
              onClick={() => onPageChange(activePage - 1)}
              disabled={!pagination.hasPrevPage}
              className="p-2 border border-slate-250 rounded-none hover:bg-white text-slate-700 transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {(() => {
              const pages = [];
              const total = pagination.totalPages;

              if (total <= 5) {
                for (let p = 1; p <= total; p++) pages.push(p);
              } else if (activePage <= 3) {
                pages.push(1, 2, 3, '...', total);
              } else if (activePage >= total - 2) {
                pages.push(1, '...', total - 2, total - 1, total);
              } else {
                pages.push(1, '...', activePage, '...', total);
              }

              return pages.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof p === 'number' && onPageChange(p)}
                  disabled={typeof p !== 'number'}
                  className={`px-3 py-1.5 text-xs font-bold rounded-none border transition-colors ${
                    p === activePage
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs font-mono'
                      : typeof p === 'number'
                        ? 'border-slate-250 hover:bg-white text-slate-705 hover:border-slate-400 cursor-pointer font-mono'
                        : 'border-transparent text-slate-400 cursor-default font-mono'
                  }`}
                >
                  {p}
                </button>
              ));
            })()}

            {/* Next — uses hasNextPage from server */}
            <button
              onClick={() => onPageChange(activePage + 1)}
              disabled={!pagination.hasNextPage}
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
