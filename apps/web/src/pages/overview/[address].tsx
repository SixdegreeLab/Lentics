import {
  getSession,
  GetSessionParams
} from 'next-auth/react';

import { gql } from '@apollo/client';
import Navbar from '@components/Shared/Navbar';
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

export async function getServerSideProps(context: GetSessionParams | undefined) {
  const authSession = await getSession(context);
  const { data } = await client.query({
    query: SummaryQuery,
    variables: { "address": "0x0e0f0C0976806D470F69d7A3855612C861863576" },
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
    },
  }
}

export default function Web({ data, initSession }) {
  // Render data...data.Summary30Days.contentCountPrevious
  console.log(data);
  return (
      <div className="page_content">
        <Navbar initSession={initSession}/>
        <div className="container px-5 pb-5">
          <div className="mt-12">
            <div className="flex leading-9 space-x-2 mb-8">
              <h4 className="inline text-3xl font-bold">30 days summary</h4>
              <span>with change over previous period</span>
            </div>
            <div className="flex overview-summary">
              <div className="overview-summary-item-container">
                <div className="overview-summary-item">
                  Engagement { data.Summary30Days &&  data.Summary30Days.engagementScoreCurrent }
                  / Prev { data.Summary30Days &&  data.Summary30Days.engagementScorePrevious }
                </div>
              </div>
              <div className="overview-summary-item-container">
                <div className="overview-summary-item">
                  Publication { data.Summary30Days &&  data.Summary30Days.publicationCountCurrent }
                  / Prev { data.Summary30Days &&  data.Summary30Days.publicationCountPrevious }
                </div>
              </div>
              <div className="overview-summary-item-container">
                <div className="overview-summary-item">
                  Followers { data.Summary30Days &&  data.Summary30Days.followerCountCurrent }
                  / Prev { data.Summary30Days &&  data.Summary30Days.followerCountPrevious }
                </div>
              </div>
              <div className="overview-summary-item-container">
                <div className="overview-summary-item">
                  Collect { data.Summary30Days &&  data.Summary30Days.collectedCountCurrent }
                  / Prev { data.Summary30Days &&  data.Summary30Days.collectedCountPrevious }
                </div>
              </div>
              <div className="overview-summary-item-container">
                <div className="overview-summary-item">
                  Reveune { data.Summary30Days &&  data.Summary30Days.contentCountCurrent }
                  / Prev { data.Summary30Days &&  data.Summary30Days.contentCountPrevious }
                </div>
              </div>
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
