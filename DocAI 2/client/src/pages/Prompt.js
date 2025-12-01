import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const HealthChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = 'https://api.aimlapi.com/v1/chat/completions';
  const API_KEY = '327a9b040b3d4b98b3951255067707d1';

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const options = {
        method: 'POST',
        url: API_URL,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        data: {
          model: 'gpt-4o-mini',
          max_tokens: 512,
          temperature: 0.7,
          messages: [
            {
              role: 'system',
              content: 'You are a medical assistant. Provide clear, concise health information. Always include disclaimers.'
            },
            ...messages.map(msg => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.text
            })),
            { role: 'user', content: input }
          ],
          response_format: { type: 'text' },
          stream: false
        }
      };

      const { data } = await axios.request(options);
      const botResponse = data.choices[0].message.content;

      const botMessage = { 
        text: botResponse, 
        isUser: false 
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = { 
        text: 'Sorry, I encountered an error. Please try again.', 
        isUser: false 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>


        <div className="chat-container">
        <div className="chat-messages">
            {messages.map((msg, index) => (
            <div 
                key={index} 
                className={`message ${msg.isUser ? 'user' : 'bot'}`}
            >
                {msg.text}
                {!msg.isUser && (
                <div className="disclaimer">
                    Disclaimer: Consult a healthcare professional for medical advice
                </div>
                )}
            </div>
            ))}
            {isLoading && <div className="message bot">Analyzing your health query...</div>}
        </div>

        <div className="chat-input">
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about symptoms, medications, or general health..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
            </button>
        </div>
        </div>
    </Layout>
  );
};

// Keep the same CSS styles as previous version

export default HealthChatBot;