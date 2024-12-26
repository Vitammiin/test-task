// 'use client';
// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// const NavBar = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const router = useRouter();

// //     useEffect(() => {
// //         const handleStart = () => setIsLoading(true);
// //         const handleComplete = () => setIsLoading(false);
// //     )
// // };

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
//       {isLoading && (
//         <div className="fixed top-0 left-0 right-0 z-50">
//
//         </div>
//       )}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <div className="hidden md:block">
//             <div className="ml-10 flex items-baseline space-x-4">
//               <Link
//                 href="/form"
//                 className="text-gray-300 hover:bg-purple-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
//               >
//                 Form
//               </Link>
//               <Link
//                 href="/"
//                 className="text-gray-300 hover:bg-purple-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
//               >
//                 Audio
//               </Link>
//               <Link
//                 href="/stock"
//                 className="text-gray-300 hover:bg-purple-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
//               >
//                 Stock
//               </Link>
//             </div>
//           </div>
//           <div className="md:hidden">
//             <button
//               onClick={toggleMenu}
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-800 focus:ring-white"
//             >
//               <span className="sr-only">Open main menu</span>
//               {!isOpen ? (
//                 <svg
//                   className="block h-6 w-6"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   className="block h-6 w-6"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {isOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//             <Link
//               href="/form"
//               className="text-gray-300 hover:bg-purple-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-300"
//             >
//               Form
//             </Link>
//             <Link
//               href="/audio"
//               className="text-gray-300 hover:bg-purple-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-300"
//             >
//               Audio
//             </Link>
//             <Link
//               href="/stock"
//               className="text-gray-300 hover:bg-purple-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-300"
//             >
//               Stock
//             </Link>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default NavBar;
