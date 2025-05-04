import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box } from '@mui/material';

interface AIQuestionsProps {
  questions: string[];
}

export const AIQuestions: React.FC<AIQuestionsProps> = ({ questions }) => {
  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            SEO Questions to Consider
          </Typography>
          <List>
            {questions.map((question: string, index: number) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={question}
                  primaryTypographyProps={{
                    variant: 'body1',
                    sx: { mb: 1 }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}; 