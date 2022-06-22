declare module '*.svg' {
  // @svgr/webpack converts them to JSX
  const content: string;
  export = content;
}
