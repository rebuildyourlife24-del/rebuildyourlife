import { Construction } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="w-20 h-20 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mb-6">
        <Construction className="w-10 h-10 text-yellow-500" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">Analytics (Onder Constructie)</h1>
      <p className="text-zinc-400 max-w-md">
        Deze module wordt momenteel gebouwd door het AI-team. Kom later terug voor updates.
      </p>
    </div>
  );
}
