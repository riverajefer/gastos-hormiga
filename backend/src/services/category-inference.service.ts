/**
 * Category inference service - automatically categorizes expenses based on concept
 */

export type Category = 
  | 'comida'
  | 'bebidas'
  | 'transporte'
  | 'antojos'
  | 'entretenimiento'
  | 'otros';

export const CATEGORIES: { id: Category; label: string; emoji: string; color: string }[] = [
  { id: 'comida', label: 'Comida', emoji: '🍔', color: '#FF6B6B' },
  { id: 'bebidas', label: 'Bebidas', emoji: '☕', color: '#4ECDC4' },
  { id: 'transporte', label: 'Transporte', emoji: '🚌', color: '#45B7D1' },
  { id: 'antojos', label: 'Antojos', emoji: '🍫', color: '#96CEB4' },
  { id: 'entretenimiento', label: 'Entretenimiento', emoji: '🎮', color: '#DDA0DD' },
  { id: 'otros', label: 'Otros', emoji: '📦', color: '#778899' },
];

// Keywords for each category
const categoryKeywords: Record<Category, string[]> = {
  comida: [
    'almuerzo', 'desayuno', 'cena', 'hamburguesa', 'pizza', 'sandwich',
    'sándwich', 'arepa', 'empanada', 'pollo', 'arroz', 'restaurante',
    'comida', 'almorzar', 'comer', 'mcdonalds', 'mcdonald', 'burger',
    'subway', 'kfc', 'dominos', 'papas', 'ensalada', 'sopa', 'bandeja',
    'corrientazo', 'menu', 'menú', 'plato', 'asado', 'parrilla', 'sushi',
    'tacos', 'burrito', 'wrap', 'pan', 'panadería', 'panaderia'
  ],
  bebidas: [
    'café', 'cafe', 'tinto', 'cappuccino', 'latte', 'espresso', 'te', 'té',
    'jugo', 'gaseosa', 'coca', 'pepsi', 'sprite', 'agua', 'botella',
    'cerveza', 'bebida', 'refresco', 'soda', 'malteada', 'batido',
    'smoothie', 'starbucks', 'juan valdez', 'oma', 'dunkin', 'limonada',
    'aromática', 'aromatica', 'chocolate', 'milo', 'energizante', 'monster',
    'red bull', 'gatorade'
  ],
  transporte: [
    'uber', 'didi', 'cabify', 'taxi', 'bus', 'buseta', 'transmilenio',
    'metro', 'mio', 'sitp', 'transporte', 'gasolina', 'parqueadero',
    'parking', 'peaje', 'pasaje', 'colectivo', 'bici', 'bicicleta',
    'rappi', 'indriver', 'beat', 'picap', 'moto', 'viaje', 'flota'
  ],
  antojos: [
    'snack', 'papitas', 'chocolatina', 'dulce', 'golosina', 'gomitas',
    'helado', 'postre', 'galletas', 'galleta', 'brownie', 'torta',
    'pastel', 'donut', 'dona', 'churro', 'chitos', 'doritos', 'cheetos',
    'mani', 'maní', 'antojo', 'mecato', 'paquete', 'chicle', 'mentas',
    'bon bon', 'colombina', 'jet', 'nucita', 'wafer', 'chocoramo',
    'ponqué', 'ponque', 'oblea', 'paleta', 'cono'
  ],
  entretenimiento: [
    'netflix', 'spotify', 'cine', 'película', 'pelicula', 'juego',
    'videojuego', 'steam', 'playstation', 'xbox', 'nintendo', 'boleta',
    'concierto', 'teatro', 'museo', 'parque', 'diversión', 'diversion',
    'fiesta', 'cover', 'entrada', 'karaoke', 'boliche', 'bowling',
    'escape room', 'arcade', 'youtube', 'twitch', 'prime', 'hbo',
    'disney', 'amazon', 'suscripción', 'suscripcion', 'app', 'membresía'
  ],
  otros: [] // Default category
};

/**
 * Infers a category based on the expense concept
 */
export function inferCategory(concept: string): Category {
  const normalizedConcept = concept.toLowerCase().trim();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (category === 'otros') continue;
    
    for (const keyword of keywords) {
      if (normalizedConcept.includes(keyword)) {
        return category as Category;
      }
    }
  }
  
  return 'otros';
}

/**
 * Get category info by id
 */
export function getCategoryInfo(categoryId: string) {
  return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES.find(c => c.id === 'otros')!;
}

/**
 * Get all categories
 */
export function getAllCategories() {
  return CATEGORIES;
}
