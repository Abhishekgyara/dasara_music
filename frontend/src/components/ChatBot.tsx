import React, { useState, useRef, useEffect } from 'react';
import {
  Box, IconButton, TextField, Typography,
  Paper, Button, List, ListItem, ListItemText
} from '@mui/material';
import { Chat, Close } from '@mui/icons-material';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

// Optional predefined Q&A for quick buttons
const predefinedQnA: Record<string, string> = {
  "Play me a happy song": "Try 'Happy' by Pharrell Williams or 'Can't Stop the Feeling' by Justin Timberlake!",
  "Show lyrics of 'Someone Like You'": "You can view the lyrics in the Lyrics section after playing the song.",
  "What's a good workout playlist?": "Energetic songs like 'Eye of the Tiger' by Survivor or 'Lose Yourself' by Eminem work great!",
  "Recommend calm music for studying": "Try 'Weightless' by Marconi Union or 'Clair de Lune' by Debussy for focus."
};

const ChatBot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to Hugging Face Space
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');

    if (predefinedQnA[text]) {
      setMessages(prev => [...prev, { sender: 'bot', text: predefinedQnA[text] }]);
      return;
    }

    try {
      // Using a public Hugging Face Space for chat
      const response = await fetch(
        "https://huggingface.co/spaces/yuntian-deng/ChatGPT4Demo/api/predict/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: [text] })
        }
      );

      const data = await response.json();
      const botMessage = data?.data?.[0] || "Sorry, I couldn't generate a response.";

      setMessages(prev => [...prev, { sender: 'bot', text: botMessage }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'bot', text: "Error connecting to Hugging Face Space." }]);
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000 }}>
      {!open ? (
        <IconButton
          color="primary"
          sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, color: 'white', width: 60, height: 60 }}
          onClick={() => setOpen(true)}
        >
          <Chat />
        </IconButton>
      ) : (
        <Paper elevation={6} sx={{ width: 380, height: 480, display: 'flex', flexDirection: 'column', p: 1 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">Music ChatBot</Typography>
            <IconButton size="small" onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          {/* Quick QnA buttons */}
          <Box mb={1} display="flex" flexWrap="wrap" gap={1}>
            {Object.keys(predefinedQnA).map((q, idx) => (
              <Button key={idx} size="small" variant="outlined" onClick={() => sendMessage(q)}>
                {q}
              </Button>
            ))}
          </Box>

          {/* Chat messages */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1, border: '1px solid #eee', borderRadius: 1, mb: 1 }}>
            <List>
              {messages.map((msg, index) => (
                <ListItem key={index} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <ListItemText
                    primary={msg.text}
                    sx={{
                      bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.300',
                      color: msg.sender === 'user' ? 'white' : 'black',
                      borderRadius: 2,
                      p: 1.5,
                      maxWidth: '75%'
                    }}
                  />
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
          </Box>

          {/* Input box */}
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              value={input}
              placeholder="Ask me something..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            />
            <Button variant="contained" onClick={() => sendMessage(input)}>Send</Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ChatBot;
