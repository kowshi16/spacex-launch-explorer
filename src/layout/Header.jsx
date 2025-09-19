// import { Link } from 'react-router-dom'

// export function Header() {
//   return (
//     <header className="bg-gray-900 text-white shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <Link 
//             to="/" 
//             className="text-xl font-bold text-white hover:text-gray-300 transition-colors"
//           >
//             🚀 SpaceX Launch Explorer
//           </Link>
//           <nav>
//             <Link 
//               to="/" 
//               className="px-4 py-2 rounded-md text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
//             >
//               All Launches
//             </Link>
//           </nav>
//         </div>
//       </div>
//     </header>
//   )
// }

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">SpaceX Explorer</h1>
          </Link>
          
          <nav className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Launches
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};