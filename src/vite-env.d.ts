/// <reference types="vite/client" />

// Support importing arbitrary files with ?raw suffix as string content
declare module '*?raw' {
  const content: string
  export default content
}

// In some CI environments, the vite/client ambient types are not picked up early enough.
// Provide a minimal fallback so `import.meta.env` type-checks during `tsc` before Vite runs.
interface ImportMetaEnv {
  readonly BASE_URL?: string
  readonly [key: string]: any
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}


