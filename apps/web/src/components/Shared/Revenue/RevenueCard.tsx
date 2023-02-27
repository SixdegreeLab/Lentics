
import { CurrencyDollarIcon, UsersIcon, DocumentTextIcon, QueueListIcon} from '@heroicons/react/24/solid';


export type RevenueCardProps = {
  title: string;
  count: number | string;
  icon: string;
  cardCollor?: string;
}

export default ({ title,
                  count,
                  icon,
                  cardCollor='yellow' }: RevenueCardProps) => {
  const colorVariants = {
    green: {
      border: 'border-green-300',
      bg50: 'bg-green-50',
      bg600: 'bg-green-600',
      text: 'text-green-600'
    },
    red: {
      border: 'border-red-300',
      bg50: 'bg-red-50',
      bg600: 'bg-red-600',
      text: 'text-red-600'
    },
    yellow: {
      border: 'border-yellow-300',
      bg50: 'bg-yellow-50',
      bg600: 'bg-yellow-600',
      text: 'text-yellow-600'
    },
  }
  return (
    <div className={`border rounded-lg ${colorVariants[cardCollor].bg50} p-3 ${colorVariants[cardCollor].border}`}>
      <div className="text-md font-bold">{title}</div>
      <div className="flex h-24">
        <div className=" w-[60px] h-full font-bold text-2xl overflow-hidden break-all leading-9 pt-6">
          <div className={`text-center rounded-xl text-white w-[40px] h-[40px] ${colorVariants[cardCollor].bg600}`}>
          {icon === 'currency' && (<CurrencyDollarIcon className="inline w-5 h-5" />)}
          {icon === 'users' && (<UsersIcon className="inline w-5 h-5" />)}
          {icon === 'engagement' && (<DocumentTextIcon className="inline w-5 h-5" />)}
          {icon === 'publication' && (<QueueListIcon className="inline w-5 h-5" />)}
          </div>
        </div>
        <div className={`w-2/3 h-full pt-7 font-black text-2xl ${colorVariants[cardCollor].text}`}>
          { count ?? 0 }
        </div>
      </div>
    </div>
  )
}
