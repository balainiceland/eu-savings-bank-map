import { useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function AdminPage() {
  const initialize = useAdmin(state => state.initialize);
  const isLoading = useAdmin(state => state.isLoading);
  const isAdmin = useAdmin(state => state.isAdmin);
  const user = useAdmin(state => state.user);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-esb-blue border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}
