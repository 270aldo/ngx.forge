import React, { useState } from "react";
import { ChatSidebar } from "components/ChatSidebar";
import { MessageBubble, Message } from "components/MessageBubble";
import { InputArea } from "components/InputArea";

interface Props {
  initialMessages?: Message[];
}

export const ChatInterface = ({ initialMessages = [] }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock function to simulate sending a message and getting a response
  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getResponseForAgent(content),
        sender: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="h-screen flex bg-[#121212]">
      {/* Sidebar */}
      <ChatSidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Main Chat Area */}
      <div 
        className={`flex-1 flex flex-col h-screen transition-all ${sidebarOpen ? 'ml-[300px]' : 'ml-0'}`}
      >
        {/* Chat Header */}
        <div className="p-4 border-b border-[#333] flex items-center">
          {!sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 mr-3 flex items-center justify-center rounded-md bg-[#1a1a1a] hover:bg-[#252525] text-[#AAAAAA] hover:text-white transition-colors"
            >
              <span className="material-icons-outlined text-sm">
                menu
              </span>
            </button>
          )}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#6D00FF] to-[#9B4DFF] shadow-[0_0_15px_rgba(109,0,255,0.4)]">
            <span className="material-icons-outlined text-white text-2xl">
              smart_toy
            </span>
          </div>
          <div className="ml-3">
            <h2 className="text-xl font-medium text-white">NGX Agent Orchestrator</h2>
            <p className="text-xs text-[#AAAAAA]">Your all-in-one AI fitness expert powered by specialized agents</p>
          </div>
        </div>
        
        {/* Backdrop blur effect - positioned relative to main container */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-[30%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#6D00FF] opacity-[0.02] blur-[100px]"
          ></div>
          <div 
            className="absolute bottom-[20%] right-[30%] w-[400px] h-[400px] rounded-full bg-[#9B4DFF] opacity-[0.02] blur-[100px]"
          ></div>
        </div>
        
        {/* Messages Area with enhanced styling */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#6D00FF20] to-[#9B4DFF10] mb-4">
                <span className="material-icons-outlined text-[#6D00FF] text-3xl">
                  smart_toy
                </span>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">NGX Agent Orchestrator</h3>
              <p className="text-[#AAAAAA] max-w-md mb-6">Your all-in-one AI fitness expert powered by specialized agents working together behind the scenes - Ask me anything about fitness, nutrition, recovery, and performance.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                {getSampleQuestions().map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    className="text-left p-3 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] rounded-md text-[#CCCCCC] transition-colors hover:border-[#6D00FF40] text-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pb-4">
              {messages.map(message => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 max-w-[80%] flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-[#6D00FF]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#6D00FF]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#6D00FF]"></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <InputArea 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading}
          placeholder="Ask the NGX Agent..."
        />
      </div>
    </div>
  );
};

// Sample questions for the NGX Agent
function getSampleQuestions(): string[] {
  return [
    "Create a 4-week strength program for an intermediate lifter",
    "Design a meal plan for lean muscle gain",
    "What recovery techniques would you recommend after intense training?",
    "How can I improve my sleep quality for better performance?",
    "What's the optimal approach to periodization for a natural athlete?",
    "Can you recommend supplements for cognitive performance?",
    "How should I structure my training around a minor injury?",
    "What systems can I put in place to stay consistent with my program?"
  ];
}

function getResponseForAgent(query: string): string {
  // The orchestrator would normally route to the appropriate specialized agent in the backend
  // For demo purposes, we'll return a comprehensive response that shows how different specialists would contribute
  
  return `## NGX Orchestrated Response

Based on your query about "${query}", I've consulted our specialist agents to provide you with a comprehensive answer:

### Training Perspective

**Progressive Overload**: Gradually increase weight by 2-5% when you can complete all prescribed reps
**Recovery Management**: Ensure 48-72 hours between training the same muscle groups
**Exercise Selection**: Focus on compound movements with appropriate accessory work

| Week | Sets | Reps | Intensity |
|------|------|------|----------|
| 1 | 3 | 8-10 | 70-75% |
| 2 | 4 | 6-8 | 75-80% |

### Nutrition Perspective

**Macronutrient Distribution**:
- Protein: 1.8-2.2g per kg of bodyweight
- Carbohydrates: 4-6g per kg on training days
- Fats: 0.8-1g per kg of bodyweight

### Recovery Perspective

**Sleep Optimization**:
- 7-9 hours per night
- Consistent sleep/wake times
- 30-60 min pre-sleep wind-down routine

**Mobility Work**:
- Hip mobility exercises: 5 reps per side
- Thoracic extensions: 8-10 reps

### Implementation Plan

1. **First Phase (Week 1-2)**: Focus on building foundational habits
2. **Second Phase (Week 3-4)**: Introduce progressive overload and advanced techniques
3. **Monitoring**: Track key metrics and adjust based on your feedback

Would you like me to elaborate on any specific aspect of this plan?`;
}