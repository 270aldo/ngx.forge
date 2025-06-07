import React from "react";
import { useNavigate } from "react-router-dom";
import { toggleTheme } from "../utils/theme";

interface Props {
  isOpen?: boolean;
  onToggle?: () => void;
}

type NavItemProps = {
  label: string;
  icon: string;
  isActive?: boolean;
  onClick: () => void;
};

type ConversationInfo = {
  id: string;
  title: string;
  date: Date;
  preview: string;
};

// Example recent conversations
const recentConversations: ConversationInfo[] = [
  {
    id: "conv1",
    title: "Training Program Design",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    preview: "4-week strength program for an intermediate lifter"
  },
  {
    id: "conv2",
    title: "Nutrition Planning",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    preview: "Meal plan for lean muscle gain and recovery"
  },
  {
    id: "conv3",
    title: "Recovery Protocol",
    date: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    preview: "Sleep optimization strategy and recovery techniques"
  }
];

const NavItem = ({ label, icon, isActive = false, onClick }: NavItemProps) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center p-3 rounded-md
      ${isActive ? 
        'bg-gradient-to-r from-[#6D00FF20] to-[#9B4DFF10] text-white' : 
        'text-[#AAAAAA] hover:bg-[#1a1a1a]'}
    `}
  >
    {/* Icon with gradient background when active */}
    <div className={`relative flex items-center justify-center mr-3 ${isActive ? 'text-white' : 'text-[#AAAAAA]'}`}>
      {isActive && (
        <div className="absolute inset-0 w-8 h-8 bg-gradient-to-br from-[#6D00FF] to-[#9B4DFF] rounded-md"></div>
      )}
      <span className={`material-icons-outlined z-10 ${isActive ? 'text-white' : 'text-[#AAAAAA]'}`}>
        {icon}
      </span>
    </div>
    
    <div className="flex flex-col">
      <span className={`font-medium ${isActive ? 'text-white' : 'text-[#CCCCCC]'}`}>{label}</span>
      {isActive && (
        <div className="h-0.5 w-full bg-gradient-to-r from-[#6D00FF] to-transparent mt-0.5"></div>
      )}
    </div>
  </button>
);

const ConversationItem = ({ conversation }: { conversation: ConversationInfo }) => (
  <button 
    className="w-full flex flex-col p-3 rounded-md text-left hover:bg-[var(--bg-secondary)]"
    onClick={() => {}}
  >
    <div className="flex justify-between items-center">
      <span className="font-medium text-[var(--text-secondary)]">{conversation.title}</span>
      <span className="text-xs text-[var(--text-tertiary)]">
        {formatDate(conversation.date)}
      </span>
    </div>
    <p className="text-sm text-[var(--text-tertiary)] truncate mt-1">
      {conversation.preview}
    </p>
  </button>
);

const formatDate = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const ChatSidebar = ({ isOpen = true, onToggle }: Props) => {
  const navigate = useNavigate();
    
  return (
    <div 
      className={`
        fixed top-0 left-0 h-full transition-all duration-300 z-30 overflow-hidden
        ${isOpen ? 'w-[300px]' : 'w-0 opacity-0'}
        bg-[var(--bg-primary)] border-r border-[var(--border)] shadow-lg
      `}
    >
      <div className="flex flex-col h-full">
        {/* Header with toggle button */}
        <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gradient-to-br from-[#6D00FF] to-[#9B4DFF]">
              <span className="text-xl font-bold text-white">NGX</span>
            </div>
            {isOpen && <h1 className="ml-3 text-xl font-medium text-[var(--text-primary)]">NexusForge</h1>}
          </div>
          
          <div className="flex space-x-2">
            {/* Sidebar toggle button */}
            <button 
              onClick={onToggle} 
              className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              <span className="material-icons-outlined text-sm">
                menu_open
              </span>
            </button>
          </div>
        </div>
        
        {/* Main navigation area with scrolling */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {/* New Chat button with premium design */}
          <button 
            onClick={() => navigate('/chat/new')}
            className="group w-full p-3 relative overflow-hidden rounded-xl flex items-center justify-center transition-all duration-300 mb-4"
          >
            {/* Background layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Hexagonal pattern overlay */}
            <div 
              className="absolute inset-0 opacity-10 hexagon-bg" 
            ></div>
            
            {/* Border glow effect */}
            <div className="absolute inset-0 rounded-xl shadow-[0_0_15px_var(--glow)] group-hover:shadow-[0_0_20px_var(--glow)] transition-all duration-300"></div>
            
            {/* Icon with animated ring */}
            <div className="relative flex items-center justify-center">
              <div className="relative mr-2">
                <span className="material-icons-outlined relative z-10 text-white">
                  add
                </span>
              </div>
              {isOpen && 
                <span className="relative z-10 text-white font-medium">
                  New Chat
                </span>
              }
            </div>
          </button>
          
          {/* Main NGX Agent */}
          {isOpen && <h2 className="text-[var(--text-tertiary)] text-xs uppercase font-medium tracking-wider px-2 mb-1">Your Agent</h2>}
          <div className="mb-4">
            {isOpen ? (
              <div className="relative overflow-hidden rounded-md bg-gradient-to-r from-[var(--accent-primary)20] to-[var(--accent-secondary)10]">
                <div className="p-3 flex items-center">
                  <div className="w-8 h-8 rounded-md mr-3 flex items-center justify-center bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-[0_0_10px_var(--glow)]">
                    <span className="material-icons-outlined text-white text-sm">
                      smart_toy
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-[var(--text-primary)]">NGX Agent Orchestrator</span>
                    <div className="h-0.5 w-full bg-gradient-to-r from-[var(--accent-primary)] to-transparent mt-0.5"></div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {}}
                className="w-10 h-10 rounded-md flex items-center justify-center my-1 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-[0_0_10px_var(--glow)]"
                title="NGX Agent"
              >
                <span className="material-icons-outlined text-white text-sm">
                  smart_toy
                </span>
              </button>
            )}
            
            {isOpen && (
              <p className="text-xs text-[var(--text-tertiary)] mt-1 px-2">
                The NGX Agent combines training, nutrition, recovery, cognitive, motivation, biometrics, systems, community, and security expertise in one powerful AI.
              </p>
            )}
          </div>
          
          {/* Recent conversations */}
          {isOpen && (
            <>
              <h2 className="text-[var(--text-tertiary)] text-xs uppercase font-medium tracking-wider px-2 mb-1">Recent Conversations</h2>
              <div className="space-y-1">
                {recentConversations.map(conversation => (
                  <ConversationItem key={conversation.id} conversation={conversation} />
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* User section at bottom */}
        <div className="p-4 border-t border-[var(--border)]">
          <div className="flex items-center">
            <div className="w-9 h-9 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center">
              <span className="material-icons-outlined text-[var(--text-tertiary)]">
                person
              </span>
            </div>
            
            {isOpen && (
              <>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-[var(--text-primary)]">User Name</div>
                  <div className="text-xs text-[var(--text-tertiary)]">Pro Account</div>
                </div>
                
                <button className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                  <span className="material-icons-outlined text-xl">
                    settings
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
