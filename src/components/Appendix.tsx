import clsx from 'clsx';

interface AppendixProps {
  position?: 'left' | 'right';
  className?: string;
}

const Appendix = ({ className, position = 'left' }: AppendixProps) => {
  if (position === 'right')
    return (
      <svg width={9} height={20} className={clsx('svg-appendix', className)}>
        <defs>
          <filter
            x="-50%"
            y="-14.7%"
            width="200%"
            height="141.2%"
            filterUnits="objectBoundingBox"
            id="messageAppendix"
          >
            <feOffset dy={1} in="SourceAlpha" result="shadowOffsetOuter1" />
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
    );

  return (
    <svg width={9} height={20} className={clsx('svg-appendix', className)}>
      <defs>
        <filter
          x="-50%"
          y="-14.7%"
          width="200%"
          height="141.2%"
          filterUnits="objectBoundingBox"
          id="messageAppendix"
        >
          <feOffset dy={1} in="SourceAlpha" result="shadowOffsetOuter1" />
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
          d="M3 17h6V0c-.193 2.84-.876 5.767-2.05 8.782-.904 2.325-2.446 4.485-4.625 6.48A1 1 0 003 17z"
          fill="#000"
          filter="url(#messageAppendix)"
        />
        <path
          d="M3 17h6V0c-.193 2.84-.876 5.767-2.05 8.782-.904 2.325-2.446 4.485-4.625 6.48A1 1 0 003 17z"
          fill="FFF"
          className="corner"
        />
      </g>
    </svg>
  );
};

export default Appendix;
