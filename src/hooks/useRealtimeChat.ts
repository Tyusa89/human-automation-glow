import { useState, useEffect, useRef, useCallback } from 'react';
import { AudioRecorder, encodeAudioForAPI } from '@/components/audio/AudioRecorder';
import { playAudioData, clearAudioQueue } from '@/components/audio/AudioQueue';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type: 'text' | 'audio';
}

interface UseRealtimeChatReturn {
  messages: Message[];
  isConnected: boolean;
  isRecording: boolean;
  currentTranscript: string;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  sendTextMessage: (message: string) => void;
  disconnect: () => void;
}

export const useRealtimeChat = (): UseRealtimeChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const currentResponseRef = useRef<string>('');

  // Initialize audio context
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        console.log('Audio context initialized');
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
      }
    };

    initAudioContext();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    console.log('Connecting to realtime chat WebSocket...');
    const ws = new WebSocket('wss://rqldulvkwzvrmcvwttep.functions.supabase.co/functions/v1/realtime-chat');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message type:', data.type);
      
      switch (data.type) {
        case 'session.created':
          console.log('Session created successfully');
          break;
          
        case 'session.updated':
          console.log('Session updated successfully');
          break;
          
        case 'response.audio.delta':
          // Handle audio response chunks
          if (audioContextRef.current) {
            const binaryString = atob(data.delta);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            playAudioData(audioContextRef.current, bytes);
          }
          break;
          
        case 'response.audio_transcript.delta':
          // Handle text transcript chunks
          currentResponseRef.current += data.delta;
          setCurrentTranscript(currentResponseRef.current);
          break;
          
        case 'response.audio_transcript.done':
          // Complete transcript received
          if (currentResponseRef.current.trim()) {
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              role: 'assistant',
              content: currentResponseRef.current,
              timestamp: new Date(),
              type: 'audio'
            }]);
          }
          currentResponseRef.current = '';
          setCurrentTranscript('');
          break;
          
        case 'input_audio_buffer.speech_started':
          console.log('Speech detected');
          break;
          
        case 'input_audio_buffer.speech_stopped':
          console.log('Speech ended');
          break;
          
        case 'conversation.item.input_audio_transcription.completed':
          // User speech transcription
          if (data.transcript?.trim()) {
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              role: 'user',
              content: data.transcript,
              timestamp: new Date(),
              type: 'audio'
            }]);
          }
          break;
          
        case 'response.function_call_arguments.done':
          console.log('Function call completed:', data.name, data.arguments);
          break;
          
        case 'error':
          console.error('WebSocket error:', data.message);
          break;
          
        default:
          console.log('Unhandled message type:', data.type);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      setIsConnected(false);
      setIsRecording(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    wsRef.current = ws;
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect]);

  const disconnect = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    clearAudioQueue();
    setIsConnected(false);
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }

    if (isRecording) {
      return;
    }

    try {
      console.log('Starting voice recording...');
      
      const recorder = new AudioRecorder((audioData: Float32Array) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const encodedAudio = encodeAudioForAPI(audioData);
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodedAudio
          }));
        }
      });

      await recorder.start();
      recorderRef.current = recorder;
      setIsRecording(true);
      
      console.log('Voice recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current) {
      console.log('Stopping voice recording...');
      recorderRef.current.stop();
      recorderRef.current = null;
      setIsRecording(false);
      console.log('Voice recording stopped');
    }
  }, []);

  const sendTextMessage = useCallback((message: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }

    console.log('Sending text message:', message);
    
    // Add user message to UI
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      type: 'text'
    }]);

    // Send to OpenAI
    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: message
          }
        ]
      }
    };
    
    wsRef.current.send(JSON.stringify(event));
    wsRef.current.send(JSON.stringify({ type: 'response.create' }));
  }, []);

  return {
    messages,
    isConnected,
    isRecording,
    currentTranscript,
    startRecording,
    stopRecording,
    sendTextMessage,
    disconnect
  };
};