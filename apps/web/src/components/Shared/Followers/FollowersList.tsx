
//import UserAvatar from '@components/Shared/Revenue/UserAvatar';


export type FollowersListProps = {
  data: any[];
}


export default ({ data }: FollowersListProps) => {
  return (
    <div className="mt-8 mb-8">
      <h1 className="text-2xl font-bold mt-12">Last Followers</h1>
      <div className="md:pl-4 xl:pl-4 mt-2">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="border border-gray-300 bg-gray-200 uppercase">
              <th className="text-left font-normal w-2/12 pl-4 py-2">Name</th>
              <th className="text-left font-normal w-2/12">Handle</th>
              <th className="hidden md:table-cell xl:table-cell text-left font-normal w-2/12">Total Followers</th>
              <th className="hidden md:table-cell xl:table-cell text-left font-normal w-2/12">Total Following</th>
              <th className="hidden md:table-cell xl:table-cell text-left font-normal w-4/12">Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr className="border border-gray-300" key={i}>
                <td className="pl-4 py-2">
                  {item.name?? item.handle}
                </td>
                <td><a className="link" href={`https://lenster.xyz/u/${item.handle}`} target="_blank">{item.handle}</a></td>
                <td className="hidden md:table-cell xl:table-cell">{item.stats?.totalFollowers}</td>
                <td className="hidden md:table-cell xl:table-cell">{item.stats?.totalFollowing}</td>
                <td className="hidden md:table-cell xl:table-cell">{item.bio}</td>
              </tr>
            ))}
            {
              (!data.length) && (
                <tr>
                  <td colSpan={5} className="italic font-light text-center py-6">
                    No Data!
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
