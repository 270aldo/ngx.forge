// Archivo que define qué rutas están protegidas por autenticación

export const protectedRoutes = [
  "/profile",
  "/chat",
  // Añadir aquí otras rutas que requieran autenticación
];

// Función para verificar si una ruta está protegida
export const isProtectedRoute = (path: string): boolean => {
  return protectedRoutes.some(route => {
    // Verificar si la ruta coincide exactamente o es una subruta
    return path === route || path.startsWith(`${route}/`);
  });
};
