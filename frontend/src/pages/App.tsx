import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function App() {
  useEffect(() => {
    // Inicializar tema cuando se monta el componente principal
    const savedTheme = localStorage.getItem('ngx-theme') || 'dark';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(savedTheme);
    
    // Escuchar por cambios en localStorage (por ejemplo, desde otra pestaña)
    const handleStorageChange = (e) => {
      if (e.key === 'ngx-theme') {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(e.newValue || 'dark');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#121212] text-white overflow-hidden relative">
      {/* Background grid and effects */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute w-full h-full bg-[url('https://assets.codepen.io/3685267/grid.svg')] bg-repeat"></div>
      </div>
      
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[#6D00FF] rounded-full filter blur-[128px] opacity-10 z-0"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-[#6D00FF] rounded-full filter blur-[128px] opacity-10 z-0"></div>
      
      {/* Header */}
      <header className="relative z-10 pt-6 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gradient-to-br from-[#6D00FF] to-[#9B4DFF] shadow-[0_0_15px_rgba(109,0,255,0.4)]">
            <span className="text-xl font-bold">NGX</span>
          </div>
          <h1 className="ml-3 text-xl font-medium">NexusForge</h1>
        </div>
        
        <nav>
          <Button 
            onClick={() => navigate('/login')} 
            className="bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-[#CCC] rounded-md px-4 py-2 text-sm transition-all duration-300"
            variant="ghost"
          >
            Login
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 pt-12 lg:pt-24 pb-20">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text Content */}
          <div className="lg:w-1/2 space-y-8 lg:pr-12">
            {/* Headline */}
            <div>
              <h2 className="text-sm uppercase tracking-wider text-[#6D00FF] mb-2 font-medium">AI-Powered Fitness System</h2>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D00FF] to-[#9B4DFF]">Fitness</span> With Specialized AI Agents
              </h1>
            </div>
            
            {/* Description */}
            <p className="text-lg text-[#AAAAAA] max-w-xl">
              NexusForge combines specialized AI agents to deliver personalized coaching, 
              training plans, nutrition guidance, and recovery strategies designed specifically 
              for fitness professionals and their clients.
            </p>
            
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/login')} 
                className="bg-black hover:bg-[#0a0a0a] border-2 border-[#6D00FF50] group relative overflow-hidden rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(109,0,255,0.2)]"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#111] via-[#222] to-[#111] opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#6D00FF20] to-[#9B4DFF20] opacity-30 group-hover:opacity-50 transition-opacity duration-300"></span>
                <span className="relative z-10 px-8 py-3 text-md font-medium text-white group-hover:text-[#f0f0f0] drop-shadow-[0_0_3px_#ffffff80]">Get Started</span>
                <div className="absolute -inset-1 opacity-0 group-hover:opacity-100 bg-[#6D00FF] blur-xl transition-opacity duration-500 group-hover:duration-200"></div>
              </Button>
              
              <Button 
                variant="outline"
                className="border border-[#333] hover:border-[#6D00FF40] hover:bg-[#6D00FF10] text-white backdrop-blur-md px-8 py-3 rounded-lg transition-all duration-300 font-medium"
              >
                Learn More
              </Button>
            </div>
            
            {/* Feature highlight */}
            <div className="pt-10 flex items-center space-x-6">
              <div className="text-sm text-[#AAAAAA] flex items-center">
                <span className="material-icons-outlined text-[#6D00FF] mr-2 text-xl">verified</span>
                Advanced AI Agents
              </div>
              <div className="text-sm text-[#AAAAAA] flex items-center">
                <span className="material-icons-outlined text-[#6D00FF] mr-2 text-xl">verified</span>
                Personalized Plans
              </div>
              <div className="text-sm text-[#AAAAAA] flex items-center">
                <span className="material-icons-outlined text-[#6D00FF] mr-2 text-xl">verified</span>
                Real-time Insights
              </div>
            </div>
          </div>
          
          {/* Visual Element */}
          <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
            <div className="relative">
              {/* Main visual element */}
              <div className="w-[420px] h-[420px] bg-gradient-to-br from-[#6D00FF20] to-[#6D00FF05] backdrop-blur-sm rounded-3xl p-[1px] border border-[#6D00FF20] shadow-[0_0_80px_rgba(109,0,255,0.15)]">
                <div className="w-full h-full rounded-3xl overflow-hidden backdrop-blur-sm bg-[#13131390]">
                  {/* Hexagon grid pattern */}
                  <div className="absolute inset-0 opacity-10 bg-[url('https://assets.codepen.io/3685267/hex-pattern.svg')] bg-repeat"></div>
                  
                  {/* Central NGX logo */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#6D00FF] to-[#9B4DFF] shadow-[0_0_40px_rgba(109,0,255,0.4)]">
                    <span className="text-5xl font-bold">NGX</span>
                  </div>
                  
                  {/* Animated dots/lines connecting to central logo */}
                  <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-[#6D00FF]" 
                        style={{
                          top: `${20 + Math.random() * 60}%`,
                          left: `${20 + Math.random() * 60}%`,
                          boxShadow: '0 0 10px rgba(109,0,255,0.8)',
                          animation: `pulse 3s infinite ${Math.random() * 2}s`
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Agent labels */}
                  <div className="absolute inset-8 flex items-center justify-center">
                    <div className="w-full h-full relative">
                      {[
                        { label: "Training", angle: 60, icon: "fitness_center" },
                        { label: "Nutrition", angle: 120, icon: "restaurant" },
                        { label: "Recovery", angle: 180, icon: "bedtime" },
                        { label: "Cognitive", angle: 240, icon: "psychology" },
                        { label: "Biometrics", angle: 300, icon: "monitoring" },
                        { label: "Motivation", angle: 360, icon: "emoji_events" }
                      ].map((item, i) => {
                        const radius = 160;
                        const angleRad = (item.angle * Math.PI) / 180;
                        const x = Math.cos(angleRad) * radius;
                        const y = Math.sin(angleRad) * radius;
                        
                        return (
                          <div 
                            key={i}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center bg-[#1a1a1a90] backdrop-blur-sm px-2 py-1 rounded-md border border-[#6D00FF30] text-xs"
                            style={{
                              left: `calc(50% + ${x}px)`,
                              top: `calc(50% + ${y}px)`,
                            }}
                          >
                            <span className="material-icons-outlined text-[#6D00FF] mr-1 text-xs">
                              {item.icon}
                            </span>
                            {item.label}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 rounded-md bg-[#6D00FF10] border border-[#6D00FF30] backdrop-blur-sm"></div>
              <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-xl bg-[#6D00FF10] border border-[#6D00FF30] backdrop-blur-sm"></div>
            </div>
          </div>
        </div>
        
        {/* Feature Cards */}
        <section className="mt-28 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Advanced Agent Technology</h2>
          <p className="text-[#AAAAAA] text-center mb-12 max-w-2xl mx-auto">Each agent specializes in a different aspect of fitness to provide comprehensive support for your goals.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Elite Training Strategist",
                description: "Customized workout plans tailored to your specific goals and abilities.",
                icon: "fitness_center"
              },
              {
                title: "Precision Nutrition",
                description: "Personalized meal plans and nutritional guidance for optimal performance.",
                icon: "restaurant"
              },
              {
                title: "Recovery Specialist",
                description: "Optimize your recovery with personalized recommendations and monitoring.",
                icon: "bedtime"
              },
              {
                title: "Cognitive Strategist",
                description: "Mental performance optimization and biohacking techniques.",
                icon: "psychology"
              },
              {
                title: "Biometrics Engine",
                description: "Track and analyze your biometric data for personalized insights.",
                icon: "favorite"
              },
              {
                title: "Motivation Coach",
                description: "Stay on track with behavioral science-based motivation techniques.",
                icon: "emoji_events"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group bg-[#13131390] backdrop-blur-sm border border-[#333] hover:border-[#6D00FF40] rounded-xl p-6 hover:shadow-[0_0_30px_rgba(109,0,255,0.08)] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-[#6D00FF10] flex items-center justify-center mb-4 group-hover:bg-[#6D00FF20] transition-all duration-300">
                  <span className="material-icons-outlined text-[#6D00FF]">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#6D00FF] transition-colors duration-300">{feature.title}</h3>
                <p className="text-[#AAAAAA]">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Final CTA */}
        <section className="my-20 max-w-4xl mx-auto text-center">
          <div className="p-[1px] rounded-2xl bg-gradient-to-r from-[#6D00FF40] to-[#9B4DFF10]">
            <div className="bg-[#13131390] backdrop-blur-sm p-12 rounded-2xl">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Fitness Journey?</h2>
              <p className="text-[#AAAAAA] mb-8 max-w-2xl mx-auto">Join NexusForge today and experience the future of AI-powered fitness coaching.</p>
              
              <Button 
                onClick={() => navigate('/login')} 
                className="bg-[#13131380] backdrop-blur-sm border border-[#6D00FF40] group relative overflow-hidden rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(109,0,255,0.2)]"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#6D00FF20] to-[#9B4DFF20] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute inset-0 w-0 h-full bg-gradient-to-r from-[#6D00FF] to-[#9B4DFF] -z-10 group-hover:w-full transition-all duration-500 ease-out"></span>
                <span className="relative z-10 px-8 py-3 text-md font-medium">Get Started Now</span>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-[#777777] text-sm py-8 border-t border-t-[#333]">
        <div className="container mx-auto px-4">
          <p>© 2025 NGX Systems. All rights reserved.</p>
          <p className="mt-2">Designed for fitness professionals and health enthusiasts.</p>
        </div>
      </footer>
      
      {/* Add CSS for the pulsing animation */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.4; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
