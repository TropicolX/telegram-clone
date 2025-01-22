import Avatar from '../components/Avatar';
import RippleButton from '../components/RippleButton';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="relative flex flex-col items-center w-full h-full overflow-hidden border-l border-solid border-l-color-borders">
        <div className="chat-background absolute top-0 left-0 w-full h-full -z-10 overflow-hidden bg-theme-background"></div>
        {/* Chat Header */}
        <div className="flex items-center w-full bg-background relative z-10 py-1 pl-[23px] pr-[13px] shrink-0 h-[3.5rem]">
          {/* Chat Info */}
          <div className="grow overflow-hidden">
            <div className="flex items-center cursor-pointer py-[.0625rem] pl-[.0625rem]">
              {/* Avatar */}
              <div className="w-10 h-10 mr-[.625rem] text-[1.0625rem]">
                <Avatar
                  data={{
                    name: 'John',
                    image:
                      'https://media1.tenor.com/m/xNta5C2WoDQAAAAd/eren-attack-on-titan.gif',
                  }}
                  width={40}
                />
              </div>
              {/* Info */}
              <div className="flex flex-col justify-center grow overflow-hidden">
                <div className="flex items-center gap-1">
                  <h3 className="text-[1.0625rem] font-semibold leading-[1.375rem] whitespace-pre overflow-hidden text-ellipsis">
                    Alexander
                  </h3>
                </div>
                <span className="inline text-sm leading-[1.125rem] text-color-text-secondary overflow-hidden truncate">
                  <span>last seen recently</span>
                </span>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="flex gap-1">
            <RippleButton icon="search" />
            <RippleButton icon="phone" />
            <RippleButton icon="more" />
          </div>
        </div>
        <div className="relative w-full h-full overflow-hidden">
          <div className="flex flex-col grow items-center w-full h-full">
            {/* Message list */}
            <div className="custom-scroll flex-1 w-full mb-2 overflow-y-scroll overflow-x-hidden transition-[bottom,_transform] duration-[150ms,_300ms] ease-[ease-out,_cubic-bezier(0.33,1,0.68,1)] xl:transition-transform xl:duration-300 xl:ease-[cubic-bezier(0.33,1,0.68,1)] xl:translate-x-0 xl:translate-y-0">
              <div className="flex flex-col justify-end mx-auto min-h-full w-full xl:w-[calc(100%-25vw)] max-w-[45.5rem] pt-4 pr-4 pl-[1.125rem]">
                {/* Message Group */}
                <div className="">
                  {/* Sticky date */}
                  <div className="sticky top-[.625rem] text-center select-none cursor-pointer my-4 z-[9] pointer-events-none opacity-100 transition-opacity duration-300 ease-[ease]">
                    <div className="relative inline-block bg-[#4A8E3A8C] text-white font-medium py-[.1875rem] px-2 rounded-full z-0 break-words">
                      May 27, 2024
                    </div>
                  </div>
                  {/* Messages */}
                  <div>
                    <div className="message own">
                      <div className="content-wrapper">
                        <div className="message-content relative max-w-[var(--max-width)] bg-[var(--background-color)] shadow-[0_1px_2px_var(--color-default-shadow)] p-[.3125rem_.5rem_.375rem] text-[15px]">
                          <div className="content-inner min-w-0">
                            <div className="break-words whitespace-pre-wrap leading-[1.3125] block rounded-[.25rem] relative overflow-clip">
                              Hi Ilia!{'\n'}Just following up on my last
                              message. Let me know when you have some time to
                              discuss.
                              <div className="relative top-[.375rem] bottom-auto right-0 flex items-center rounded-[.625rem] px-1 cursor-pointer select-none float-right leading-[1.35] h-[19px] ml-[.4375rem] mr-[-0.375rem] text-message-meta-own">
                                <div className="mr-1 text-[.75rem] whitespace-nowrap">
                                  16:02
                                </div>
                                <div className="w-[1.1875rem] h-[1.1875rem] overflow-hidden inline-block leading-[1] text-accent-own ml-[-0.1875rem] rounded-[.625rem] shrink-0">
                                  <i className="icon icon-message-succeeded pl-[.125rem] text-[1.1875rem]" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <svg width={9} height={20} className="svg-appendix">
                            <defs>
                              <filter
                                x="-50%"
                                y="-14.7%"
                                width="200%"
                                height="141.2%"
                                filterUnits="objectBoundingBox"
                                id="messageAppendix"
                              >
                                <feOffset
                                  dy={1}
                                  in="SourceAlpha"
                                  result="shadowOffsetOuter1"
                                />
                                <feGaussianBlur
                                  stdDeviation={1}
                                  in="shadowOffsetOuter1"
                                  result="shadowBlurOuter1"
                                />
                                <feColorMatrix
                                  values="0 0 0 0 0.0621962482 0 0 0 0 0.138574144 0 0 0 0 0.185037364 0 0 0 0.15 0"
                                  in="shadowBlurOuter1"
                                />
                              </filter>
                            </defs>
                            <g fill="none" fillRule="evenodd">
                              <path
                                d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z"
                                fill="#000"
                                filter="url(#messageAppendix)"
                              />
                              <path
                                d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z"
                                fill="#EEFFDE"
                                className="corner"
                              />
                            </g>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Middle column footer */}
            <div className="relative flex items-end z-10 w-full xl:w-[calc(100%-25vw)] max-w-[45.5rem] px-4 transition-[top,_transform] duration-[200ms,_300ms] ease-[ease,_cubic-bezier(0.33,1,0.68,1)]">
              {/* Input */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
