const Spinner = () => {
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
        stroke="#fff"
        strokeMiterlimit="10"
        strokeDasharray={'10, 200'}
        strokeDashoffset="0"
        strokeWidth={5}
      />
    </svg>
  );
};

export default Spinner;
