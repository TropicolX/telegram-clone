interface SpinnerProps {
  color?: string;
  strokeWidth?: number;
}

const Spinner = ({ color = '#fff', strokeWidth = 5 }: SpinnerProps) => {
  return (
    <svg
      className="absolute animate-rotate w-full h-full origin-center"
      viewBox="25 25 50 50"
    >
      <circle
        className="animate-dash"
        cx="50"
        cy="50"
        r="20"
        fill="transparent"
        stroke={color}
        strokeMiterlimit="10"
        strokeDasharray={'10, 200'}
        strokeDashoffset="0"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default Spinner;
