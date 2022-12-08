import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link href="/">
            Logo
          </Link>
          <Link href="/api/auth/login">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
