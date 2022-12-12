import getIsAuthTokensAvailable from '@lib/getIsAuthTokensAvailable';
import getToastOptions from '@lib/getToastOptions';
import resetAuthData from '@lib/resetAuthData';
import axios from 'axios';
import { IS_MAINNET, PRO_STATUS_API_URL } from 'data/constants';

import Head from 'next/head';
import { useTheme } from 'next-themes';
import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { CHAIN_ID } from 'data/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';

import Loading from '../Shared/Loading';
import Navbar from '../Shared/Navbar';

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setIsPro = useAppStore((state) => state.setIsPro);
  const profileId = useAppPersistStore((state) => state.profileId);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);

  const { address } = useAccount();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();

  const resetAuthState = () => {
    setProfileId(null);
    setCurrentProfile(null);
  };

  // Fetch current profiles and sig nonce owned by the wallet address
  // const { loading } = useUserProfilesQuery({
  //   variables: { ownedBy: address },
  //   skip: !profileId,
  //   onCompleted: (data) => {
  //     const profiles = data?.profiles?.items
  //       ?.slice()
  //       ?.sort((a, b) => Number(a.id) - Number(b.id))
  //       ?.sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));

  //     if (!profiles.length) {
  //       return resetAuthState();
  //     }

  //     const selectedUser = profiles.find((profile) => profile.id === profileId);
  //     const totalFollowing = selectedUser?.stats?.totalFollowing || 0;
  //     setSelectedReferenceModule(
  //       totalFollowing > 20
  //         ? ReferenceModules.DegreesOfSeparationReferenceModule
  //         : ReferenceModules.FollowerOnlyReferenceModule
  //     );
  //     setProfiles(profiles as Profile[]);
  //     setCurrentProfile(selectedUser as Profile);
  //     setProfileId(selectedUser?.id);
  //     setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce);
  //   },
  //   onError: () => {
  //     setProfileId(null);
  //   }
  // });

  const validateAuthentication = () => {
    const currentProfileAddress = currentProfile?.ownedBy;
    const isSwitchedAccount = currentProfileAddress !== undefined && currentProfileAddress !== address;
    const isWrongNetworkChain = chain?.id !== CHAIN_ID;
    const shouldLogout = !getIsAuthTokensAvailable() || isWrongNetworkChain || isSwitchedAccount;

    // If there are no auth data, clear and logout
    if (shouldLogout && profileId) {
      // disconnectXmtp();
      resetAuthState();
      resetAuthData();
      disconnect?.();
    }
  };

  useEffect(() => {
    validateAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, chain, disconnect, profileId]);

  // set pro status
  useEffect(() => {
    if (currentProfile?.id && currentProfile?.id === '0x0d') {
      if (IS_MAINNET) {
        axios(`${PRO_STATUS_API_URL}/user/${currentProfile?.id}`)
          .then(({ data }) => setIsPro(data.isPro))
          .catch(() => setIsPro(false));
      } else {
        setIsPro(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile?.id]);

  // if (loading) {
  //   return <Loading />;
  // }

  return (
    <>
      <Head>
        <meta name="theme-color" content={resolvedTheme === 'dark' ? '#1b1b1d' : '#ffffff'} />
      </Head>
      <Toaster position="bottom-right" toastOptions={getToastOptions(resolvedTheme)} />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {children}
      </div>
    </>
  );
};

export default Layout;
