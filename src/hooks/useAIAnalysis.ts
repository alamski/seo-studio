import { useState } from 'react';
import { analyzeCrawlDataWithAI, generateSEOQuestions, AIAnalysisResponse } from '../services/aiAnalysisService';

interface UseAIAnalysisReturn {
  analysis: AIAnalysisResponse | null;
  questions: string[];
  loading: boolean;
  error: string | null;
  analyzeData: (crawlData: any[]) => Promise<void>;
  generateQuestions: (crawlData: any[]) => Promise<void>;
}

export const useAIAnalysis = (): UseAIAnalysisReturn => {
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeData = async (crawlData: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyzeCrawlDataWithAI(crawlData);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze data');
    } finally {
      setLoading(false);
    }
  };

  const generateQuestions = async (crawlData: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const result = await generateSEOQuestions(crawlData);
      setQuestions(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  return {
    analysis,
    questions,
    loading,
    error,
    analyzeData,
    generateQuestions
  };
}; 