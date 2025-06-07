// Funciones para manejar el tema

// Inicializa el tema basado en localStorage o establece tema oscuro por defecto
export function initTheme() {
  const savedTheme = localStorage.getItem('ngx-theme') || 'dark';
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(savedTheme);
}

// Alterna entre tema claro y oscuro
export function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';
  
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(newTheme);
  localStorage.setItem('ngx-theme', newTheme);
  
  // Forzar re-render de componentes que dependen del tema
  window.dispatchEvent(new Event('storage'));
}

// Obtiene el tema actual
export function getCurrentTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

// NGX Theme Constants (anteriores)
export const NGX_COLORS = {
  background: '#121212',
  accent: '#6D00FF',
  accentLight: '#8F3FFF',
  accentDark: '#5500CC',
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  border: '#333333',
  cardBg: '#1A1A1A',
  hover: '#333333',
};
