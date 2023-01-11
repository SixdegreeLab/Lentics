import NextAuth, { DefaultSession, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getCsrfToken } from "next-auth/react"
import { SiweMessage } from "siwe"
import { NEXTAUTH_URL, NEXTAUTH_SECRET, getIPFSLink, getAvatarFromLenster } from 'data/constants';
import { queryDefaultProfile } from 'lens';

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    address: string,
    user: {
      /** The user's postal address. */
      handle: string
    } & DefaultSession["user"]
  }
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: any, res: any) {
  const providers = [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials: any) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
          const nextAuthUrl = new URL(NEXTAUTH_URL)

          const result: any = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          })

          if (result.success) {
            const profile: any = await queryDefaultProfile(siwe.address);
            const { name, handle, picture } = profile.data.defaultProfile || {
              name: `${siwe.address.substring(0, 4)}...${siwe.address.substring(siwe.address.length - 4)}`,
              handle: '',
              picture: null
            };

            const image = picture
              ? getAvatarFromLenster(getIPFSLink(
                picture?.original?.url ??
                picture?.uri ??
                `https://avatar.tobi.sh/${profile?.ownedBy}_${profile?.handle}.png`
              ))
              : '';
            return {
              id: siwe.address,
              name,
              email: handle, // Field is fixed, use email to pass handle
              image: image
            }
          }
          return null
        } catch (e) {
          return null
        }
      },
    }),
  ]

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth.includes("signin")

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop()
  }

  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    session: {
      strategy: "jwt",
    },
    secret: NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }: { session: Session; token: any}) {
        session.address = token.sub
        session.user.handle = session?.user?.email ?? ''
        return session
      },
    },
  })
}
