import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="p-3.5 rounded-[12px] bg-[#0075de]/15 text-[#62aef0]">
        <Compass className="w-10 h-10" />
      </div>
      <h1 className="text-2xl font-semibold text-white/95 tracking-tight">404 - Page Not Found</h1>
      <p className="text-xs text-white/50 max-w-sm leading-relaxed">
        The route you are looking for does not exist or has been relocated.
      </p>
      <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')} className="gap-2">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Dashboard</span>
      </Button>
    </div>
  );
}
