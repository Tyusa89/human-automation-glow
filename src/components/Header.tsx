import { Link } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';

export default function AppHeader() {
  const { role, loading } = useRole();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b">
      <Link to="/" className="font-semibold">EcoNest AI</Link>
      
      <nav className="flex items-center gap-4">
        <Link to="/dashboard">Dashboard</Link>
        {/* Add other nav links here */}

        {/* Tiny role badge */}
        {!loading && role && (
          <span
            className={`px-2 py-0.5 text-xs rounded-full border ${
              role === 'owner'
                ? 'bg-green-100 text-green-700 border-green-300'
                : role === 'admin'
                ? 'bg-blue-100 text-blue-700 border-blue-300'
                : 'bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            {role.toUpperCase()}
          </span>
        )}
      </nav>
    </header>
  );
}
