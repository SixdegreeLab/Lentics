import {
  getSession,
  GetSessionParams
} from 'next-auth/react';

import { gql } from '@apollo/client';
import Navbar from '@components/Shared/Navbar';
import SummaryCard from '@components/Shared/SummaryCard';
import {
  ArrowsRightLeftIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  ViewColumnsIcon
} from '@heroicons/react/24/outline';

import client from '../../apollo';

const SummaryQuery = gql`
  query SummaryQuery($address: String!) {
    Summary30Days(address: $address) {
      profileId
      contentCountCurrent
      contentCountPrevious
      contentCountChange
      contentCountChangePercentage
      engagementScoreCurrent
      engagementScorePrevious
      engagementScoreChangeValue
      engagementScoreChangePercentage
      publicationCountCurrent
      publicationCountPrevious
      publicationCountChange
      publicationCountChangePercentage
      followerCountCurrent
      followerCountPrevious
      followerCountChange
      followerCountChangePercentage
      commentedCountCurrent
      commentedCountPrevious
      commentedCountChange
      commentedCountChangePercentage
      mirroredCountCurrent
      mirroredCountPrevious
      mirroredCountChange
      mirroredCountChangePercentage
      collectedCountCurrent
      collectedCountPrevious
      collectedCountChange
      collectedCountChangePercentage
    }
  }
`

const DailyChangeQuery = gql`query DailyChange($address: String!) {
  DailyChange(address: $address) {
    profileId
    blockDate
    contentCountChange
    engagementScoreChange
    publicationCountChange
    followerCountChange
    commentedCountChange
    mirroredCountChange
    collectedCountChange
  }
}
`


export async function getServerSideProps(context: GetSessionParams | undefined) {
  // 测试address
  // 0xed74c2cdFa90CF3C824cc427a103065651e46d89
  // 0x713A95B5923FAEe8Dc32593Ff9c0A30a3818D978
  // 0xBAD8ca0d3Ef9e2b9D2A3149b707a879eBeA2a0BD
  // 0x84080288433CeC65AF0fC29978b95EC9ed477da0
  const authSession = await getSession(context);
  const { data } = await client.query({
    query: SummaryQuery,
    variables: { "address": context.params.address },
    context: {
      headers: {
        Authorization: authSession ? authSession.address : ""
      }
    },
  });

  const { data: dailyChanges } = await client.query({
    query: DailyChangeQuery,
    variables: { "address": context.params.address },
    context: {
      headers: {
        Authorization: authSession ? authSession.address : ""
      }
    },
  });

  return {
    props: {
      data,
      initSession: authSession,
      dailyChanges: dailyChanges.DailyChange,
    },
  }
}

export default function Web({ data, initSession, dailyChanges }) {
  // Render data...data.Summary30Days.contentCountPrevious
  console.log(data);
  console.log(dailyChanges);
  return (
      <div className="page_content">
        <Navbar initSession={initSession}/>
        <div className="container px-5 pb-5">
          <div className="mt-12">
            <div className="flex leading-9 space-x-2 mb-8">
              <h4 className="inline text-3xl font-bold">30 days summary</h4>
              <span className="text-gray-500">with change over previous period</span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
              <SummaryCard
                title="Engagement"
                count={data.Summary30Days?.engagementScoreCurrent || 0}
                data={(dailyChanges||[]).map((d) => ({ date: Date.parse(d.blockDate), value: d.engagementScoreChange }))}
                changePercent={(data.Summary30Days?.engagementScoreChangePercentage || 0)}
              />
              <SummaryCard
                title="Publication"
                count={data.Summary30Days?.publicationCountCurrent || 0}
                data={(dailyChanges||[]).map((d) => ({ date: Date.parse(d.blockDate), value: d.publicationCountChange }))}
                changePercent={(data.Summary30Days?.publicationCountChangePercentage || 0)}
                bgClass="bg-amber-50"
                linearColor="#fbbf24"
              />
              <SummaryCard
                title="Followers"
                count={data.Summary30Days?.followerCountCurrent || 0}
                data={(dailyChanges||[]).map((d) => ({ date: Date.parse(d.blockDate), value: d.followerCountChange }))}
                changePercent={(data.Summary30Days?.followerCountChangePercentage || 0)}
                bgClass="bg-green-50"
                linearColor="#4ade80"
              />
              <SummaryCard
                title="Collect"
                count={data.Summary30Days?.collectedCountCurrent || 0}
                data={(dailyChanges||[]).map((d) => ({ date: Date.parse(d.blockDate), value: d.collectedCountChange }))}
                changePercent={(data.Summary30Days?.collectedCountChangePercentage || 0)}
                bgClass="bg-red-50"
                linearColor="#fca5a5"
              />
              <SummaryCard
                title="Reveune"
                count={data.Summary30Days?.contentCountCurrent || 0}
                data={(dailyChanges||[]).map((d) => ({ date: Date.parse(d.blockDate), value: d.contentCountChange }))}
                changePercent={(data.Summary30Days?.contentCountChangePercentage || 0)}
                bgClass="bg-violet-50"
                linearColor="#c4b5fd"
              />
            </div>
          </div>
          <div className="mt-12">
            <div className="flex leading-9 space-x-2 mb-8 border-b-4 border-green-400">
              <h4 className="inline text-2xl font-bold">Dec 2022</h4>
              <span>.10 days so far...</span>
            </div>
            <div className="flex overview-summary-month">
              <div className="overview-summary-month-item-container">
                <div className="overview-summary-month-item">
                  <h6>Engagements</h6>
                  <div>502</div>
                </div>
              </div>
              <div className="overview-summary-month-item-container">
                <div className="overview-summary-month-item">
                  <h6>Publications</h6>
                  <div>502</div>
                </div>
              </div>
              <div className="overview-summary-month-item-container">
                <div className="overview-summary-month-item">
                  <h6>New Followers</h6>
                  <div>502</div>
                </div>
              </div>
              <div className="overview-summary-month-item-container">
                <div className="overview-summary-month-item">
                  <h6>Collects</h6>
                  <div>502</div>
                </div>
              </div>
              <div className="overview-summary-month-item-container">
                <div className="overview-summary-month-item">
                  <h6>Revenue</h6>
                  <div>502</div>
                </div>
              </div>
            </div>
            <div className="flex overview-summary-top">
              <div className="overview-summary-top-container">
                <div className="overview-summary-top-item">
                  <div className="flex title space-x-2 leading-9">
                    <h5>Top post</h5>
                    <span>with xxx emgagements</span>
                  </div>
                  <div className="details">
                    details
                  </div>
                  <div className="post-bottom flex font-black py-4">
                    <div className="flex-auto space-x-2 text-center text-blue-600">
                      <ChatBubbleLeftRightIcon className="inline w-6 h-6"/>
                      <span>50</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center text-purple-600">
                      <ArrowsRightLeftIcon className="inline w-6 h-6"/>
                      <span>248</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center text-pink-600">
                      <StarIcon className="inline w-6 h-6"/>
                      <span>436</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center text-red-600">
                      <ViewColumnsIcon className="inline w-6 h-6"/>
                      <span>800</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overview-summary-top-container">
                <div className="overview-summary-top-item">
                  <div className="flex title space-x-2 leading-9">
                    <h5>Top Followers</h5>
                  </div>
                  <div className="details">
                    details
                  </div>
                  <div className="follower-bottom flex font-medium py-4">
                    <div className="flex-auto space-x-2 text-center bg-green-200 mx-8 py-1">
                      <img className="w-8 h-8 inline" style={{width: 'auto', height: '24px'}} src='/icon.svg' alt="icon" />
                      <span>Lenster</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center bg-green-200 mx-8 py-1">
                      <img className="w-8 h-8 inline" style={{width: 'auto', height: '24px'}} src='/icon2.png' alt="icon" />
                      <span>Lenstube</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center bg-green-200 mx-8 py-1">
                      <img className="w-8 h-8 inline" style={{width: 'auto', height: '24px'}} src='/icon3.png' alt="icon" />
                      <span>Twitter</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overview-summary-top-container">
                <div className="overview-summary-top-item">
                  <div className="flex title space-x-2 leading-9">
                    <h5>Top media post</h5>
                    <span>with xxx emgagements</span>
                  </div>
                  <div className="details flex">
                    <div className="flex-auto pr-4">
                      <img className="inline" style={{width: 'auto', maxHeight: '180px'}} src='/icon.svg' alt="icon" />
                    </div>
                    <div className="flex-auto overflow-hidden">
                      Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.
                      We enable teams to iterate quickly and develop, preview, and ship delightful user experiences. Vercel has zero-configuration support for 35+ frontend frameworks and integrates with your headless content, commerce, or database of choice.
                    </div>
                  </div>
                  <div className="post-bottom flex font-black py-4">
                    <div className="flex-auto space-x-2 text-center text-blue-600">
                      <ChatBubbleLeftRightIcon className="inline w-6 h-6"/>
                      <span>50</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center text-purple-600">
                      <ArrowsRightLeftIcon className="inline w-6 h-6"/>
                      <span>248</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center text-pink-600">
                      <StarIcon className="inline w-6 h-6"/>
                      <span>436</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center text-red-600">
                      <ViewColumnsIcon className="inline w-6 h-6"/>
                      <span>800</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overview-summary-top-container">
                <div className="overview-summary-top-item">
                  <div className="flex title space-x-2 leading-9">
                    <h5>Top mention</h5>
                    <span>with xxx emgagements</span>
                  </div>
                  <div className="details flex">
                    <div className="flex-auto pr-4">
                      <img className="inline" style={{width: 'auto', maxHeight: '180px'}} src='/icon.svg' alt="icon" />
                    </div>
                    <div className="flex-auto overflow-hidden">
                      Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.
                      We enable teams to iterate quickly and develop, preview, and ship delightful user experiences. Vercel has zero-configuration support for 35+ frontend frameworks and integrates with your headless content, commerce, or database of choice.
                    </div>
                  </div>
                  <div className="post-bottom flex font-black py-4">
                    <div className="flex-auto space-x-2 text-center text-blue-600">
                      <ChatBubbleLeftRightIcon className="inline w-6 h-6"/>
                      <span>50</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center text-purple-600">
                      <ArrowsRightLeftIcon className="inline w-6 h-6"/>
                      <span>248</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center text-pink-600">
                      <StarIcon className="inline w-6 h-6"/>
                      <span>436</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center text-red-600">
                      <ViewColumnsIcon className="inline w-6 h-6"/>
                      <span>800</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <div className="flex leading-9 space-x-2 mb-8 border-b-4 border-green-400">
              <h4 className="inline text-2xl font-bold">Nov 2022</h4>
              <span>.30 days</span>
            </div>
            <div className="flex overview-summary-month">
              <div className="overview-summary-month-item-container">
                <div className="overview-summary-month-item">
                  <h6>Engagements</h6>
                  <div>502</div>
                </div>
              </div>
              <div className="overview-summary-month-item-container">
                <div className="overview-summary-month-item">
                  <h6>Publications</h6>
                  <div>502</div>
                </div>
              </div>
              <div className="overview-summary-month-item-container">
                <div className="overview-summary-month-item">
                  <h6>New Followers</h6>
                  <div>502</div>
                </div>
              </div>
              <div className="overview-summary-month-item-container">
                <div className="overview-summary-month-item">
                  <h6>Collects</h6>
                  <div>502</div>
                </div>
              </div>
              <div className="overview-summary-month-item-container">
                <div className="overview-summary-month-item">
                  <h6>Revenue</h6>
                  <div>502</div>
                </div>
              </div>
            </div>
            <div className="flex overview-summary-top">
              <div className="overview-summary-top-container">
                <div className="overview-summary-top-item">
                  <div className="flex title space-x-2 leading-9">
                    <h5>Top post</h5>
                    <span>with xxx emgagements</span>
                  </div>
                  <div className="details">
                    details
                  </div>
                  <div className="post-bottom flex font-black py-4">
                    <div className="flex-auto space-x-2 text-center text-blue-600">
                      <ChatBubbleLeftRightIcon className="inline w-6 h-6"/>
                      <span>50</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center text-purple-600">
                      <ArrowsRightLeftIcon className="inline w-6 h-6"/>
                      <span>248</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center text-pink-600">
                      <StarIcon className="inline w-6 h-6"/>
                      <span>436</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center text-red-600">
                      <ViewColumnsIcon className="inline w-6 h-6"/>
                      <span>800</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overview-summary-top-container">
                <div className="overview-summary-top-item">
                  <div className="flex title space-x-2 leading-9">
                    <h5>Top Followers</h5>
                  </div>
                  <div className="details">
                    details
                  </div>
                  <div className="follower-bottom flex font-medium py-4">
                    <div className="flex-auto space-x-2 text-center bg-green-200 mx-8 py-1">
                      <img className="w-8 h-8 inline" style={{width: 'auto', height: '24px'}} src='/icon.svg' alt="icon" />
                      <span>Lenster</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center bg-green-200 mx-8 py-1">
                      <img className="w-8 h-8 inline" style={{width: 'auto', height: '24px'}} src='/icon2.png' alt="icon" />
                      <span>Lenstube</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center bg-green-200 mx-8 py-1">
                      <img className="w-8 h-8 inline" style={{width: 'auto', height: '24px'}} src='/icon3.png' alt="icon" />
                      <span>Twitter</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overview-summary-top-container">
                <div className="overview-summary-top-item">
                  <div className="flex title space-x-2 leading-9">
                    <h5>Top media post</h5>
                    <span>with xxx emgagements</span>
                  </div>
                  <div className="details flex">
                    <div className="flex-auto pr-4">
                      <img className="inline" style={{width: 'auto', maxHeight: '180px'}} src='/icon.svg' alt="icon" />
                    </div>
                    <div className="flex-auto overflow-hidden">
                      Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.
                      We enable teams to iterate quickly and develop, preview, and ship delightful user experiences. Vercel has zero-configuration support for 35+ frontend frameworks and integrates with your headless content, commerce, or database of choice.
                    </div>
                  </div>
                  <div className="post-bottom flex font-black py-4">
                    <div className="flex-auto space-x-2 text-center text-blue-600">
                      <ChatBubbleLeftRightIcon className="inline w-6 h-6"/>
                      <span>50</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center text-purple-600">
                      <ArrowsRightLeftIcon className="inline w-6 h-6"/>
                      <span>248</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center text-pink-600">
                      <StarIcon className="inline w-6 h-6"/>
                      <span>436</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center text-red-600">
                      <ViewColumnsIcon className="inline w-6 h-6"/>
                      <span>800</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overview-summary-top-container">
                <div className="overview-summary-top-item">
                  <div className="flex title space-x-2 leading-9">
                    <h5>Top mention</h5>
                    <span>with xxx emgagements</span>
                  </div>
                  <div className="details flex">
                    <div className="flex-auto pr-4">
                      <img className="inline" style={{width: 'auto', maxHeight: '180px'}} src='/icon.svg' alt="icon" />
                    </div>
                    <div className="flex-auto overflow-hidden">
                      Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.
                      We enable teams to iterate quickly and develop, preview, and ship delightful user experiences. Vercel has zero-configuration support for 35+ frontend frameworks and integrates with your headless content, commerce, or database of choice.
                    </div>
                  </div>
                  <div className="post-bottom flex font-black py-4">
                    <div className="flex-auto space-x-2 text-center text-blue-600">
                      <ChatBubbleLeftRightIcon className="inline w-6 h-6"/>
                      <span>50</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center text-purple-600">
                      <ArrowsRightLeftIcon className="inline w-6 h-6"/>
                      <span>248</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center text-pink-600">
                      <StarIcon className="inline w-6 h-6"/>
                      <span>436</span>
                    </div>
                    <div className="flex-auto space-x-2 text-center text-red-600">
                      <ViewColumnsIcon className="inline w-6 h-6"/>
                      <span>800</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
