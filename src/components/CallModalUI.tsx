import { useMemo } from 'react';
import {
  CallingState,
  CancelCallButton,
  hasScreenShare,
  isPinned,
  PaginatedGridLayout,
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

type CallModalUIProps = {
  onClose: () => void;
};

const CallModalUI = ({ onClose }: CallModalUIProps) => {
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

  const buttonsDisabled = callingState === CallingState.JOINING;

  const joinCall = () => {
    call?.join();
  };

  const endCall = () => {
    if (customData.isDMChannel) {
      call?.endCall();
    } else {
      call?.leave({
        reject: true,
      });
    }
  };

  if (!call) return null;

  if (callingState === CallingState.JOINED) {
    return (
      <>
        <div className="top-0 absolute pt-1.5 w-[calc(100%-24px)] z-20 h-[64px] bg-[#212121] flex items-center pb-3.5 select-none text-white">
          <div className="[&>button]:text-white [&>button]:w-[2.75rem] [&>button]:h-[2.75rem]">
            <RippleButton icon="fullscreen" />
          </div>
          <div className="flex flex-col justify-center overflow-hidden ml-[1.375rem]">
            <h3 className="text-[1rem] font-medium truncate whitespace-pre leading-[1.375rem]">
              {customData.channelName}
            </h3>
            {!customData.isDMChannel && (
              <span className="inline-block truncate text-color-text-secondary text-sm leading-[1.125rem]">
                {participantCount} participant{participantCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div
            onClick={onClose}
            className="ml-auto [&>button]:text-white [&>button]:w-[2.75rem] [&>button]:h-[2.75rem]"
          >
            <RippleButton icon="close" />
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
        <div className="bottom-0 absolute pt-2 w-[calc(100%-24px)] z-20 h-[64px] bg-[#212121] self-end flex items-center justify-center mt-auto mb-4 gap-4">
          <ScreenShareButton />
          <SpeakingWhileMutedNotification>
            <ToggleAudioPublishingButton />
          </SpeakingWhileMutedNotification>
          <ToggleVideoPublishingButton />
          <CancelCallButton onClick={endCall} />
        </div>
      </>
    );
  } else if (
    [CallingState.RINGING, CallingState.JOINING, CallingState.IDLE].includes(
      callingState
    )
  ) {
    return (
      <div className="absolute px-3.5 py-1.5 top-0 left-0 flex flex-col w-full h-full bg-ringing-gradient rounded-xl overflow-hidden border border-[#797c814d]">
        <div className="flex items-center select-none text-white">
          <div className="[&>button]:text-white [&>button]:w-[2.75rem] [&>button]:h-[2.75rem]">
            <RippleButton icon="fullscreen" />
          </div>
          <div
            onClick={onClose}
            className="ml-auto [&>button]:text-white [&>button]:w-[2.75rem] [&>button]:h-[2.75rem]"
          >
            <RippleButton icon="close" />
          </div>
        </div>
        <div className="flex flex-col mt-20 text-white items-center justify-center overflow-hidden">
          <h1 className="text-3xl font-medium truncate whitespace-pre">
            {customData.channelName}
          </h1>
          <span className="mt-1">
            {callingState === CallingState.RINGING && !call.isCreatedByMe
              ? 'ringing...'
              : 'waiting...'}
          </span>
        </div>
        <div className="mt-auto mb-4 w-full flex items-center justify-center gap-4">
          {callingState === CallingState.RINGING && !call.isCreatedByMe && (
            <button
              onClick={joinCall}
              disabled={buttonsDisabled}
              className="w-[56px] h-[56px] flex items-center justify-center rounded-full border border-[#5cc85e] bg-[#5cc85e] text-[24px] text-white"
            >
              <i className="icon icon-phone-discard rotate-[-135deg]" />
            </button>
          )}
          <button
            onClick={endCall}
            disabled={buttonsDisabled}
            className="w-[56px] h-[56px] flex items-center justify-center text-[24px] rounded-full border border-[#ff595a] bg-[#ff595a] text-[white]"
          >
            <i className="icon icon-phone-discard" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default CallModalUI;
