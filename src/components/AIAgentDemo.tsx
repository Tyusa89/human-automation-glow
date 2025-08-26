import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Zap, Brain, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAgentDemoProps {
  onClose: () => void;
}

const AIAgentDemo: React.FC<AIAgentDemoProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m an EcoNest AI agent. I can help automate your business processes, analyze data, and provide intelligent insights. What would you like to see me do?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const demoResponses = [
    "I can analyze your customer data and identify trends to improve your marketing strategy. For example, I've detected that 73% of your customers prefer email communication over phone calls.",
    "Let me show you how I can automate your inventory management. I've noticed your stock levels for Product A are running low and I've already initiated a reorder process.",
    "I can integrate with your existing tools and workflows. I'm currently monitoring 15 different data sources and can trigger actions based on specific conditions you set.",
    "Here's how I handle customer support: I can categorize tickets by urgency, route them to the right team members, and even provide suggested responses based on your knowledge base.",
    "I can generate detailed reports and insights. Would you like me to create a sample performance dashboard showing your key metrics and recommendations?"
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response with realistic delay
    setTimeout(() => {
      const response = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickActions = [
    { label: "Analyze customer data", icon: Brain },
    { label: "Automate workflows", icon: Zap },
    { label: "Generate insights", icon: MessageSquare }
  ];

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto">
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-emerald-100">
            <Bot className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">EcoNest AI Agent Demo</h3>
            <p className="text-sm text-muted-foreground">Experience automation that feels human</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
          Live Demo
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`p-2 rounded-full ${
              message.role === 'user' 
                ? 'bg-blue-100' 
                : 'bg-emerald-100'
            }`}>
              {message.role === 'user' ? (
                <User className="h-4 w-4 text-blue-600" />
              ) : (
                <Bot className="h-4 w-4 text-emerald-600" />
              )}
            </div>
            <Card className={`max-w-[80%] ${
              message.role === 'user' 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-white border-emerald-200'
            }`}>
              <CardContent className="p-3">
                <p className="text-sm">{message.content}</p>
                <span className="text-xs text-muted-foreground mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </CardContent>
            </Card>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-emerald-100">
              <Bot className="h-4 w-4 text-emerald-600" />
            </div>
            <Card className="bg-white border-emerald-200">
              <CardContent className="p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2 mb-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInput(action.label)}
                className="text-xs"
              >
                <Icon className="h-3 w-3 mr-1" />
                {action.label}
              </Button>
            );
          })}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the AI agent anything..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isTyping}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIAgentDemo;