// import MessageIcon from '@components/Messages/MessageIcon';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline';
import { PencilSquareIcon, CurrencyDollarIcon, Squares2X2Icon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

const Navbar: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const router = useRouter();

  const onProfileSelected = () => {
    // router.push(`/u/${formatHandle(profile?.handle)}`);
  };

  interface NavItemProps {
    url: string;
    name: string;
    current: boolean;
    icon: string;
  }

  const NavItem = ({ url, name, current, icon }: NavItemProps) => {
    return (
      <Link className="w-full inline-block py-1" href={url} aria-current={current ? 'page' : undefined}>
        <Disclosure.Button
          className={clsx(
            'w-full h-14 space-x-2 text-left px-2 md:px-3 rounded-md font-bold cursor-pointer text-sm tracking-wide',
            {
              'text-black dark:text-white bg-green-400 dark:bg-green-600': current,
              'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-green-400 dark:hover:bg-green-600':
                !current
            }
          )}
        >
          {icon==='Squares2X2' && (<Squares2X2Icon className="inline w-6 h-6"/>)}
          {icon==='PencilSquare' && (<PencilSquareIcon className="inline w-6 h-6"/>)}
          {icon==='CurrencyDollar' && (<CurrencyDollarIcon className="inline w-6 h-6"/>)}
          <span>{name}</span>
        </Disclosure.Button>
      </Link>
    );
  };

  const NavItems = () => {
    const { pathname } = useRouter();
    return (
      <>
        <NavItem url="/" name="Overview" current={pathname == '/'} icon="Squares2X2" />
        <NavItem url="/publication" name="Publication" current={pathname == '/publication'} icon="PencilSquare" />
        <NavItem url="/revenue" name="Revenue" current={pathname == '/revenue'} icon="CurrencyDollar" />
      </>
    );
  };

  return (
    <Disclosure
      as="header"
      className="sticky top-0 z-10 w-full sm:w-64 sm:h-full body-font sm:py-4 left-side border border-t-0 border-b-0 border-l-0 border-gray-300 bg-white dark:bg-gray-900 dark:border-b-gray-700/80"
    >
      {({ open }) => (
        <>
          <div className="container sm:px-5 mx-auto max-w-screen-xl left-side-content flex flex-wrap sm:p-2 sm:flex-col">
            <div className="relative justify-between items-center h-14 sm:h-16 w-full">
              <div className="block sm:flex sm:flex-col justify-start items-center sm:space-y-2">
                <Disclosure.Button className="absolute top-2 left-2 inline-flex justify-center items-center mr-4 text-gray-500 rounded-md sm:hidden focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block w-8 h-8" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block w-8 h-8" aria-hidden="true" />
                  )}
                </Disclosure.Button>
                <div className="text-center sm:mb-16">
                  <Link href="/" className="inline-block">
                    <img
                      className="hidden lg:block w-auto h-[40px] sm:h-[86px] sm:mb-16"
                      src='/logo.svg'
                      alt="Logo"
                    />
                    <img
                      className="lg:hidden w-auto h-[40px] sm:h-[86px] sm:mb-16"
                      src='/lentics.svg'
                      alt="Logo"
                    />
                  </Link>
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <NavItems />
                </div>
              </div>
              <div className="container left-side-bottom sm:flex absolute bottom-0 mx-auto max-w-screen-xl mx-auto flex-wrap pt-4 items-center border border-r-0 border-b-0 border-l-0 border-gray-300">
                <Link className="flex-1 text-center" href="/">
                  <img className="w-8 h-8 inline" style={{width: 'auto', height: '36px'}} src='/icon2.png' alt="icon" />
                </Link>
                <Link className="flex-1 text-center" href="/">
                  <img className="w-8 h-8 inline" style={{width: 'auto', height: '36px'}} src='/icon3.png' alt="icon" />
                </Link>
                <Link className="flex-1 text-center" href="/">
                  <img className="w-8 h-8 inline" style={{width: 'auto', height: '36px'}} src='/icon.svg' alt="icon" />
                </Link>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="flex flex-col p-3 space-y-2">
              <NavItems />
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
