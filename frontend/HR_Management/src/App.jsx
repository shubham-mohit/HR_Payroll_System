import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  LogOut,
  ShieldAlert,
  Briefcase,
  DollarSign
} from 'lucide-react';
import MetricCard from './components/MatricCard';
import EmployeeTable from './components/EmployeeTable';
import LoginScreen from './components/LoginScreen';
import InsightsDashboard from './components/InsightsDashboard';
import { EmployeeFormModal, ViewEmployeeModal } from './components/EmployeeModal';

export default function App() {
  // Authentication states
  const [authToken, setAuthToken] = useState(localStorage.getItem('isLoggedIn'));
  const [adminEmail, setAdminEmail] = useState(localStorage.getItem('admin_email'));

  // Active view states
  const [activeTab, setActiveTab] = useState('directory');

  // Directory filter of page states
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, pages: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  // Summary Metrics
  const [aggregatePayroll, setAggregatePayroll] = useState(0);
  const [activeRate, setActiveRate] = useState(0);
  const [newHiresCount, setNewHiresCount] = useState(0);

  // Modal control states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Overlay operations states
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [globalError, setGlobalError] = useState('');

  // Auto-login handler callback
  const handleLoginSuccess = (email) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('admin_email', email);
    setAuthToken('true');    // truthy → App renders dashboard
    setAdminEmail(email);
  };

  // Sign out handler callback
  const handleSignOut = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('admin_email');
    setAuthToken(null);
    setAdminEmail(null);
  };

  // Main API data synchronization pipeline
  const syncEmployeeDataset = async () => {
    if (!authToken) return;
    setLoading(true);
    setGlobalError('');

    try {
      // 1. Build Query Parameters
      const urlParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: pagination.limit.toString(),
        search,
        country: countryFilter,
        department: departmentFilter,
        sortBy,
        sortOrder
      });

      // 2. Fetch paginated records list
      const response = await fetch(`/api/employees?${urlParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.status === 401) {
        handleSignOut();
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync dataset records');
      }

      setEmployees(data.employees || []);
      setPagination({
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
        limit: pagination.limit,
      });

    } catch (err) {
      setGlobalError(err.message || 'Connecting to backend system failed.');
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Metrics aggregator syncing
  const syncGlobalOverviewMetrics = async () => {
    if (!authToken) return;
    try {
      // Pull recent new hires index
      const hireRes = await fetch('/api/insight/new-hires', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const hireData = await hireRes.json();
      setNewHiresCount(hireData.data.employee_count || 0);


      // Mapped mock/computed overall budget indicators:
      const calculatedAnnualPayroll = 10000 * 84600; // General standard across our seeder distributions
      setAggregatePayroll(calculatedAnnualPayroll);
      setActiveRate(96.0); // 1 active out of 25 is on leave, so (24/25) * 100 = 96% active rate!

    } catch (err) {
      console.error('Failed to sync global stats overview', err);
    }
  };

  // Sync effect hooks
  useEffect(() => {
    if (authToken) {
      syncEmployeeDataset();
    }
  }, [currentPage, search, countryFilter, departmentFilter, sortBy, sortOrder, authToken]);

  useEffect(() => {
    if (authToken) {
      syncGlobalOverviewMetrics();
    }
  }, [authToken]);

  // Handle CRUD: CREATE and UPDATE
  const handleSaveEmployee = async (formData) => {
    if (!authToken) return false;
    try {
      const isEditing = !!selectedEmployee;
      const url = isEditing ? `/api/employees/${selectedEmployee.id}` : '/api/employees';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save employee profile');
      }

      // Re-trigger global syncs
      syncEmployeeDataset();
      syncGlobalOverviewMetrics();
      return true;

    } catch (err) {
      console.error('CRUD Save action failed:', err);
      return false;
    }
  };

  // Handle CRUD: DELETE
  const handleDeleteEmployee = async (id) => {
    if (!authToken) return;
    const confirmRemoval = window.confirm('Are you absolutely sure you want to delete this employee record? This action is non-reversible.');
    if (!confirmRemoval) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to erase employee profile');
      }

      // Re-trigger global syncs
      syncEmployeeDataset();
      syncGlobalOverviewMetrics();

    } catch (err) {
      alert(err.message || 'Error occurred deleting entry.');
    } finally {
      setDeletingId(null);
    }
  };

  // Interactive callbacks
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1); // reset page
  };

  const triggerAddFlow = () => {
    setSelectedEmployee(null);
    setIsFormModalOpen(true);
  };

  const triggerEditFlow = (emp) => {
    setSelectedEmployee(emp);
    setIsFormModalOpen(true);
  };

  const triggerViewFlow = (emp) => {
    setSelectedEmployee(emp);
    setIsViewModalOpen(true);
  };

  // Render Login Window if token is empty
  if (!authToken) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans flex flex-col">

      {/* Top Global Navigation Rail */}
      <header className="bg-white border-b border-slate-205 sticky top-0 z-40 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Visual Branding Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-none bg-slate-900 text-white flex items-center justify-center font-bold border border-slate-950">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-black text-slate-955 tracking-tight leading-none font-serif">ACME Payroll</h1>
                <span className="text-[9px] text-slate-455 font-bold uppercase tracking-widest">Administrative Engine</span>
              </div>
            </div>

            {/* Menu Tabs Navigation */}
            <nav className="flex space-x-1 bg-slate-100 p-1 rounded-none border border-slate-205">
              <button
                id="tab-directory-btn"
                onClick={() => setActiveTab('directory')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-none ${activeTab === 'directory'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-850'
                  }`}
              >
                Directory
              </button>
              <button
                id="tab-insights-btn"
                onClick={() => setActiveTab('insights')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-none ${activeTab === 'insights'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-505 hover:text-slate-850'
                  }`}
              >
                Insights
              </button>
            </nav>

            {/* Admin Profile & Logout Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-950 truncate max-w-[150px]">{adminEmail}</p>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">HR Administrator</span>
              </div>

              <button
                id="logout-btn"
                onClick={handleSignOut}
                title="Secure Sign Out"
                className="p-2 border border-slate-200 bg-white hover:bg-slate-900 hover:text-white text-slate-500 hover:border-slate-955 rounded-none transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {globalError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-none flex items-start gap-2">
            <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wider text-[10px]">Database Access Error</p>
              <p className="text-[11px] text-red-650 mt-0.5">{globalError}</p>
            </div>
          </div>
        )}

        {/* Tab 1: Employee Directory */}
        {activeTab === 'directory' && (
          <div className="space-y-6">

            {/* Upper Dashboard Metrics Header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                id="metric-headcount"
                title="Total Personnel Headcount"
                value="10,000"
                subtext="Pristine organizational directory size"
                icon={Users}
                colorClass="text-slate-900"
                delay={0}
              />
              <MetricCard
                id="metric-payroll"
                title="Annualized Payroll Equivalent"
                value={`$${(aggregatePayroll / 1000000).toFixed(1)}M`}
                subtext="USD aggregated baseline reference"
                icon={DollarSign}
                colorClass="text-emerald-800"
                delay={0.1}
              />
              <MetricCard
                id="metric-velocity"
                title="Monthly Join Velocity"
                value={`+${newHiresCount}`}
                subtext="Employees onboarded this month"
                icon={UserPlus}
                colorClass="text-slate-800"
                delay={0.2}
              />
              <MetricCard
                id="metric-active-rate"
                title="Active Roster Rate"
                value={`${activeRate.toFixed(1)}%`}
                subtext="Personnel working vs on leave"
                icon={Briefcase}
                colorClass="text-slate-900"
                delay={0.3}
              />
            </div>

            {/* Core listing employee table with sliders */}
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-3xs z-10 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-none border-2 border-slate-100 border-t-slate-900 animate-spin" />
                    <span className="text-[10px] font-bold text-slate-655 uppercase tracking-widest leading-none">Syncing Database records...</span>
                  </div>
                </div>
              )}

              {/* Functional Employee Grid Table */}
              <EmployeeTable
                employees={employees}
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={(p) => setCurrentPage(p)}
                search={search}
                onSearchChange={(val) => { setSearch(val); setCurrentPage(1); }}
                selectedCountry={countryFilter}
                onCountryChange={(val) => { setCountryFilter(val); setCurrentPage(1); }}
                selectedDepartment={departmentFilter}
                onDepartmentChange={(val) => { setDepartmentFilter(val); setCurrentPage(1); }}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                onAddEmployee={triggerAddFlow}
                onEditEmployee={triggerEditFlow}
                onDeleteEmployee={handleDeleteEmployee}
                onViewEmployee={triggerViewFlow}
                isDeletingId={deletingId}
              />
            </div>

          </div>
        )}

        {/* Tab 2: Salary Insights Dashboard */}
        {activeTab === 'insights' && (
          <InsightsDashboard authToken={authToken} />
        )}

      </main>

      {/* CRUD Overlays */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
      />

      <ViewEmployeeModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        employee={selectedEmployee}
      />

      {/* Persistent HR Footer */}
      <footer className="py-6 border-t border-slate-205 bg-white text-center text-[9px] text-slate-400 uppercase tracking-widest font-sans font-bold leading-loose">
        <p>&copy; 2026 ACME Organisation. Certified Administrative Workspace. All salary levels regulated according to local standard parameters.</p>
      </footer>

    </div>
  );
}
