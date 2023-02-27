
import Image from 'next/image'
import type { FC } from 'react';
import { useState } from 'react';

export type UserAvatarProps = {
  avatar?: string
  width?: number
  height?: number
  altText?: string
}


const UserAvatar: FC<UserAvatarProps> = ({ avatar, width=100, height=100, altText='' }) => {
  const defaultAvatar = '/avatar.jpg'
  const [avatarSrc, setAvatarSrc] = useState<any>(avatar)
  
  const handleLoadingComplete = ({ naturalWidth=0 }) => {
    if (!naturalWidth) {
      setAvatarSrc(defaultAvatar)
    }
  }

  return (
    <Image src={avatarSrc}
      placeholder="blur"
      blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkkI39DwACGgF7lpEkjAAAAABJRU5ErkJggg=="
      width={width}
      height={height}
      onLoadingComplete={handleLoadingComplete}
      alt={altText}
      priority/>
  );
};

export default UserAvatar;
