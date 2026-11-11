import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#090D14] text-white p-4 font-mono">
      <div className="p-6 rounded-lg bg-[#111927] border border-slate-800 text-center space-y-3 max-w-md">
        <span className="text-2xl font-bold text-blue-400">404</span>
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
          Market Intelligence Endpoint Not Found
        </h2>
        <p className="text-xs text-slate-400 font-sans">
          The requested surveillance view or asset does not exist in Dalal Street memory.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded transition inline-block"
          >
            Return to FinPulse Terminal
          </Link>
        </div>
      </div>
    </div>
  );
}

