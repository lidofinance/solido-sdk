declare module '*.svg' {
  // @svgr/webpack converts them to JSX
  const content: string;
  export const ReactComponent: React.JSX;
  export default content;
}
