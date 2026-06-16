import 'react-loading-skeleton/dist/skeleton.css';

import { useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';

import { Button } from '@/components/shared/Button';
import { useAIChat } from '@/hooks/useAIChat';

import { Content } from '../../Insights/Content';
import { Error } from '../../Insights/Error';

interface AIInsightCardProps {
  simulationId: string;
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const {
    insight,
    conversation,
    query,
    setQuery,
    isInsightLoading,
    insightError,
    isChatLoading,
    chatError,
    fetchInsight,
    sendQuestion,
  } = useAIChat(simulationId);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [conversation, isChatLoading]);

  const handleSubmit = async () => {
    if (!query.trim()) {
      return;
    }

    await sendQuestion(query.trim());
    setQuery('');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-3 flex items-center gap-1.5">
        <span>✨</span>
        <span className="text-primary text-xs font-semibold uppercase tracking-widest">
          Insight Financeiro Personalizado
        </span>
      </div>

      {isInsightLoading && (
        <div className="flex">
          <Skeleton
            count={10.5}
            baseColor="var(--color-skeleton-base)"
            highlightColor="var(--color-skeleton-highlight)"
            className="mb-3 flex rounded-lg"
            containerClassName="flex-1"
            inline
          />
        </div>
      )}

      {!isInsightLoading && insightError && (
        <Error
          simulationId={simulationId}
          message={insightError}
          onRetry={() => fetchInsight(simulationId)}
        />
      )}

      {!isInsightLoading && insight && !insightError && <Content insight={insight} />}

      <section className="border-border bg-card rounded-3xl border p-5 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.12)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-foreground text-sm font-semibold">Converse com a IA</p>
            <p className="text-muted-foreground text-xs">
              Faça perguntas sobre essa simulação sempre que precisar.
            </p>
          </div>
          {isChatLoading && <span className="text-foreground/70 text-xs">Respondendo...</span>}
        </div>

        <div className="border-border/70 bg-surface max-h-96 space-y-3 overflow-y-auto rounded-3xl border p-4 shadow-inner">
          {conversation.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhuma pergunta feita ainda. Comece perguntando algo sobre sua simulação.
            </p>
          ) : (
            conversation.map((message, index) => (
              <div
                key={`${message.createdAt}-${index}`}
                className={`rounded-3xl p-4 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto max-w-[85%]'
                    : 'bg-background text-foreground border-border mr-auto max-w-[85%] border'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {chatError && (
          <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            <p>⚠️ {chatError}</p>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            rows={3}
            placeholder="Pergunte algo sobre sua simulação..."
            className="min-h-22.5 border-border bg-background text-foreground focus:border-primary focus:ring-primary/10 flex-1 resize-none rounded-3xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
          />
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isChatLoading || !query.trim()}
            className="whitespace-nowrap"
          >
            Enviar pergunta
          </Button>
        </div>
      </section>
    </div>
  );
}
