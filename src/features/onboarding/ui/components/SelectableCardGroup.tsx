import type { SelectableOption } from "../../core/domain/models/SelectableOption";

interface SelectableCardGroupProps {
   options: SelectableOption[];
   selected: string | null;
   onSelect: (value: string) => void;
   error?: string;
}

export default function SelectableCardGroup({
   options,
   selected,
   onSelect,
   error,
}: SelectableCardGroupProps) {
   return (
      <div>
         <div className="flex flex-col gap-3">
            {options.map((option) => {
               const isSelected = selected === option.value;
               return (
                  <button
                     key={option.value}
                     type="button"
                     onClick={() => onSelect(option.value)}
                     className={`
                w-full text-left p-4 rounded-xl border transition-all duration-200
                ${isSelected
                           ? "bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/5"
                           : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-500"
                        }
              `}
                  >
                     <div className="flex items-center gap-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div>
                           <div className={`font-semibold text-sm ${isSelected ? "text-emerald-400" : "text-zinc-200"}`}>
                              {option.title}
                           </div>
                           <div className="text-xs text-zinc-400 mt-0.5">{option.description}</div>
                        </div>
                        <div className="ml-auto">
                           <div
                              className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                      ${isSelected ? "border-emerald-500 bg-emerald-500" : "border-zinc-600"}
                    `}
                           >
                              {isSelected && <span className="text-zinc-900 text-xs font-bold">✓</span>}
                           </div>
                        </div>
                     </div>
                  </button>
               );
            })}
         </div>
         {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>
   );
}