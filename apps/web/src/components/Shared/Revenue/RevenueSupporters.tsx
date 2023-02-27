import RevenueSupporterItem from '@components/Shared/Revenue/RevenueSupporterItem';

export type links = {
  title: string;
  href: string;
};

export type SupportersData = {
  userAddress: string;
  handle: string;
  description: string;
  paidAmountUsd: number;
  profileId: number;
  link: string;
};

export type RevenueSupportersProps = {
  data: SupportersData[];
  handleData: any[];
}

const getCurrentHandle = (handle, handleList) => {
  /*let items = data.filter((item, index)=>{
    item.handle == handle;
  });*/
  let currentHandleData = null;
  for(let item of handleList){
    if(item.handle == handle){
      return item;
    }
  }
  return {};
};


export default ({ data, handleData }: RevenueSupportersProps) => {//console.log(data,handleData);
  return (
    <div className="mt-8 mb-8">
      <h1 className="text-2xl font-bold mt-12">Top 50 Supporters</h1>
      <div className="md:px-4 xl:px-4 mt-2">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="border border-gray-300 bg-gray-200 capitalize">
              <th className="text-left font-normal w-2/12 pl-4 py-2">Name</th>
              <th className="hidden md:table-cell xl:table-cell text-left font-normal w-5/12">Description</th>
              <th className="text-left font-normal w-2/12">Amount</th>
              <th className="text-left font-normal w-3/12">Links</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((item, i) => (
              <>
              <RevenueSupporterItem item={item} profile={getCurrentHandle(item.handle, handleData)} key={`supporterItem${i}`}/>
              </>
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
