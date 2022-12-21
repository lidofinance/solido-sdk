import React from 'react';
import Svg, {Path} from 'react-native-svg';

const CrossRoundSvg = props => (
  <Svg
    width={80}
    height={80}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M32 61.867c16.495 0 29.867-13.372 29.867-29.867S48.495 2.133 32 2.133 2.133 15.505 2.133 32 15.505 61.867 32 61.867ZM32 64c17.673 0 32-14.327 32-32C64 14.327 49.673 0 32 0 14.327 0 0 14.327 0 32c0 17.673 14.327 32 32 32Z"
      fill="#E14D4D"
    />
    <Path
      d="M24.61 39.542a1.067 1.067 0 0 0 1.508 0l6.034-6.034 6.034 6.034a1.067 1.067 0 0 0 1.508-1.508L33.66 32l6.034-6.034a1.067 1.067 0 0 0-1.508-1.509l-6.034 6.034-6.034-6.034a1.067 1.067 0 0 0-1.509 1.509L30.643 32l-6.034 6.034a1.067 1.067 0 0 0 0 1.508Z"
      fill="#E14D4D"
    />
  </Svg>
);

export default CrossRoundSvg;
