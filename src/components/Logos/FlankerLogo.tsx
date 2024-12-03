interface FlankerFullLogoProps {
  className?: string;
}

export const FlankerFullLogo: React.FC<FlankerFullLogoProps> = ({
  className,
}) => {
  return (
    <svg
      className={className}
      width="256"
      height="256"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_4_86)">
        <path
          d="M73.125 191L94.375 63H179.125L175.375 85.3125H117.688L112.688 115.812H164.75L161 138.125H108.938L100.188 191H73.125Z"
          fill="white"
        />
        <path
          d="M127.289 231.2C184.677 231.2 231.2 184.677 231.2 127.289C231.2 69.9005 184.677 23.378 127.289 23.378C69.9005 23.378 23.3779 69.9005 23.3779 127.289C23.3779 184.677 69.9005 231.2 127.289 231.2Z"
          stroke="white"
          stroke-width="24"
        />
        <path
          d="M128 253C197.036 253 253 197.036 253 128C253 58.9644 197.036 3 128 3C58.9644 3 3 58.9644 3 128C3 197.036 58.9644 253 128 253Z"
          stroke="white"
          stroke-width="6"
        />
      </g>
      <defs>
        <clipPath id="clip0_4_86">
          <rect width="256" height="256" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
