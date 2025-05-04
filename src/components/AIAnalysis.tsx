import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import { AIAnalysisResponse } from '../services/aiAnalysisService';

interface AIAnalysisProps {
  analysis: AIAnalysisResponse;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ analysis }) => {
  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            SEO Health Summary
          </Typography>
          <Typography variant="body1" paragraph>
            {analysis.summary}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Key Metrics
          </Typography>
          <Typography variant="body1">
            {analysis.keyMetrics}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Priority Issues
          </Typography>
          <List>
            {analysis.priorityIssues.map((issue: string, index: number) => (
              <ListItem key={index}>
                <ListItemText primary={issue} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Quick Wins
          </Typography>
          <List>
            {analysis.quickWins.map((win: string, index: number) => (
              <ListItem key={index}>
                <ListItemText primary={win} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Recommendations
          </Typography>
          <List>
            {analysis.recommendations.map((recommendation: string, index: number) => (
              <ListItem key={index}>
                <ListItemText primary={recommendation} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Long-term Strategy
          </Typography>
          <List>
            {analysis.longTermStrategy.map((strategy: string, index: number) => (
              <ListItem key={index}>
                <ListItemText primary={strategy} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}; 