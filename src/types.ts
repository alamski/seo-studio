export interface CrawlData {
  url: string
  status: number
  title: string
  metaDescription: string
  h1: string
  wordCount: number
  loadTime: number
  links: string[]
  // Raw CSV fields
  'Address'?: string
  'Status Code'?: string
  'Title 1'?: string
  'Meta Description 1'?: string
  'H1-1'?: string
  'Word Count'?: string
  [key: string]: any // Allow other fields from CSV
}

export interface AnalysisResult {
  seoScore: number
  issues: {
    type: string
    message: string
    urls: string[]
  }[]
  recommendations: {
    type: string
    message: string
    priority: 'high' | 'medium' | 'low'
  }[]
}

export interface Analysis {
  totalUrls: number
  statusCodes: Record<string, number>
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
  issues: string[]
  detailedIssues: {
    missingCanonicals: string[]
    missingTitles: string[]
    duplicateTitles: string[]
    missingH1s: string[]
    missingStructuredData: string[]
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
  insights: {
    [key: string]: any
  }
  summary?: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface AppState {
  crawlData: CrawlData[]
  analysis: Analysis | null
  messages: Message[]
  loading: boolean
  error: string | null
}

export interface Report {
  id: string
  date: string
  type: 'crawl' | 'analysis'
  status: 'completed' | 'in_progress' | 'failed'
  metrics: {
    totalUrls: number
    indexableUrls: number
    averageWordCount: number
    urlsWithTitles: number
    urlsWithMetaDescriptions: number
    urlsWithH1: number
    brokenLinks: number
    duplicateContent: number
    loadTime: number
    seoScore: number
  }
}

export interface Action {
  type: string
  payload?: any
} 