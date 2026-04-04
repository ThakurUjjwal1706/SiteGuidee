import { Settings2, AlertOctagon } from 'lucide-react';

export default function SimulationPanel({ onDelayTrigger }) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 h-full flex flex-col justify-between">
      <div>
        <h3 className="font-extrabold flex items-center gap-2 mb-2 text-lg tracking-tight text-gray-900">
          <Settings2 className="w-5 h-5 text-indigo-500" />
          Interactive Simulator
        </h3>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Modify variables to see timeline reactions.</p>

        <button 
          onClick={onDelayTrigger}
          className="w-full mt-6 flex justify-center items-center gap-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
        >
          <AlertOctagon className="w-4 h-4" /> Trigger Phase Delay
        </button>
      </div>
    </div>
  );
}
