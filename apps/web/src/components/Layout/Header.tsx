import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="body-font py-4 header">
      <div className="container mx-auto flex flex-wrap p-2 flex-col md:flex-row border border-gray-300 bg-green-100">
        <nav className="flex flex-wrap space-x-8">
          <Link href="/">
            <img src="logo.svg" style={{width: 'auto', height: '56px'}}/>
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
        <div className="ml-auto space-x-8">
          <input type="text" placeholder="search" className="form-input px-4 py-1 rounded"/>
          <button type="button" className="py-2 px-6 text-xs font-medium text-center text-white bg-purple-800 rounded-sm hover:bg-purple-600 focus:ring-4 focus:ring-purple-400">Connect Wallet</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
