
import SupporterLinks from '@components/Shared/Revenue/SupporterLinks';


export type RevenueSupporterItemProps = {
  item: any;
  profile: any;
}

export default ({ item, profile }: RevenueSupporterItemProps) => {
  return (
    <tr className="border border-gray-300">
      <td className="pl-4 py-2">
        <div className="flex-1 leading-tight md:leading-6 xl:leading-6">
          <a href={`https://lenster.xyz/u/${item.handle}`} target="_blank" className="link">{profile?.name ?? item.handle}</a><br/>
          <span className="text-sm">{item.handle}</span>
        </div>
      </td>
      <td className="hidden md:table-cell xl:table-cell"><div className="p-2">{profile?.bio?? ''}</div></td>
      <td>{item.paidAmountUsd}</td>
      <td>
        <SupporterLinks handle={item.handle} handlesData={profile} />
      </td>
    </tr>
  )
}
