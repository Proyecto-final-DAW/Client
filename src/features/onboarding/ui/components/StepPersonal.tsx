import type { OnboardingFormData, FormErrors } from "../../core/domain/models/OnboardingFormData";

interface StepPersonalProps {
   data: OnboardingFormData;
   errors: FormErrors;
   onChange: (field: keyof OnboardingFormData, value: string) => void;
}

export default function StepPersonal({ data, errors, onChange }: StepPersonalProps) {
   return (
      <div>
         <h2 className="text-2xl font-bold text-zinc-100 mb-2">¿Cómo te llamas?</h2>
         <p className="text-zinc-400 text-sm mb-8">Empecemos por conocerte un poco.</p>

         <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">Nombre</label>
            <input
               id="name"
               type="text"
               placeholder="Tu nombre"
               value={data.name}
               onChange={(e) => onChange("name", e.target.value)}
               className={`w-full px-4 py-3 rounded-xl bg-zinc-800 border text-zinc-100 placeholder-zinc-500 outline-none transition-colors ${errors.name ? "border-red-500 focus:border-red-400" : "border-zinc-700 focus:border-emerald-500"}`}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1.5">{errors.name}</p>}
         </div>

         <div className="mb-6">
            <label htmlFor="birthDate" className="block text-sm font-medium text-zinc-300 mb-2">Fecha de nacimiento</label>
            <input
               id="birthDate"
               type="date"
               value={data.birthDate}
               onChange={(e) => onChange("birthDate", e.target.value)}
               className={`w-full px-4 py-3 rounded-xl bg-zinc-800 border text-zinc-100 outline-none transition-colors [color-scheme:dark] ${errors.birthDate ? "border-red-500 focus:border-red-400" : "border-zinc-700 focus:border-emerald-500"}`}
            />
            {errors.birthDate && <p className="text-red-400 text-sm mt-1.5">{errors.birthDate}</p>}
         </div>
      </div>
   );
}