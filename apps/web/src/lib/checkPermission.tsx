import { Session } from "next-auth"
import { DEMO_USER_ADDRESS } from 'data';
import { apiQuery } from '../apollo';
import { ProfileQuery } from '@lib/apiGraphql';


export type ApiProfile = {
  owner: string;
  handle: string;
}
export type ApiProfileAndPermission = {
  profile: ApiProfile | null;
  isInWhiteList: boolean;
}
export type GraphqlProfileAndPermission = {
  data: {
    Profile: ApiProfileAndPermission
  }
}

export const checkPermission = async (
  address: string,
  session: Session | null,
) => {

  const { data: sessionProfile }: GraphqlProfileAndPermission = await apiQuery({
    query: ProfileQuery,
    variables: { "address": session?.address ?? '' }
  });
  return (address === DEMO_USER_ADDRESS
    || (session?.address && session?.address === address)
    || sessionProfile?.Profile?.isInWhiteList);
};
