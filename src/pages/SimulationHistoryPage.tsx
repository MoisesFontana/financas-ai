import { CardHistory } from '@/components/features/SimulationHistory/CardHistory';
import { PageHero } from '@/components/shared/PageHero';
import type { SimulationRecord } from '@/data/simulation';
import { useSimulationStorage } from '@/hooks/useSimulationStorage';
import { calcMonthlySavingsNeeded } from '@/utils/simulation';
import { Goal } from 'lucide-react';
import { useEffect, useState } from 'react';

function formatSimulationDate(simulation: SimulationRecord) {
  if ('createdAt' in simulation && simulation.createdAt) {
    return new Date(simulation.createdAt).toLocaleDateString('pt-BR');
  }

  return new Date().toLocaleDateString('pt-BR');
}

export function SimulationHistoryPage() {
  const { getAllFormData, deleteSimulation } = useSimulationStorage();
  const [simulations, setSimulations] = useState<SimulationRecord[]>([]);

  const handleDelete = (id: string) => {
    deleteSimulation(id);
    setSimulations((prev) => prev.filter((s) => s.id !== id));
  };

  useEffect(() => {
    setSimulations(getAllFormData());
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de Simulações"
        subtitle="Revise suas simulações anteriores e acompanhe seu progresso financeiro."
      />

      <div className="mt-6 grid gap-4 lg:flex lg:flex-col">
        {simulations.length > 0 ? (
          simulations.map((simulation) => (
            <CardHistory
              key={simulation.id}
              icon={Goal}
              title={simulation.goalName}
              date={formatSimulationDate(simulation)}
              goalAmount={simulation.goalAmount}
              term={`${simulation.goalDeadline} meses`}
              monthlySaving={`R$ ${calcMonthlySavingsNeeded(simulation).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              onDelete={() => handleDelete(simulation.id)}
            />
          ))
        ) : (
          <p className="border-border bg-card text-muted-foreground rounded-[32px] border p-6 text-center text-sm">
            Nenhuma simulação encontrada no histórico.
          </p>
        )}
      </div>
    </main>
  );
}
