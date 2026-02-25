import { Layers, Trash2, Plus } from 'lucide-react';
import { FormSection } from './FormSections';

export const StepSection = ({ steps, setSteps }: any) => {
  const addStep = () => setSteps([...steps, { id: crypto.randomUUID(), text: '', isCompleted: false }]);
  const updateStep = (i: number, val: string) => {
    const newSteps = [...steps];
    newSteps[i].text = val;
    setSteps(newSteps);
  };

  return (
    <FormSection label="Incremental Steps" icon={<Layers size={14} />}>
      <div className="space-y-3">
        {steps.map((step: any, i: number) => (
          <div key={step.id} className="flex gap-3 items-center">
            <input value={step.text} onChange={e => updateStep(i, e.target.value)}
              className="flex-1 bg-white/5 border border-border-thin rounded-xl px-4 py-3 text-[16px] outline-none" placeholder="Definition of Done..." />
            <button onClick={() => setSteps(steps.filter((s: any) => s.id !== step.id))} className="p-2 text-text-dim/40 active:text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}
        <button onClick={addStep} className="w-full py-4 border border-dashed border-border-thin rounded-2xl text-[10px] text-accent-primary uppercase font-bold flex items-center justify-center gap-2 active:bg-accent-soft">
          <Plus size={16} /> Add Step
        </button>
      </div>
    </FormSection>
  );
};