import { gql } from '@apollo/client';
import client from 'src/apollo';
import Navbar from '@components/Shared/Navbar';
import { getSession, GetSessionParams } from "next-auth/react";
import Link from 'next/link';
import { DEMO_USER_ADDRESS } from 'data/constants';
import SignInDialog from '@components/Shared/Navbar/signin';
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef, Fragment } from 'react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

const HOME_QUERY = gql`
  query getProfile($address: String!) {
    Profile(address: $address) {
      profile {
        profileId,
        owner
      }
      isInWhiteList
      whitelist
    }
  }
`

export default function Web({ data }) {
  const defaultAvatar = '/icon2.png';
  const { address } = useAccount();
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
      location.href = `/overview/${otherAddress}`;
    } else {
      toast.error("Please enter the wallet address...");
    }
  }

  return (
    <div className="page_content">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 mt-5">
          <h2 className="mt-6 text-center text-4xl font-bold tracking-tight text-gray-900">
            Analize Your Lens Data
          </h2>
          <p className="mt-2 text-center text-base text-gray-600">
            Analyze your Lens Protocal data to understand your impact, publication, revenue. Every word, photo, video, and follower can have an impact.
          </p>
          <div className="pt-11 text-center text-sm">
            {
              walletInfo && (
                <Link className="w-full py-1" href={`/overview/${walletInfo.address}`}>
                  <button className="mt-2 justify-center rounded-md border border-transparent bg-green-400 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                    View Self
                  </button>
                </Link>
              )
            }
            {
              !walletInfo && (
                <>
                  <button className="mt-2 justify-center rounded-md border border-transparent bg-green-400 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" onClick={handleConnectWallet}>
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
              <button className="mt-2 justify-center rounded-md border border-transparent bg-slate-400 px-4 py-2 text-sm font-medium text-white hover:bg-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
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
                      className="lg:w-80 rounded-md border border-gray-300 px-3 py-2 mt-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Wallet address"
                      onInput={(e)=>{setOtherAddress(e.target.value)}}
                    />
                  </div>
                  <button className="mt-2 justify-center rounded-md border border-transparent bg-slate-400 px-4 py-2 text-sm font-medium text-white hover:bg-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" onClick={handleOtherView}>
                    View Other
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
  const { data } = await client.query({
    query: HOME_QUERY,
    variables: { "address": authSession ? authSession.address : "" },
    // context: {
    //   headers: {
    //     Authorization: authSession ? authSession.address : ""
    //   }
    // },
  });

  return {
    props: {
      data: data.Profile,
      initSession: authSession,
    },
  }
}