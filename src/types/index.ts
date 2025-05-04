export interface CrawlData {
  url: string
  status: number
  title: string
  metaDescription: string
  h1: string
  wordCount: number
  'Address': string
  'Status Code': string
  'Title 1': string
  'Meta Description 1': string
  'H1-1': string
  'Word Count': string
  [key: string]: any
}

export interface Issue {
  type: IssueType
  severity: IssueSeverity
  description: string
  url: string
  recommendation: string
}

export type IssueType =
  | '404'
  | 'redirect'
  | 'missing_title'
  | 'missing_meta'
  | 'missing_h1'
  | 'duplicate_content'
  | 'slow_response'
  | 'missing_alt'
  | 'broken_link'
  | 'invalid_schema'

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low'

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface Analysis {
  totalUrls: number
  statusCodes: Record<string, number>
  contentTypes: Record<string, number>
  titleLength: {
    tooShort: number
    optimal: number
    tooLong: number
  }
  metaDescriptionLength: {
    tooShort: number
    optimal: number
    tooLong: number
  }
  h1Length: {
    tooShort: number
    optimal: number
    tooLong: number
  }
  seoIssues: {
    missingTitle: number
    missingMetaDescription: number
    missingH1: number
    duplicateTitles: number
    duplicateMetaDescriptions: number
    duplicateH1s: number
    canonicalIssues: number
    metaRobotsIssues: number
    missingStructuredData: number
  }
  issues: string[]
  insights: string[]
  detailedIssues: {
    missingCanonicals: string[]
    missingTitles: string[]
    duplicateTitles: string[]
    missingH1s: string[]
    missingStructuredData: string[]
  }
}

export interface AnalysisResult {
  summary: string
  recommendations: string[]
  metrics: {
    [key: string]: number
  }
}

export interface AppState {
  crawlData: CrawlData[]
  analysis: Analysis | null
  messages: Message[]
  loading: boolean
  error: string | null
}

export type Action =
  | { type: 'SET_CRAWL_DATA'; payload: CrawlData[] }
  | { type: 'SET_ANALYSIS'; payload: Analysis }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' } 