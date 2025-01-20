import Avatar from '../components/Avatar';
import RippleButton from '../components/RippleButton';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <div className="flex w-vw h-vh">
      <Sidebar />
      <div className="relative flex flex-col items-center w-full h-screen overflow-hidden border-l border-solid border-l-color-borders">
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
        <div className="flex flex-col grow items-center w-full h-full"></div>
      </div>
    </div>
  );
}
