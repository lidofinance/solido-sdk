import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

const CheckRoundSvg = props => (
  <Svg
    width={80}
    height={80}
    fill="none"
    viewBox="0 0 60 60"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle cx={30} cy={30} r={29} stroke="#61B75F" strokeWidth={2} />
    <Path
      d="M38 25 27 36l-5-5"
      stroke="#61B75F"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CheckRoundSvg;
