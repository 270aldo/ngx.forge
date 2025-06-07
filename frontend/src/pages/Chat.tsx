import React, { useState, useEffect } from "react";
import { ChatSidebar } from "../components/ChatSidebar";
import { MessageBubble, Message } from "../components/MessageBubble";
import { InputArea } from "../components/InputArea";
import { toggleTheme, initTheme } from "../utils/theme";
import { ProtectedRoute } from "../components/ProtectedRoute";

// Función para generar IDs únicos
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export default function Chat() {
  return (
    <ProtectedRoute>
      <ChatContent />
    </ProtectedRoute>
  );
}

function ChatContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const initialMessage: Message = {
    id: "1",
    content: "👋 Welcome to NexusForge! I'm your NGX Agent Orchestrator, combining expertise in training, nutrition, recovery, cognitive enhancement, motivation, biometrics, systems, community, and security. How can I help you today?",
    timestamp: new Date(),
    sender: "assistant"
  };
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isThinking, setIsThinking] = useState(false);
  
  useEffect(() => {
    // Inicializar el tema cuando se monta el componente
    initTheme();
  }, []);
  
  // Scroll al final del chat cuando hay nuevos mensajes
  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);
  
  // Función para manejar el envío de mensajes
  const handleSendMessage = (content: string) => {
    if (content.trim() === '') return;
    
    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: generateId(),
      content,
      timestamp: new Date(),
      sender: "user"
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Simular respuesta del asistente
    setIsThinking(true);
    
    // Simular tiempo de procesamiento
    setTimeout(() => {
      const assistantResponse: Message = {
        id: generateId(),
        content: generateResponse(content),
        timestamp: new Date(),
        sender: "assistant"
      };
      
      setMessages(prevMessages => [...prevMessages, assistantResponse]);
      setIsThinking(false);
    }, 1500 + Math.random() * 1500); // Tiempo aleatorio entre 1.5 y 3 segundos
  };
  
  // Generador de respuestas simple para demo
  const generateResponse = (message: string): string => {
    if (message.toLowerCase().includes('training') || message.toLowerCase().includes('workout')) {
      return "I can help create a training program tailored to your goals. To build an effective program, I'd need to know:\n\n1. Your current fitness level\n2. Available equipment and training environment\n3. How many days per week you can train\n4. Any specific goals or areas you want to focus on\n5. Any injuries or limitations to consider";
    } 
    else if (message.toLowerCase().includes('nutrition') || message.toLowerCase().includes('diet') || message.toLowerCase().includes('food') || message.toLowerCase().includes('eat')) {
      return "Nutrition is a critical component of any fitness journey. For personalized nutrition guidance, I'd need to understand:\n\n1. Your current height, weight and body composition goals\n2. Daily activity level and training intensity\n3. Food preferences and restrictions\n4. Current eating habits and meal timing\n5. Any specific dietary approaches you're interested in (keto, paleo, etc.)";
    }
    else if (message.toLowerCase().includes('recover') || message.toLowerCase().includes('injury') || message.toLowerCase().includes('pain')) {
      return "Recovery is essential for progress and injury prevention. To help with your recovery strategy, I'd want to know:\n\n1. Any specific areas of discomfort or recurring injuries\n2. Your current recovery practices\n3. Sleep quality and duration\n4. Stress levels and management techniques\n5. Available recovery tools (foam roller, massage gun, etc.)";
    }
    else {
      return "I'm your holistic fitness assistant, trained to help with training plans, nutrition strategies, recovery protocols, cognitive performance, motivation techniques, biometric analysis, system integration, and community building. How specifically can I assist with your fitness journey today?";
    }
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      {/* Chat sidebar */}
      <ChatSidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      {/* Main content area */}
      <div className={`flex-1 flex flex-col transition-all relative ${sidebarOpen ? 'ml-[300px]' : 'ml-0'}`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 hexagon-bg"></div>
        
        {/* Ambient gradient light effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-64 bg-[var(--accent-primary)] blur-[120px] opacity-10 pointer-events-none rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-1/2 h-64 bg-[var(--accent-primary)] blur-[120px] opacity-10 pointer-events-none rounded-full"></div>
        
        {/* Geometric accents for premium look */}
        <div className="absolute top-4 left-4 w-16 h-16 border-[1px] border-[var(--accent-primary-transparent)] opacity-30 rotate-45"></div>
        <div className="absolute bottom-4 right-4 w-32 h-32 border-[1px] border-[var(--accent-primary-transparent)] opacity-30 rotate-12"></div>
        <div className="absolute top-1/3 right-8 w-24 h-24 border-[1px] border-[var(--accent-primary-transparent)] opacity-30 -rotate-12"></div>
        <div className="absolute bottom-1/3 left-8 w-20 h-20 border-[1px] border-[var(--accent-primary-transparent)] opacity-30 rotate-30"></div>
        
        {/* Chat Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center relative z-10">
          {!sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 mr-3 flex items-center justify-center rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span className="material-icons-outlined text-sm">
                menu
              </span>
            </button>
          )}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-[0_0_15px_var(--glow)]">
            <span className="material-icons-outlined text-white text-2xl">
              smart_toy
            </span>
          </div>
          <div className="ml-3">
            <h2 className="text-xl font-medium text-[var(--text-primary)]">NGX Agent Orchestrator</h2>
            <p className="text-xs text-[var(--text-tertiary)]">Your all-in-one AI fitness expert powered by specialized agents</p>
          </div>
          
          {/* New conversation button */}
          <button 
            onClick={() => setMessages([initialMessage])}
            className="ml-auto mr-2 px-3 py-2 h-10 flex items-center justify-center rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border)] text-sm"
          >
            <span className="material-icons-outlined text-sm mr-1">
              refresh
            </span>
            <span>New Conversation</span>
          </button>
          
          {/* Theme toggle button */}
          <button 
            onClick={() => toggleTheme()}
            className="w-10 h-10 flex items-center justify-center rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <span className="material-icons-outlined text-sm">
              {document.documentElement.classList.contains('light') ? 'dark_mode' : 'light_mode'}
            </span>
          </button>
        </div>
        
        {/* Chat Messages */}
        <div id="chat-messages" className="flex-1 overflow-y-auto p-4 space-y-6 relative z-10 pb-6">
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {/* Thinking indicator */}
          {isThinking && (
            <div className="flex items-center p-4 bg-[var(--bg-secondary)] rounded-2xl rounded-tl-sm w-fit max-w-[80%] shadow-lg relative">
              {/* Animated thinking dots */}
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
              </div>
              <span className="ml-3 text-sm text-[var(--text-secondary)]">Thinking...</span>
              
              {/* Glow effect for thinking indicator */}
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[var(--accent-primary)] opacity-30 rounded-full blur-sm"></div>
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className="border-t border-[var(--border)] p-4 relative z-10 bg-[var(--bg-primary)]">
          <InputArea 
            onSendMessage={handleSendMessage}
            placeholder="Message the NGX Agent Orchestrator..."
            isLoading={isThinking}
          />
        </div>
      </div>
    </div>
  );
}
