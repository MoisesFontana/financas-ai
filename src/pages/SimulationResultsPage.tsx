import { AIInsightsCard } from '@/components/features/SimulationResult/AIInsightCardProps';
import { Card } from '@/components/features/SimulationResult/Card';
import { PageHero } from '@/components/shared/PageHero';
import { useSimulationStorage } from '@/hooks/useSimulationStorage';
import { calcMonthlySavings, calcMonthlySavingsNeeded } from '@/utils/simulation';
import { CalendarClock, CreditCardIcon, Goal, Landmark, PiggyBank, Wallet } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function SimulationResultsPage() {
  const { id } = useParams<{ id: string }>();
  const { getFormData } = useSimulationStorage();

  const data = id ? getFormData(id) : null;
  if (!data) {
    return <p>Simulação não encontrada!</p>;
  }

  const monthlySavings = calcMonthlySavings(data);
  const monthlySavingsNeeded = calcMonthlySavingsNeeded(data);
  const isOnTrack = monthlySavings >= monthlySavingsNeeded ? 'objectiveOk' : 'objectiveNotOk';

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Resultado da Simulação"
        subtitle="Com base no seu perfil financeiro e objetivos."
      />
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card icon={Goal} label="Custo da Meta" value={data.goalAmount} subtitle={data.goalName} />
        <Card
          icon={CalendarClock}
          label="Prazo"
          value={`${data.goalDeadline} meses`}
          subtitle={'Prazo para atingir a meta'}
        />
        <Card
          variant={isOnTrack}
          icon={PiggyBank}
          label="Economia Mensal Necessária"
          value={`R$ ${monthlySavingsNeeded.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle={`Este é o valor mínimo que você deve economizar mensalmente para o seu objetivo que é: ${data.goalName}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="bg-card order-2 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
          <AIInsightsCard simulationId={data.id} />
        </div>
        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <Card
            variant="primary"
            icon={PiggyBank}
            label="Economia Mensal Atual"
            value={`R$ ${monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle="Este é o valor que você está economizando atualmente"
          />
          <Card
            icon={Wallet}
            label="Renda mensal"
            value={data.income}
            subtitle="Renda total bruta mensal"
          />
          <Card
            icon={CreditCardIcon}
            label="Custos mensais fixos"
            value={data.expenses}
            subtitle="Gastos essenciais por mês"
          />
          <Card
            icon={Landmark}
            label="Dividas / Parcelas"
            value={data.debts}
            subtitle="Valor comprometido em parcelas/depósitos"
          />
        </div>
      </div>
    </main>
  );
}
