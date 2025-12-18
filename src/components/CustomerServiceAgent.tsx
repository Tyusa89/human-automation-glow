import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Send, Bot, User, MessageCircle, X, Minimize2, Maximize2, Mic, MicOff, Volume2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CustomerServiceAgentProps {
  onClose?: () => void;
  isMinimized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

const CustomerServiceAgent: React.FC<CustomerServiceAgentProps> = ({ 
  onClose, 
  isMinimized = false, 
  onMinimize, 
  onMaximize 
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  const [useVoiceMode, setUseVoiceMode] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Initialize realtime chat hook
  const {
    messages: realtimeMessages,
    isConnected,
    isRecording,
    currentTranscript,
    startRecording,
    stopRecording,
    sendTextMessage,
    disconnect
  } = useRealtimeChat();

  // Fallback messages for text-only mode
  const [textMessages, setTextMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your EcoNest AI customer service agent. I\'m here to help you with any questions about our automation services, troubleshoot issues, or schedule a demo. How can I assist you today?',
      timestamp: new Date()
    }
  ]);

  // Use appropriate message state based on mode
  const messages = useVoiceMode ? realtimeMessages : textMessages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Dragging handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - 384; // 384px = w-96
      const maxY = window.innerHeight - 600; // 600px = h-[600px]
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (useVoiceMode) {
      // Use realtime chat for voice mode
      sendTextMessage(input);
      setInput('');
      return;
    }

    // Traditional text-only chat mode
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setTextMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('customer-service-ai', {
        body: {
          message: currentInput,
          conversationHistory: conversationHistory
        }
      });

      if (error) {
        // Handle specific error types
        if (error.message.includes('401') || error.message.includes('Authentication required')) {
          toast({
            title: "Authentication Required",
            description: "Please log in to use the customer service chat.",
            variant: "destructive",
          });
          
          const authErrorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'I apologize, but you need to be logged in to use this service. Please sign in to continue our conversation.',
            timestamp: new Date()
          };
          setTextMessages(prev => [...prev, authErrorMessage]);
          setIsLoading(false);
          return;
        }
        
        if (error.message.includes('429') || error.message.includes('Rate limit')) {
          toast({
            title: "Rate Limit Reached",
            description: "You've sent too many messages. Please wait a moment before trying again.",
            variant: "destructive",
          });
          
          const rateLimitMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'I apologize, but you\'ve reached the rate limit for messages. Please wait about a minute before sending another message.',
            timestamp: new Date()
          };
          setTextMessages(prev => [...prev, rateLimitMessage]);
          setIsLoading(false);
          return;
        }
        
        throw error;
      }

      if (data.error) {
        // Handle server-side errors with specific messages
        if (data.error.includes('Rate limit')) {
          toast({
            title: "Rate Limit Reached",
            description: data.retryAfter ? `Please wait ${data.retryAfter} seconds before trying again.` : "Please wait a moment before trying again.",
            variant: "destructive",
          });
          
          const rateLimitMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `I apologize, but you've reached the rate limit. ${data.retryAfter ? `Please wait ${data.retryAfter} seconds before sending another message.` : 'Please wait about a minute before sending another message.'}`,
            timestamp: new Date()
          };
          setTextMessages(prev => [...prev, rateLimitMessage]);
          setIsLoading(false);
          return;
        }
        
        throw new Error(data.error);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setTextMessages(prev => [...prev, aiMessage]);
      
      // Update conversation history for context
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: currentInput },
        { role: 'assistant', content: data.response }
      ]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble responding right now. Please try again in a moment or contact our support team directly.',
        timestamp: new Date()
      };

      setTextMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceMode = () => {
    setUseVoiceMode(!useVoiceMode);
    if (isRecording) {
      stopRecording();
    }
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const quickActions = [
    "Tell me about EcoNest's services",
    "How does your automation work?",
    "I want to schedule a demo",
    "Help with integration",
    "Pricing information"
  ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onMaximize}
          className="rounded-full w-14 h-14 bg-emerald-600 hover:bg-emerald-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <Card 
      ref={cardRef}
      className="fixed w-96 h-[700px] z-50 shadow-xl border-emerald-200 flex flex-col overflow-hidden"
      style={{
        left: position.x || 'auto',
        top: position.y || 'auto',
        right: position.x === 0 ? '1rem' : 'auto',
        bottom: position.y === 0 ? '1rem' : 'auto',
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <CardHeader 
        className="pb-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-emerald-100">
                <Bot className="h-4 w-4 text-emerald-600" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm font-semibold">EcoNest Support</CardTitle>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onMinimize && (
              <Button variant="ghost" size="sm" onClick={onMinimize} className="h-6 w-6 p-0">
                <Minimize2 className="h-3 w-3" />
              </Button>
            )}
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <ScrollArea className="flex-1 p-4 min-h-0">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarFallback className={
                    message.role === 'user' 
                      ? 'bg-blue-100' 
                      : 'bg-emerald-100'
                  }>
                    {message.role === 'user' ? (
                      <User className="h-3 w-3 text-blue-600" />
                    ) : (
                      <Bot className="h-3 w-3 text-emerald-600" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[80%] ${
                  message.role === 'user' ? 'text-right' : ''
                }`}>
                  <div className={`rounded-lg p-3 text-sm ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {message.content}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            
            {(isLoading || (useVoiceMode && currentTranscript)) && (
              <div className="flex items-start gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-emerald-100">
                    <Bot className="h-3 w-3 text-emerald-600" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg p-3">
                  {currentTranscript ? (
                    <span className="text-sm text-gray-700">{currentTranscript}</span>
                  ) : (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="p-4 border-t bg-muted/50">
          {/* Voice Mode Toggle */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">
              {useVoiceMode ? 'Voice Mode' : 'Text Mode'}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVoiceMode}
                className="text-xs h-6 px-2"
              >
                <Volume2 className="h-3 w-3 mr-1" />
                {useVoiceMode ? 'Switch to Text' : 'Voice Chat'}
              </Button>
              {useVoiceMode && (
                <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {quickActions.map((action, index) => (
               <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInput(action)}
                className="text-xs h-6 px-2 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {action}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={useVoiceMode ? "Type or speak your message..." : "Type your message..."}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              disabled={isLoading}
              className="text-sm"
            />
            
            {/* Voice Controls */}
            {useVoiceMode && (
              <Button
                onClick={handleVoiceToggle}
                disabled={!isConnected}
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                className="flex-shrink-0"
              >
                {isRecording ? (
                  <MicOff className="h-3 w-3" />
                ) : (
                  <Mic className="h-3 w-3" />
                )}
              </Button>
            )}
            
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 flex-shrink-0"
              size="sm"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerServiceAgent;