
export type PublicationsData = {
  pubId: string;
  publicationId: string;
  profileId: string;
  supporterCount: number;
  paidAmountUsd: number;
};

export type RevenuePublicationsDataProps = {
  data: any[];
}

export default ({ data }: RevenuePublicationsDataProps) => {
  return (
    <div className="mt-8 mb-8">
      <h1 className="text-2xl font-bold mt-12">Top 50 Revnue Publications</h1>
      <div className="md:px-4 xl:px-4 mt-2">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="border border-gray-300 bg-gray-200 capitalize">
              <th className="text-left font-normal w-3/12 pl-4 py-2">Pub-ID</th>
              <th className="hidden md:table-cell xl:table-cell text-left font-normal w-4/12">Content</th>
              <th className="text-left font-normal w-2/12">Value</th>
              <th className="text-left font-normal w-3/12">Supporters</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((item, i) => (
              <tr className={i % 2 == 0 ? "" : "bg-gray-100"} key={i}>
                <td className="pl-4 py-2">
                  <a className="link" href={`https://lenster.xyz/posts/${item.publicationId}`} target="_blank">
                    <span className="leading-6">{item.publicationId}</span>
                  </a>
                </td>
                <td className="hidden md:table-cell xl:table-cell"><div className="max-h-[120px] m-2 overflow-ellipsis overflow-hidden">{item.content}</div></td>
                <td>{item.paidAmountUsd}</td>
                <td>{item.supporterCount}</td>
              </tr>
            ))}
            {
              (!data || !data.length) && (
                <tr>
                  <td colSpan={4} className="italic font-light text-center py-6">
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
