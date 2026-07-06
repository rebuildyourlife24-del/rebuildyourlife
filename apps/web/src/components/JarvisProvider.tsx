'use client';

import React, { createContext, useContext, useState } from 'react';

// Define a simple UIMessage type to avoid import issues from different ai sdk versions
export type UIMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'data';
  content: string;
};

interface JarvisContextType {
  messages: UIMessage[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  append: (message: UIMessage | Omit<UIMessage, 'id'>) => Promise<void>;
  isLoading: boolean;
}

const JarvisContext = createContext<JarvisContextType | null>(null);

export function JarvisProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<UIMessage[]>([
    { id: '1', role: 'assistant', content: 'Good morning, sir. J.A.R.V.I.S. online.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const append = async (message: UIMessage | Omit<UIMessage, 'id'>) => {
    const newMsg = { ...message, id: ('id' in message && message.id) ? message.id : Math.random().toString(36).substring(7) } as UIMessage;
    setMessages(prev => [...prev, newMsg]);
    
    if (newMsg.role === 'user') {
      setIsLoading(true);
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...messages, newMsg] })
        });
        
        if (response.ok) {
          const data = await response.json();
          setMessages(prev => [...prev, {
            id: Math.random().toString(36).substring(7),
            role: 'assistant',
            content: data.response || data.content || data.message || 'System online.'
          }]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    append({ role: 'user', content: input });
    setInput('');
  };

  return (
    <JarvisContext.Provider value={{ messages, input, handleInputChange, handleSubmit, append, isLoading }}>
      {children}
    </JarvisContext.Provider>
  );
}

export function useJarvis() {
  const context = useContext(JarvisContext);
  if (!context) {
    throw new Error('useJarvis must be used within a JarvisProvider');
  }
  return context;
}
