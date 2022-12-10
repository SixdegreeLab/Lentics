import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="text-gray-600 body-font bg-green-100 footer">
      <div className="container mx-auto flex space-x-4 flex-wrap p-5 flex-col md:flex-row">
        <div className="flex-1 footer-logo">
          <Link href="/">
            <img src="logo.svg" style={{width: 'auto', height: '88px'}}/>
          </Link>
        </div>
        <div className="ml-auto flex space-x-8 footer-content">
          <div className="flex-1">
            <ul>
              <li className="font-bold text-lg">Product</li>
              <li className="text-sm leading-8"><Link href="/">Features</Link></li>
              <li className="text-sm leading-8"><Link href="/">Pricing</Link></li>
            </ul>
          </div>
          <div className="flex-1">
            <ul>
              <li className="font-bold text-lg">Resources</li>
              <li className="text-sm leading-8"><Link href="/">Blog</Link></li>
              <li className="text-sm leading-8"><Link href="/">User guides</Link></li>
              <li className="text-sm leading-8"><Link href="/">Webinars</Link></li>
            </ul>
          </div>
          <div className="flex-1">
            <ul>
              <li className="font-bold text-lg">About</li>
              <li className="text-sm leading-8"><Link href="/">About</Link></li>
              <li className="text-sm leading-8"><Link href="/">Join us</Link></li>
            </ul>
          </div>
          <div className="flex-1 subscribe-item">
            <div className="font-bold text-lg text-purple-600">Subscribe to our newsletter</div>
            <div className="text-sm leading-8">For product announcements and exclusive insights</div>
            <div className="">
              <input type="text" placeholder="input your email" className="form-input px-4 py-1 rounded rounded-r-none"/>
              <button type="button" className="py-2 px-6 text-xs font-medium text-center text-white bg-purple-800 rounded-sm hover:bg-purple-600 focus:ring-4 focus:ring-purple-400">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
