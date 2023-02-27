import { useState, Fragment } from 'react';
import { getCsrfToken, signIn } from "next-auth/react";
import { SiweMessage } from "siwe";
import { Transition, Dialog } from '@headlessui/react';
import Spin from '@components/Shared/Spin';
import { MixpanelTracking } from "@lib/mixpanel";

import {
  useAccount,
  useConnect,
  useDisconnect,
  chain,
  WagmiConfig,
  createClient,
  useSignMessage
} from 'wagmi';

const SignInDialog =(props: { isOpen: boolean, closeModal: any, setWalletInfo: any }) => {
  const {
    isOpen,
    closeModal,
    setWalletInfo
  } = props
  const { address, connector, isConnected } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector={id: 0} } = useConnect()
  const [isLogging, setIsLogging] = useState(false);
  const { signMessageAsync } = useSignMessage()

  const handleLogin = async () => {
    setIsLogging(true)
    try {
      const callbackUrl = "/profiles"
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        //chainId: chain?.id,
        nonce: await getCsrfToken(),
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })
      const { error } = await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      }) ?? {}
      if (error) {
        setIsLogging(false);
        setWalletInfo(null)
      }
      MixpanelTracking.getInstance().signIn({address});
    } catch (error) {
      console.error("catch: ", error);
      setIsLogging(false);
      setWalletInfo(null)
    }
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Connect your wallet
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Connect with one of our available wallet providers or create a new one.
                    </p>
                  </div>

                  {
                    isConnected && (
                      <button
                        className={`${isLogging ? 'cursor-not-allowed ' : ''}mt-2 flex justify-center rounded-md border border-transparent bg-green-400 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                        onClick={handleLogin}
                        disabled={isLogging}
                      >
                        {isLogging && <Spin />}
                        Sign-In with Lens
                      </button>
                    )
                  }

                  {
                    !isConnected && (
                      <div className="mt-4">
                        {connectors.map((connector) => (
                          <button
                            className="mt-2 flex justify-center rounded-md border border-transparent bg-green-400 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            disabled={!connector.ready}
                            key={connector.id}
                            onClick={() => connect({ connector })}
                          >
                            {connector.name}
                            {!connector.ready && ' (unsupported)'}
                            {isLoading &&
                            connector.id === pendingConnector.id &&
                            ' (connecting)'}
                          </button>
                        ))}

                        {error && <div className="text-red-600">{error.message}</div>}
                      </div>
                    )
                  }
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
};

export default SignInDialog;
