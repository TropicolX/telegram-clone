import Appendix from './Appendix';
import Button from './Button';
import Spinner from './Spinner';

const ChatLoading = () => {
  return (
    <>
      <div className="custom-scroll flex-1 w-full mb-2 overflow-y-scroll overflow-x-hidden transition-[bottom,_transform] duration-[150ms,_300ms] ease-[ease-out,_cubic-bezier(0.33,1,0.68,1)] xl:transition-transform xl:duration-300 xl:ease-[cubic-bezier(0.33,1,0.68,1)] xl:translate-x-0 xl:translate-y-0">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-14 h-14 p-1 rounded-full bg-[#00000068]">
            <div className="relative w-12 h-12">
              <Spinner strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex items-end gap-2 z-10 mb-5 w-full xl:w-[calc(100%-25vw)] max-w-[45.5rem] px-4 transition-[top,_transform] duration-[200ms,_300ms] ease-[ease,_cubic-bezier(0.33,1,0.68,1)]">
        <div className="composer-wrapper relative z-[1] grow bg-background max-w-[calc(100%-4rem)] rounded-[var(--border-radius-messages)] rounded-br-none shadow-[0_1px_2px_var(--color-default-shadow)] transition-[transform,_border-bottom-right-radius] duration-200 ease-out">
          <Appendix position="right" />
          <div className="flex opacity-100 transition-opacity duration-200 ease-out">
            <div className="relative w-8 h-14 ml-3 flex items-center justify-center leading-[1.2] overflow-hidden transition-colors duration-150 uppercase rounded-full self-end shrink-0 text-color-composer-button">
              <i className="icon icon-smile" />
            </div>
            <div className="relative grow">
              <div className="custom-scroll mr-2 pr-1 min-h-14 max-h-[26rem] overflow-y-auto transition-[height] duration-100 ease-[ease]">
                <div className="pl-2 py-4"></div>
              </div>
            </div>
            <div className="self-end">
              <button className="relative w-14 h-14 ml-3 flex items-center justify-center leading-[1.2] overflow-hidden transition-colors duration-150 uppercase rounded-full self-end shrink-0 text-color-composer-button">
                <i className="icon icon-attach" />
              </button>
            </div>
          </div>
        </div>
        <Button className="text-primary" icon="send" />
      </div>
    </>
  );
};

export default ChatLoading;
