/// <reference types="vite/client" />

// Support importing arbitrary files with ?raw suffix as string content
declare module '*?raw' {
  const content: string
  export default content
}


