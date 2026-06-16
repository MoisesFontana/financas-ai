import { Divider } from '@/components/shared/Divider';
import type { LucideIcon } from 'lucide-react';
import { SquareArrowOutUpRight, Trash2 } from 'lucide-react';

interface CardHistoryProps {
  icon: LucideIcon;
  title: string;
  date: string;
  goalAmount: string;
  term: string;
  monthlySaving: string;
  onDelete?: () => void;
}

export function CardHistory({
  icon: Icon,
  title,
  date,
  goalAmount,
  term,
  monthlySaving,
  onDelete,
}: CardHistoryProps) {
  return (
    <article className="border-border bg-card rounded-2xl border p-4 shadow-[4px_4px_18px_0_rgba(0,0,0,0.12)]">
      <div className="hidden p-2 lg:grid lg:grid-cols-[minmax(220px,_1fr)_repeat(3,minmax(150px,200px))_minmax(220px,1fr)] lg:items-center lg:gap-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 text-primary mr-3 flex h-10 w-10 items-center justify-center rounded-xl">
            <Icon size={26} />
          </div>
          <div>
            <h3 className="text-foreground text-lg font-semibold">{title}</h3>
            <p className="text-muted-foreground mt-1 text-sm">{date}</p>
          </div>
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.1em]">
            Custo da meta
          </p>
          <p className="text-foreground mt-2 text-sm font-semibold">{goalAmount}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.1em]">
            Prazo
          </p>
          <p className="text-foreground mt-2 text-sm font-semibold">{term}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.1em]">
            Economia mensal
          </p>
          <p className="text-foreground mt-2 text-sm font-semibold">{monthlySaving}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Divider orientation="vertical" />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border-0 bg-white text-red-500 transition hover:cursor-pointer hover:bg-red-100"
            aria-label="Excluir simulação"
            onClick={onDelete}
          >
            <Trash2 size={24} />
          </button>
          <button
            type="button"
            className="border-border bg-secondary-button text-foreground/70 hover:bg-secondary-button/120 rounded-4xl flex flex-row items-center whitespace-nowrap border px-4 py-2 text-xs transition hover:cursor-pointer"
          >
            <SquareArrowOutUpRight size={16} />
            <span className="ml-2">Ver detalhes</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 lg:hidden">
        <div className="bg-primary/20 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
          <Icon size={22} />
        </div>
        <div className="pb-3 pt-2">
          <h3 className="text-foreground text-base font-semibold">{title}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{date}</p>
        </div>
        <div className="bg-secondary-button/5 space-y-4 border-0">
          <div className="pb-2">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.1em]">
              Custo da meta
            </p>
            <p className="text-foreground mt-2 text-sm font-semibold">{goalAmount}</p>
          </div>
          <div className="pb-2">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.1em]">
              Prazo
            </p>
            <p className="text-foreground mt-2 text-sm font-semibold">{term}</p>
          </div>
          <div className="pb-2">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.1em]">
              Economia mensal
            </p>
            <p className="text-foreground mt-2 text-sm font-semibold">{monthlySaving}</p>
          </div>
        </div>
        <Divider orientation="horizontal" />
        <div className="flex items-center justify-between gap-3  pt-3">
          <div className="flex w-full justify-center">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center text-red-500"
              aria-label="Excluir simulação"
              onClick={onDelete}
            >
              <Trash2 size={22} />
            </button>
          </div>
          <Divider orientation="vertical" />
          <div className="flex w-full items-stretch">
            <button
              type="button"
              className="text-foreground/60 hover:bg-secondary-button/20 inline-flex items-center gap-2 whitespace-nowrap px-4 py-3 text-xs font-semibold "
            >
              <SquareArrowOutUpRight size={14} />
              Ver detalhes
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
