import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen?: boolean;
}

type NavItemProps = {
  icon: string;
  label: string;
  onClick: () => void;
  isOpen: boolean;
};

type NavGroupProps = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
};

const NavItem = ({ icon, label, onClick, isOpen }: NavItemProps) => (
  <li>
    <button 
      onClick={onClick}
      className="w-full flex items-center p-2 text-white hover:bg-[#333] rounded-md transition-colors group"
    >
      <span className="material-icons-outlined text-[#AAAAAA] group-hover:text-[#6D00FF]">
        {icon}
      </span>
      {isOpen && <span className="ml-3">{label}</span>}
    </button>
  </li>
);

const NavGroup = ({ title, children, isOpen }: NavGroupProps) => (
  <div className="mb-4">
    {isOpen && (
      <h3 className="text-xs uppercase text-[#777777] font-medium tracking-wider px-2 mb-2">
        {title}
      </h3>
    )}
    <ul className="space-y-1">
      {children}
    </ul>
  </div>
);

export const Sidebar = ({ isOpen = true }: Props) => {
  const navigate = useNavigate();
  
  return (
    <aside 
      className={`bg-[#121212] border-r border-r-[#333] h-screen transition-all duration-300 ${isOpen ? 'w-[25%]' : 'w-[60px]'}`}
    >
      <div className="flex flex-col h-full p-3">
        {/* Logo and title */}
        <div className={`flex items-center mb-8 px-2 ${isOpen ? 'justify-start' : 'justify-center'}`}>
          <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gradient-to-br from-[#6D00FF] to-[#9B4DFF] text-white font-bold text-xl shadow-[0_0_15px_rgba(109,0,255,0.3)]">
            NGX
          </div>
          {isOpen && (
            <h1 className="ml-3 text-white text-xl font-bold">NexusForge</h1>
          )}
        </div>
        
        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent pr-1">
          <NavGroup title="Main" isOpen={isOpen}>
            <NavItem
              icon="home"
              label="Home"
              onClick={() => navigate('/')}
              isOpen={isOpen}
            />
            <NavItem
              icon="dashboard"
              label="Dashboard"
              onClick={() => navigate('/dashboard')}
              isOpen={isOpen}
            />
          </NavGroup>

          <NavGroup title="Agents" isOpen={isOpen}>
            <NavItem
              icon="fitness_center"
              label="Training"
              onClick={() => navigate('/training')}
              isOpen={isOpen}
            />
            <NavItem
              icon="restaurant"
              label="Nutrition"
              onClick={() => navigate('/nutrition')}
              isOpen={isOpen}
            />
            <NavItem
              icon="bedtime"
              label="Recovery"
              onClick={() => navigate('/recovery')}
              isOpen={isOpen}
            />
            <NavItem
              icon="psychology"
              label="Cognitive"
              onClick={() => navigate('/cognitive')}
              isOpen={isOpen}
            />
            <NavItem
              icon="emoji_events"
              label="Motivation"
              onClick={() => navigate('/motivation')}
              isOpen={isOpen}
            />
          </NavGroup>

          <NavGroup title="Data" isOpen={isOpen}>
            <NavItem
              icon="monitoring"
              label="Biometrics"
              onClick={() => navigate('/biometrics')}
              isOpen={isOpen}
            />
            <NavItem
              icon="history"
              label="History"
              onClick={() => navigate('/history')}
              isOpen={isOpen}
            />
          </NavGroup>
        </div>
        
        {/* User Menu */}
        <div className="mt-auto border-t border-t-[#333] pt-3">
          <NavGroup title="Account" isOpen={isOpen}>
            <NavItem
              icon="person"
              label="Profile"
              onClick={() => navigate('/profile')}
              isOpen={isOpen}
            />
            <NavItem
              icon="settings"
              label="Settings"
              onClick={() => navigate('/settings')}
              isOpen={isOpen}
            />
            <NavItem
              icon="login"
              label="Login"
              onClick={() => navigate('/login')}
              isOpen={isOpen}
            />
          </NavGroup>
        </div>

        {/* Footer */}
        {isOpen && (
          <div className="mt-4 pb-2 text-center">
            <div className="text-[#777777] text-xs">
              <p>NexusForge v1.0</p>
              <p>© 2025 NGX Systems</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

