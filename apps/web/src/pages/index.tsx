import { gql } from '@apollo/client';
import { apiQuery } from 'src/apollo';
import Navbar from '@components/Shared/Navbar';
import { getSession, GetSessionParams } from "next-auth/react";
import Link from 'next/link';
import { DEMO_USER_ADDRESS } from 'data/constants';
import SignInDialog from '@components/Shared/Navbar/signin';
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import IconSpin from '@components/Shared/Spin';
import { ProfileQuery } from '@lib/apiGraphql';

export default function Web({ data }) {
  const defaultAvatar = '/icon2.png';
  const { address='' } = useAccount();
  const { data: session } = useSession();
  const sessionInfo = session ? {
    address: session.address,
    name: session.user.name??'',
    image: session.user.image??defaultAvatar,
    handle: session.user.handle ? `@${session.user.handle}` : '' } : null;
  const [walletInfo, setWalletInfo] = useState(sessionInfo);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const isInWhiteList = data.isInWhiteList;
  const [otherAddress, setOtherAddress] = useState('');
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (session) {
      setWalletInfo({
        address,
        name: session.user.name??'',
        image: session.user.image??defaultAvatar,
        handle: session.user.handle? `@${session.user.handle}` : ''
      });
    }
  }, [session])
  
  const handleConnectWallet = (e: any) => {
    e.preventDefault();
    setIsOpenDialog(true);
  }

  const handleSignClose = () => {
    setIsOpenDialog(false);
  }

  const handleOtherView = () => {
    if (otherAddress != '') {
      setClicked(true);
      location.href = `/overview/${otherAddress}`;
    } else {
      toast.error("Please enter the wallet address...");
    }
  }

  return (
    <div className="page_content">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-8 mt-5">
          <h2 className="mt-6 text-center text-4xl font-bold tracking-tight text-gray-900">
            Analyze Your Lens Data
          </h2>
          <p className="mt-2 text-center text-base text-gray-600">
            Analyze your Lens Protocal data to understand your impact, publication, revenue. Every word, photo, video, and follower can have an impact.
          </p>
          <div className="pt-11 text-center text-sm">
            {
              walletInfo && (
                <Link className="w-full py-1" href={`/overview/${walletInfo.address}`}>
                  <button className="mt-2 justify-center rounded border border-transparent bg-[#5CC87EFF] px-4 py-2 text-sm font-medium text-white hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                    View Self
                  </button>
                </Link>
              )
            }
            {
              !walletInfo && (
                <>
                  <button className="mt-2 justify-center rounded border border-transparent bg-[#5CC87EFF] px-4 py-2 text-sm font-medium text-white hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" onClick={handleConnectWallet}>
                    Connect Wallet
                  </button>
                  <SignInDialog
                    isOpen={isOpenDialog}
                    closeModal={handleSignClose}
                    setWalletInfo={() => { location.reload(); }}/>
                </>
              )
            }

            <span className="mx-5">Or</span>
            <Link className="w-full py-1" href={`/overview/${DEMO_USER_ADDRESS}`}>
              <button className="mt-2 justify-center rounded border border-transparent bg-[#9095A1FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#565D6DFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                View Demo
              </button>
            </Link>
          </div>
          {
            walletInfo && isInWhiteList && (
              <div className="pt-3 text-center text-sm">
                <div className="divider"></div>
                <div className="flex items-center justify-between mt-7">
                  <div>
                    <input
                      id="wallet-address"
                      name="wallet-address"
                      type="input"
                      className="lg:w-96 rounded border border-gray-300 px-3 py-2 mt-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Wallet address or handle"
                      onInput={(e: any)=>{setOtherAddress(e.target.value)}}
                    />
                  </div>
                  <button className="flex w-28 mt-2 justify-center rounded border border-transparent bg-[#9095A1FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#565D6DFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" onClick={handleOtherView}>
                    { clicked ? <IconSpin className="w-4 h-4" /> : `View Other` }
                  </button>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetSessionParams | undefined) {
  const authSession = await getSession(context);
  const { data } = await apiQuery({
    query: ProfileQuery,
    variables: { "address": authSession ? authSession.address : "" },
  });

  return {
    props: {
      pageTitle: 'Lentics',
      data: data.Profile,
    },
  }
}