import { useMemo } from 'react';
import {
  CallingState,
  CancelCallButton,
  hasScreenShare,
  isPinned,
  PaginatedGridLayout,
  RingingCall,
  ScreenShareButton,
  SpeakerLayout,
  SpeakingWhileMutedNotification,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import clsx from 'clsx';

import Avatar from './Avatar';
import RippleButton from './RippleButton';

const CallModalUI = () => {
  const call = useCall();
  const {
    useCallCallingState,
    useCallCustomData,
    useParticipants,
    useParticipantCount,
  } = useCallStateHooks();
  const { user } = useUser();
  const callingState = useCallCallingState();
  const customData = useCallCustomData();
  const participantCount = useParticipantCount();
  const participants = useParticipants();
  const [participantInSpotlight] = participants;
  const isSpeakerLayout = useMemo(() => {
    if (participantInSpotlight) {
      return (
        hasScreenShare(participantInSpotlight) ||
        isPinned(participantInSpotlight)
      );
    }
    return false;
  }, [participantInSpotlight]);

  if (!call) return null;

  if (callingState === CallingState.JOINED) {
    return (
      <>
        <div className="flex items-center pb-3.5 select-none text-white">
          <div className="[&>button]:text-white [&>button]:w-[2.75rem] [&>button]:h-[2.75rem]">
            <RippleButton icon="fullscreen" />
          </div>
          <div className="flex flex-col justify-center overflow-hidden ml-[1.375rem]">
            <h3 className="text-[1rem] font-medium truncate whitespace-pre leading-[1.375rem]">
              {customData.channelName}
            </h3>
            <span className="inline-block truncate text-color-text-secondary text-sm leading-[1.125rem]">
              {participantCount} participant{participantCount > 1 ? 's' : ''}
            </span>
          </div>
          <div className="ml-auto [&>button]:text-white [&>button]:w-[2.75rem] [&>button]:h-[2.75rem]">
            <RippleButton icon="add-user" />
          </div>
        </div>
        <div className="mx-2 my-[.125rem] me-[calc(.5rem-11px)]">
          <div className="w-full relative">
            {!isSpeakerLayout && <PaginatedGridLayout groupSize={4} />}
            {isSpeakerLayout && <SpeakerLayout participantsBarLimit={3} />}
          </div>
          <div className="w-full mt-2 pb-[6rem]">
            {participants.map((participant) => (
              <div key={participant.sessionId} className="relative w-full">
                <button className="w-full p-2 min-h-[3rem] flex items-center relative overflow-hidden whitespace-nowrap text-color-text rounded-xl hover:bg-[#ffffff0a]">
                  <div className="mr-2">
                    <Avatar
                      data={{
                        name: participant.name,
                        image: participant.image,
                      }}
                      width={54}
                    />
                  </div>
                  <div className="grow whitespace-[initial] overflow-hidden pt-[.4375rem] pb-[.5625rem]">
                    <div className="flex items-center truncate leading-[1.25rem] gap-2">
                      <h3 className="text-[1rem] font-medium text-white">
                        {participant.name}
                      </h3>
                    </div>
                    <span
                      className={clsx(
                        'flex leading-4 mt-1 text-start',
                        participant.isSpeaking
                          ? 'text-[#57bc6c]'
                          : 'text-primary'
                      )}
                    >
                      <span className="truncate">
                        {participant.isSpeaking
                          ? 'speaking'
                          : participant.userId === user?.id
                          ? 'this is you'
                          : 'listening'}
                      </span>
                    </span>
                  </div>
                  <div
                    className={clsx(
                      'w-7 h-7 ml-auto mr-1',
                      participant.isSpeaking
                        ? 'text-[#57bc6c]'
                        : 'text-color-text-secondary'
                    )}
                  >
                    <i
                      className={clsx(
                        'icon',
                        participant.isSpeaking
                          ? 'icon-microphone'
                          : 'icon-microphone-alt'
                      )}
                    />
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full self-end flex items-center justify-center mt-auto mb-4 gap-4">
          <ScreenShareButton />
          <SpeakingWhileMutedNotification>
            <ToggleAudioPublishingButton />
          </SpeakingWhileMutedNotification>
          <ToggleVideoPublishingButton />
          <CancelCallButton />
        </div>
      </>
    );
  } else if (
    [CallingState.RINGING, CallingState.JOINING].includes(callingState)
  ) {
    return (
      <div className="rmc__call-panel-wrapper">
        <RingingCall />
      </div>
    );
  }

  return null;
};

export default CallModalUI;
