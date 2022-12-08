import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link href="/">
            Link1
          </Link>
          <Link href="/">
            Link2
          </Link>
          <Link href="/">
            Link3
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
