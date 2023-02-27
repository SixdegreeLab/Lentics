import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState, useRef, Fragment } from 'react';
import { signOut, useSession } from "next-auth/react";
import { Menu, Transition } from '@headlessui/react';
import MobileMenuItems from '@components/Shared/Navbar/mobilemenuitem';
import { DEMO_USER_ADDRESS } from 'data/constants';
import { MixpanelTracking } from "@lib/mixpanel";
import Image from 'next/image'

import {
  useAccount,
  useConnect,
  useDisconnect,
  WagmiConfig,
  createClient,
  useSignMessage
} from 'wagmi';
import dynamic from 'next/dynamic'
const DynamicSignInDialog = dynamic(() => import('@components/Shared/Navbar/signin'));

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export type NavbarProps = {
  addressName?: string
  addressHandle?: string
}


const Navbar: FC<NavbarProps> = () => {
  const router = useRouter();
  const defaultAvatar = '/avatar.jpg'
  const { address='', connector, isConnected } = useAccount()
  const { data: session, status } = useSession()
  const sessionInfo = session ? {
    address: session.address,
    name: session.user.name??'',
    image: session.user.image??defaultAvatar,
    handle: session.user.handle ? `@${session.user.handle}` : '' } : null 
  const [walletInfo, setWalletInfo] = useState(sessionInfo);
  const { disconnect } = useDisconnect()
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [avatarSrc, setAvatarSrc] = useState<any>(walletInfo?.image)
  const isIndexPage = router.pathname === '/'
  
  useEffect(() => {
    if (session) {
      setAvatarSrc(session.user.image??defaultAvatar)
      setWalletInfo({
        address,
        name: session.user.name??'',
        image: session.user.image??defaultAvatar,
        handle: session.user.handle? `@${session.user.handle}` : ''
      })
    }
  }, [session])

  const handleSignOut = (e: any) => {
    e.preventDefault();
    disconnect();
    signOut();
    MixpanelTracking.getInstance().signOut({address: walletInfo?.address});
  }

  const handleViewSelf = (e: any) => {
    e.preventDefault();
    location.href = `/overview/${walletInfo?.address}`;
  }

  const handleViewDemo = (e: any) => {
    e.preventDefault();
    location.href = `/overview/${DEMO_USER_ADDRESS}`;
  }
  
  const handleConnectWallet = (e: any) => {
    e.preventDefault()
    setIsOpenDialog(true)
  }
  
  const handleLoadingComplete = ({ naturalWidth=0 }) => {
    if (!naturalWidth) {
      setAvatarSrc(defaultAvatar)
    }
  }

  return (
    <nav className={`w-full mt-1 flex items-center justify-between md:justify-end md:px-4 xl:px-4 h-16 ${isIndexPage ? 'border-b-0' : 'border-b-2'} border-gray-300`}>
      {
        walletInfo ? (
          <>
            <div className="flex-grow space-x-2 hidden md:block">
              {
                isIndexPage && (<h3 className="inline text-3xl font-bold">Analytics</h3>)
              }
            </div>
            <MobileMenuItems />
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button as={Fragment}>
                  <div className="flex items-center space-x-2 cursor-pointer">
                    {
                      !isIndexPage && (<div className="hidden md:block">
                        {walletInfo?.handle ?? walletInfo?.name}
                      </div>)
                    }
                    <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                      <Image src={avatarSrc}
                             placeholder="blur"
                             blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkkI39DwACGgF7lpEkjAAAAABJRU5ErkJggg=="
                             width={100}
                             height={100}
                             onLoadingComplete={handleLoadingComplete}
                             alt={walletInfo.handle}
                             priority/>
                    </div>
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1 border-b-2 border-gray-300">
                    <Menu.Item>
                      {({ active }: any) => (
                        <button
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block w-full px-4 py-2 text-left text-sm'
                          )}
                          onClick={handleViewSelf}
                        >
                          View Self
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }: any) => (
                        <button
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block w-full px-4 py-2 text-left text-sm'
                          )}
                          onClick={handleViewDemo}
                        >
                          View Demo
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }: any) => (
                        <button
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block w-full px-4 py-2 text-left text-sm'
                          )}
                          onClick={handleSignOut}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </>
        ) : (
          <>
            <div className="flex-grow space-x-2 hidden md:block">
              {
                isIndexPage && (<h3 className="inline text-3xl font-bold">Analytics</h3>)
              }
            </div>
            <MobileMenuItems />
            <button className="flex justify-center rounded border border-transparent bg-[#5CC87EFF] px-4 py-2 text-sm font-medium text-white hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" onClick={handleConnectWallet}>
              Connect Wallet
            </button>
            <DynamicSignInDialog
              isOpen={isOpenDialog}
              closeModal={() => setIsOpenDialog(false)}
              setWalletInfo={setWalletInfo}/>
          </>
        )
      }
    </nav>
  );
};

export default Navbar;
