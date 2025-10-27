const MessengerIcon = ({
  width = "20",
  height = "20",
  color = "#00C6FF",
  onClick,
}: {
  width?: string;
  height?: string;
  color?: string;
  onClick?: () => void;
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      onClick={onClick}
    >
      <path
        d="M3.64452 16.3891V19.9404L6.96517 18.0525C7.89081 18.3193 8.87476 18.4633 9.89422 18.4633C15.359 18.4633 19.7884 14.3298 19.7884 9.23166C19.7884 4.13313 15.359 0 9.89422 0C4.42978 0 0 4.13313 0 9.23166C0 12.1186 1.42035 14.6964 3.64452 16.3891Z"
        fill={color}
      />
      <path
        d="M8.8398 6.70312L3.50391 12.3527L8.36002 9.68835L10.8973 12.3527L16.203 6.70312L11.4008 9.32085L8.8398 6.70312Z"
        fill="#FFF"
      />
      <defs>
        <linearGradient
          id="paint0_linear_4565_19391"
          x1="1.10419"
          y1="1.34797"
          x2="1.10419"
          y2="19.063"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default MessengerIcon;
