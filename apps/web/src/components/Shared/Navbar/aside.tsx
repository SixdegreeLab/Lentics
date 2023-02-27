import type { FC } from 'react';
import Link from 'next/link';
import Menu from '@components/Shared/Navbar/menu';
import Image from 'next/image'
import SixDegreeLogo from '../../../../public/sixdegree.png';
import TwitterLogo from '../../../../public/twitter-circle.svg';
import LensterLogo from '../../../../public/icon.svg';
import LenticsLogo from '../../../../public/logo.svg';

const Aside: FC = () => {
  return (
    <aside className='bg-white hidden md:order-first h-screen md:flex md:flex-col w-60'>
      <div className='flex-grow-0 flex-shrink-0'>
        <Link href="/" className="inline-block">
          <Image
            className="w-auto h-14 mt-1 ml-5 mb-8"
            src={LenticsLogo}
            alt="Lentics"
            priority/>
        </Link>
      </div>
      <div className='flex-grow w-inherit overflow-y-auto h-full mx-6'>
        <Menu />
      </div>
      <div className="sticky bottom-0 items-center border-t-2 border-gray-100 text-center mx-6 pt-4 pb-5">
        <Link className="flex-1 text-center inline-block" href="https://sixdegree.xyz" target="_blank">
          <Image
            className="w-6 h-6 inline"
            src={SixDegreeLogo}
            height={36}
            alt="Sixdegree Lab"
            priority/>
        </Link>
        <Link className="flex-1 text-center mx-8 inline-block" href="https://twitter.com/SixdegreeLab" target="_blank">
          <Image
            className="w-6 h-6 inline"
            src={TwitterLogo}
            height={36}
            alt="Twitter"
            priority/>
        </Link>
        <Link className="flex-1 text-center inline-block" href="https://lenster.xyz/u/sixdegreelab" target="_blank">
          <Image
            className="w-6 h-6 inline"
            src={LensterLogo}
            height={36}
            alt="Lenster"
            priority/>
        </Link>
      </div>
    </aside>
  );
};

export default Aside;
