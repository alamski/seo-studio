import React from 'react';
import { Box, Button, CircularProgress, Typography, Alert } from '@mui/material';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import { AIAnalysis } from './AIAnalysis';
import { AIQuestions } from './AIQuestions';

interface AIAnalysisSectionProps {
  crawlData: any[];
}

export const AIAnalysisSection: React.FC<AIAnalysisSectionProps> = ({ crawlData }) => {
  const { 
    analysis, 
    questions, 
    loading, 
    error, 
    analyzeData, 
    generateQuestions 
  } = useAIAnalysis();

  const handleAnalyze = async () => {
    await analyzeData(crawlData);
  };

  const handleGenerateQuestions = async () => {
    await generateQuestions(crawlData);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AI-Powered SEO Analysis
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Analyze with AI'}
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleGenerateQuestions}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Questions'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {analysis && <AIAnalysis analysis={analysis} />}
      {questions.length > 0 && <AIQuestions questions={questions} />}
    </Box>
  );
}; 