import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import RequireAdmin from '@/components/RequireAdmin';

export default function AdminPage() {
  const navigate = useNavigate();
  
  return (
    <RequireAdmin>
      <div className="p-6 space-y-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="h-10 w-10 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold text-white">Admin</h1>
        <p className="text-sm text-white/70">
          Owner/Admin-only tools & settings
        </p>

        {/* Put admin widgets here */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
            <h3 className="font-semibold mb-2 text-white">Results</h3>
            <p className="text-sm text-white/70">
              Business analytics are admin-only. View via the Results tab.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
            <h3 className="font-semibold mb-2 text-white">Traces</h3>
            <p className="text-sm text-white/70">
              System logs are admin-only. View via the Traces tab.
            </p>
          </div>
        </div>
      </div>
    </RequireAdmin>
  );
}
