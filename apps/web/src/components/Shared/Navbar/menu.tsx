import type { FC } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';
import {
  PencilSquareIcon,
  CurrencyDollarIcon,
  Squares2X2Icon,
  UsersIcon,
  UserPlusIcon,
  ViewColumnsIcon
} from '@heroicons/react/24/solid';

const Menu: FC = () => {
  const router = useRouter();
  const  DEMO_USER_ADDRESS = process.env.NEXT_PUBLIC_DEMO_USER_ADDRESS ?? "";

  interface NavItemProps {
    url: string;
    name: string;
    current: boolean;
    icon: string;
  };

  const NavItem = ({ url, name, current, icon }: NavItemProps) => {
    return (
      <Link className="w-full inline-block py-1" href={url} aria-current={current ? 'page' : undefined}>
        <button
          className={clsx(
            'w-full h-14 space-x-2 text-left px-2 md:px-3 rounded-md font-bold cursor-pointer text-sm tracking-wide',
            {
              'text-black dark:text-white bg-green-400 dark:bg-green-600': current,
              'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-green-400 dark:hover:bg-green-600':
                !current
            }
          )}
        >
          {icon === 'Squares2X2' && (<Squares2X2Icon className="inline w-6 h-6" />)}
          {icon === 'PencilSquare' && (<PencilSquareIcon className="inline w-6 h-6" />)}
          {icon === 'CurrencyDollar' && (<CurrencyDollarIcon className="inline w-6 h-6" />)}
          {icon === 'Users' && (<UsersIcon className="inline w-6 h-6" />)}
          {icon === 'UserPlus' && (<UserPlusIcon className="inline w-6 h-6" />)}
          {icon === 'ViewColumns' && (<ViewColumnsIcon className="inline w-6 h-6" />)}
          <span>{name}</span>
        </button>
      </Link>
    );
  };

  const NavItems = () => {
    const { pathname, query } = useRouter();
    const address = query.address == null ? DEMO_USER_ADDRESS : query.address;
    return (
      <>
        <NavItem url={`/overview/${address}`} name="Overview" current={pathname == '/overview/[address]'} icon="Squares2X2" />
        <NavItem url={`/engagement/${address}`} name="Engagement" current={pathname == '/engagement/[address]'} icon="Users" />
        <NavItem url={`/publication/${address}`} name="Publication" current={pathname == '/publication/[address]'} icon="PencilSquare" />
        <NavItem url={`/follower/${address}`} name="Follower" current={pathname == '/follower/[address]'} icon="UserPlus" />
        <NavItem url={`/collect/${address}`} name="Collect" current={pathname == '/collect/[address]'} icon="ViewColumns" />
        <NavItem url={`/revenue/${address}`} name="Revenue" current={pathname == '/revenue/[address]'} icon="CurrencyDollar" />
      </>
    );
  };

  return (
    <NavItems />
  );
}

export default Menu;
