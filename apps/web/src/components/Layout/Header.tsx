import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="text-gray-600 body-font py-4">
      <div className="container mx-auto flex flex-wrap p-2 flex-col md:flex-row border border-gray-300">
        <nav className="flex flex-wrap space-x-8">
          <Link href="/">
            <svg className="w-10 h-10 text-white p-2 inline" viewBox="0 0 350 350" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M151.86 161.438C147.365 168.996 77.2467 170.266 38.9937 148.828C0.740742 127.39 19.3255 61.8415 58.1254 44.6293C96.9253 27.4171 156.355 153.881 151.86 161.438Z" fill="#8B5CF6"/>
              <path d="M151.329 187.672C155.824 195.23 121.899 254.808 83.6457 276.246C45.3927 297.684 -3.79578 249.287 0.247804 208.065C4.2914 166.842 146.834 180.114 151.329 187.672Z" fill="#8B5CF6"/>
              <path d="M174.469 201.234C183.46 201.234 219.651 259.543 219.651 302.419C219.651 345.294 151.878 362.446 117.122 338.435C82.3656 314.425 165.479 201.233 174.469 201.234Z" fill="#8B5CF6"/>
              <path d="M198.14 188.567C202.635 181.008 272.754 179.739 311.006 201.177C349.259 222.615 330.675 288.163 291.875 305.375C253.074 322.587 193.645 196.124 198.14 188.567Z" fill="#8B5CF6"/>
              <path d="M198.671 162.328C194.176 154.77 228.101 95.1917 266.354 73.7532C304.608 52.3153 353.796 100.713 349.753 141.935C345.709 183.158 203.166 169.886 198.671 162.328Z" fill="#8B5CF6"/>
              <path d="M175.53 148.766C166.539 148.766 130.348 90.4571 130.348 47.5812C130.348 4.70524 198.121 -12.4459 232.877 11.5647C267.634 35.5753 184.52 148.767 175.53 148.766Z" fill="#8B5CF6"/>
            </svg>
            <span class="flex-1 font-bold text-xl text-green-500">Lentics</span>
          </Link>
          <Link href="/" className="nav_link_current leading-8">
            Overview
          </Link>
          <Link href="/" className="leading-8">
            Publication
          </Link>
          <Link href="/" className="leading-8">
            Revenue
          </Link>
        </nav>
        <div class=" space-x-8">
          <input type="text" placeholder="search" class="form-input px-4 py-1 rounded"/>
          <button type="button" class="py-2 px-6 text-xs font-medium text-center text-white bg-purple-800 rounded-sm hover:bg-purple-600 focus:ring-4 focus:ring-purple-400">Connect Wallet</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
