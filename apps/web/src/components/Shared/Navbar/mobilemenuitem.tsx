import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState, useRef, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline';
import { PencilSquareIcon, CurrencyDollarIcon, Squares2X2Icon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import clsx from 'clsx';
import {
  useAccount,
} from 'wagmi';

const MobileMenuItems: FC = () => {
  const { address } = useAccount()

  const links = [
    { href: `/overview/${address}`, label: 'Overview', icon: 'Squares2X2' },
    { href: `/publication/${address}`, label: 'Publication', icon: 'PencilSquare' },
    { href: `/revenue/${address}`, label: 'Revenue', icon: 'CurrencyDollar' },
  ]

  return (
    <>
      <Menu as="div" className="relative inline-block text-left md:hidden">
      {({ open }) => (
        <>
        <div>
          <Menu.Button as="button">
            <div className="w-[50px] rounded-full overflow-hidden">
            {open ? (
              <XMarkIcon className="block w-6 h-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="block w-6 h-6" aria-hidden="true" />
            )}
            </div>
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {links.map((link) => (
            <div className="py-1">
            <Menu.Item key={link.href} as={Fragment}>
              {({ active }) => (
                <Link className="w-full inline-block py-1" href={link.href}>
                  <button
                    className={clsx(
                      'w-full h-14 space-x-2 text-left px-2 md:px-3 rounded-md font-bold cursor-pointer text-sm tracking-wide',
                      {
                        'text-black dark:text-white bg-green-400 dark:bg-green-600': active,
                        'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-green-400 dark:hover:bg-green-600':
                          !active
                      }
                    )}
                  >
                    {link.icon === 'Squares2X2' && (<Squares2X2Icon className="inline w-6 h-6" />)}
                    {link.icon === 'PencilSquare' && (<PencilSquareIcon className="inline w-6 h-6" />)}
                    {link.icon === 'CurrencyDollar' && (<CurrencyDollarIcon className="inline w-6 h-6" />)}
                    <span>{link.label}</span>
                  </button>
                </Link>
              )}
            </Menu.Item>
            </div>
            ))}
          </Menu.Items>
        </Transition>
        </>
      )}
      </Menu>
      <img
        className="w-8 h-8 md:hidden"
        style={{width: 'auto', height: '40px'}}
        src='/logo-short.svg'
        alt="Logo"
      />
    </>
  );
};

export default MobileMenuItems;
