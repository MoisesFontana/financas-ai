import { useCallback, useEffect, useRef, useState } from 'react';

import { buildAIPrompt, buildChatPrompt } from '@/data/aiPrompt';
import type { ChatMessage, SimulationRecord } from '@/data/simulation';
import { useSimulationStorage } from '@/hooks/useSimulationStorage';
import { getChatReply, getInsight, type InsightData } from '@/services/aiService';

export const useAIChat = (id: string) => {
  const isRequestPending = useRef(false);
  const { getFormData, updateSimulation } = useSimulationStorage();

  const [insight, setInsight] = useState<InsightData | null>(() => {
    const simulation = getFormData(id);

    if (simulation?.insight) {
      return simulation.insight;
    }

    return null;
  });

  const [conversation, setConversation] = useState<ChatMessage[]>(() => {
    const simulation = getFormData(id);

    if (simulation?.conversation) {
      return simulation.conversation;
    }

    return [];
  });

  const [query, setQuery] = useState('');
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const conversationRef = useRef<ChatMessage[]>(conversation);

  const loadSimulation = useCallback(() => {
    const simulation = getFormData(id);

    if (!simulation) {
      return;
    }

    setInsight(simulation.insight ?? null);
    const savedConversation = simulation.conversation ?? [];
    setConversation(savedConversation);
    conversationRef.current = savedConversation;
  }, [getFormData, id]);

  useEffect(() => {
    loadSimulation();
  }, [loadSimulation]);

  const fetchInsight = useCallback(
    async (simulationId: string) => {
      const simulation = getFormData(simulationId);

      if (!simulation) {
        setInsightError('Simulação não encontrada.');
        return;
      }

      isRequestPending.current = true;
      setIsInsightLoading(true);
      setInsightError(null);

      try {
        const prompt = buildAIPrompt(simulation);
        const data = await getInsight(prompt);
        setInsight(data);

        updateSimulation(simulationId, {
          ...simulation,
          insight: data,
        } as SimulationRecord);
      } catch {
        setInsightError('Erro ao gerar o diagnóstico. Tente novamente.');
      } finally {
        isRequestPending.current = false;
        setIsInsightLoading(false);
      }
    },
    [getFormData, updateSimulation]
  );

  useEffect(() => {
    if (insight || isInsightLoading || insightError || isRequestPending.current) {
      return;
    }

    fetchInsight(id);
  }, [id, insight, insightError, isInsightLoading, fetchInsight]);

  const sendQuestion = useCallback(
    async (message: string) => {
      const simulation = getFormData(id);

      if (!simulation) {
        setChatError('Simulação não encontrada.');
        return;
      }

      setChatError(null);
      setIsChatLoading(true);

      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        createdAt: new Date().toISOString(),
      };

      const currentConversation = conversationRef.current;
      const nextConversation = [...currentConversation, userMessage];
      setConversation(nextConversation);
      conversationRef.current = nextConversation;
      updateSimulation(id, {
        ...simulation,
        conversation: nextConversation,
      } as SimulationRecord);

      try {
        const prompt = buildChatPrompt(simulation, message, currentConversation);
        const answer = await getChatReply(prompt);

        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: answer,
          createdAt: new Date().toISOString(),
        };

        const updatedConversation = [...nextConversation, assistantMessage];
        setConversation(updatedConversation);
        conversationRef.current = updatedConversation;
        updateSimulation(id, {
          ...simulation,
          conversation: updatedConversation,
        } as SimulationRecord);
      } catch {
        setChatError('Erro ao enviar a pergunta. Tente novamente.');
      } finally {
        setIsChatLoading(false);
      }
    },
    [getFormData, id, updateSimulation]
  );

  return {
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
  };
};
