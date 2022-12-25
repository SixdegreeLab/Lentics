import type { FC } from 'react';
import Link from 'next/link';
import Menu from '@components/Shared/Navbar/menu';

const Aside: FC = () => {
  return (
    <aside className='bg-white hidden md:order-first h-screen md:flex md:flex-col w-60'>
      <div className='flex-grow-0 flex-shrink-0'>
        <Link href="/" className="inline-block">
          <img
            className="w-auto h-14 mt-5 ml-5 mb-14"
            src='/logo.svg'
            alt="Lentics"
          />
        </Link>
      </div>
      <div className='flex-grow w-inherit overflow-y-auto h-full mx-6'>
        <Menu />
      </div>
      <div className="sticky bottom-0 items-center border-t-2 border-gray-100 text-center mx-6 pt-4 pb-5">
        <Link className="flex-1 text-center" href="/">
          <img className="w-8 h-8 inline" style={{width: 'auto', height: '36px'}} src='/icon2.png' alt="icon" />
        </Link>
        <Link className="flex-1 text-center mx-8" href="/">
          <img className="w-8 h-8 inline" style={{width: 'auto', height: '36px'}} src='/icon3.png' alt="icon" />
        </Link>
        <Link className="flex-1 text-center" href="/">
          <img className="w-8 h-8 inline" style={{width: 'auto', height: '36px'}} src='/icon.svg' alt="icon" />
        </Link>
      </div>
    </aside>
  );
};

export default Aside;
