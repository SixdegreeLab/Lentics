
export type CurrentViewingTextProps = {
  profileData: any;
}

export default ({ profileData }: CurrentViewingTextProps) => {
  let addressName = profileData?.profile?.owner ?
    `${profileData.profile.owner.substring(0, 4)}...${profileData.profile.owner.substring(profileData.profile.owner.length - 4)}`
    : '';
  return (
    profileData?.profile && (
      <div className="text-sm md:text-2xl xl:text-2xl font-bold mb-12">
        Current viewing: {profileData?.profile?.handle ? `@${profileData?.profile?.handle}` : ''} {`(${addressName})`}
      </div>
    )
  )
}
