import { StreamCall, StreamTheme, useCalls } from '@stream-io/video-react-sdk';

import CallModalUI from './CallModalUI';

export const Video = () => {
  const calls = useCalls();
  return (
    <>
      {calls.map((call) => (
        <StreamCall call={call} key={call.cid}>
          <div className="z-[9999] fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-[#0009]">
            <div className="relative bg-[#212121] inline-flex flex-col w-full min-w-[17.5rem] my-8 mx-auto max-w-[26.25rem] max-h-[min(40rem,_100vh)] min-h-[min(80vh,_40rem)] shadow-[0_.25rem_.5rem_.125rem_var(--color-default-shadow)] rounded-2xl">
              <StreamTheme className="tg-call flex grow w-full min-h-full overflow-y-auto max-h-[92vh] custom-scroll">
                <div className="max-w-[26.25rem] w-full">
                  <div className="flex flex-col h-full overflow-y-scroll overflow-x-hidden relative custom-scroll pl-3.5 pb-3.5 pt-1.5">
                    <CallModalUI />
                  </div>
                </div>
              </StreamTheme>
            </div>
          </div>
        </StreamCall>
      ))}
    </>
  );
};
