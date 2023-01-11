import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState, useRef, Fragment } from 'react';
import { signOut, useSession } from "next-auth/react";
import { Menu, Transition } from '@headlessui/react';
import SignInDialog from '@components/Shared/Navbar/signin';
import MobileMenuItems from '@components/Shared/Navbar/mobilemenuitem';
import { DEMO_USER_ADDRESS } from 'data/constants';

import {
  useAccount,
  useConnect,
  useDisconnect,
  WagmiConfig,
  createClient,
  useSignMessage
} from 'wagmi';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export type NavbarProps = {
  addressName?: string
  addressHandle?: string
}


const Navbar: FC<NavbarProps> = ({ addressName='', addressHandle='' }) => {
  const router = useRouter();
  const defaultAvatar = '/icon2.png'
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
  const [isDisplayAvatar, setIsDisplayAvatar] = useState(false)
  const isIndexPage = router.pathname === '/'
  
  useEffect(() => {
    if (session) {
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
  
  const handleAvatarLoad = () => {
    setIsDisplayAvatar(true)
  }
  
  const handleAvatarError = () => {
    setIsDisplayAvatar(false)
  }

  const image = useRef<HTMLImageElement>(null)
  useEffect(() => {
    // Browser cache not trigger onload.
    if (image.current && image.current.complete) setIsDisplayAvatar(true)
  }, [])

  return (
    <nav className={`w-full flex items-center justify-between md:justify-end px-4 h-16 ${isIndexPage ? 'border-b-0' : 'border-b-2'} border-gray-300`}>
      {
        walletInfo ? (
          <>
            <div className="flex-grow space-x-2 hidden md:block">
              {
                isIndexPage && (<h3 className="inline text-3xl font-bold">Analytics</h3>)
              }
              {
                !isIndexPage && (<>
                  <h3 className="inline text-3xl font-bold">{addressName}</h3>
                  <span>{addressHandle}</span>
                </>)
              }
            </div>
            <MobileMenuItems />
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button as={Fragment}>
                  <div className="w-[50px] rounded-full overflow-hidden">
                    <img src={defaultAvatar} alt="default avatar" className={isDisplayAvatar ? 'hidden' : ''} />
                    <img
                      ref={image}
                      src={walletInfo.image}
                      alt="avatar"
                      onError={handleAvatarError}
                      onLoad={handleAvatarLoad}
                      className={!isDisplayAvatar ? 'hidden' : ''} />
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
            <div className="hidden md:flex-grow space-x-2">
              {
                isIndexPage && (<h3 className="inline text-3xl font-bold">Analytics</h3>)
              }
            </div>
            <MobileMenuItems />
            <button className="mt-2 flex justify-center rounded border border-transparent bg-[#5CC87EFF] px-4 py-2 text-sm font-medium text-white hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" onClick={handleConnectWallet}>
              Connect Wallet
            </button>
            <SignInDialog
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
