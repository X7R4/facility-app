export default function InputField({ label, placeholder, type = "text", isDark, defaultValue }: any) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{label}</label>}
      <input 
         type={type} 
         placeholder={placeholder}
         defaultValue={defaultValue}
         className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 font-medium ${
            isDark 
              ? 'bg-[#0B0E14] border-slate-700 text-slate-200 placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20' 
              : 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20'
         }`} 
      />
    </div>
  );
}
