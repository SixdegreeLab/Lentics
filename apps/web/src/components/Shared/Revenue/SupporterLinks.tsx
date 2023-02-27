
import getAttribute from '@lib/getAttribute';


export type SupporterLinksProps = {
  handle: string;
  handlesData: any;
}

const getHandleLinks = (handle, data) => {
  let currentHandleData = data;
  let links =  [{ bgColor:'bg-green-200', textColor:'text-green-600', name: 'Lenster', link: 'https://lenster.xyz/u/' + handle}];
  if(currentHandleData && currentHandleData.attributes){
    let link = getAttribute(currentHandleData.attributes, 'website');
    if(link){
      links.push({
        bgColor:'bg-gray-200', 
        textColor: 'text-gray-600',
        name: 'Website', 
        link: link
      });
    }
    link = getAttribute(currentHandleData.attributes, 'twitter');
    if(link){
      links.push({
        bgColor:'bg-orange-200', 
        textColor: 'text-orange-600',
        name: 'Twitter', 
        link: 'https://twitter.com/' + link
      });
    }
  }
  return links;
};

export default ({ handle, handlesData }: SupporterLinksProps) => {
  return (
    <>
      {getHandleLinks(handle, handlesData).map((linkItem, j) => (
        <a target="_blank" className={`rounded-xl ${linkItem.bgColor} ${linkItem.textColor} mr-0 md:mr-1 xl:mr-1 p-2 text-xs md:text-sm xl:text-sm`} href={linkItem.link} key={j}>{linkItem.name}</a>
      ))}
    </>
  )
}
