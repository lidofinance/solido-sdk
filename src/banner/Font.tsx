import React from 'react';

const currentFont = 'Montserrat';

export const fontFamily = `${currentFont}, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto`;

const Font: React.FC = () => {
  return (
    <style>{`
          @import url(https://fonts.googleapis.com/css2?family=${currentFont}:wght@400;700);
    `}</style>
  );
}

export default Font;
