// import { useState, useEffect, useCallback } from 'react'

// const FAVORITES_KEY = 'spacex-favorites'

// export function useFavorites() {
//   const [favorites, setFavorites] = useState(new Set())

//   // Load favorites from localStorage on mount
//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem(FAVORITES_KEY)
//       if (stored) {
//         setFavorites(new Set(JSON.parse(stored)))
//       }
//     } catch (error) {
//       console.error('Failed to load favorites:', error)
//     }
//   }, [])

//   // Save favorites to localStorage whenever they change
//   useEffect(() => {
//     try {
//       localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]))
//     } catch (error) {
//       console.error('Failed to save favorites:', error)
//     }
//   }, [favorites])

//   const toggleFavorite = useCallback((launchId) => {
//     setFavorites(prev => {
//       const newFavorites = new Set(prev)
//       if (newFavorites.has(launchId)) {
//         newFavorites.delete(launchId)
//       } else {
//         newFavorites.add(launchId)
//       }
//       return newFavorites
//     })
//   }, [])

//   const isFavorite = useCallback((launchId) => {
//     return favorites.has(launchId)
//   }, [favorites])

//   return {
//     favorites,
//     toggleFavorite,
//     isFavorite,
//     favoriteCount: favorites.size
//   }
// }


import { useLocalStorage } from './useLocalStorage';

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage('spacex-favorites', []);

  const toggleFavorite = (launchId) => {
    setFavorites(prev => 
      prev.includes(launchId) 
        ? prev.filter(id => id !== launchId)
        : [...prev, launchId]
    );
  };

  const isFavorite = (launchId) => favorites.includes(launchId);

  return { favorites, toggleFavorite, isFavorite };
};