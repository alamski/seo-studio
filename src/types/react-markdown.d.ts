declare module 'react-markdown' {
  import { ComponentType, ReactNode } from 'react'
  
  export interface ReactMarkdownProps {
    children: string
    remarkPlugins?: any[]
    components?: Record<string, ComponentType<any>>
  }
  
  const ReactMarkdown: ComponentType<ReactMarkdownProps>
  export default ReactMarkdown
}

declare module 'remark-gfm' {
  const remarkGfm: any
  export default remarkGfm
} 