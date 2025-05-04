import { CrawlData } from '../types'

export const validateCrawlData = (data: CrawlData[]): string[] => {
  const errors: string[] = []

  if (!Array.isArray(data)) {
    errors.push('Invalid data format: expected an array')
    return errors
  }

  if (data.length === 0) {
    errors.push('Empty data: no URLs to analyze')
    return errors
  }

  data.forEach((row, index) => {
    if (!row.url) {
      errors.push(`Row ${index + 1}: Missing URL`)
    }
    if (typeof row.status !== 'number') {
      errors.push(`Row ${index + 1}: Invalid status code`)
    }
    if (typeof row.title !== 'string') {
      errors.push(`Row ${index + 1}: Invalid title`)
    }
    if (typeof row.metaDescription !== 'string') {
      errors.push(`Row ${index + 1}: Invalid meta description`)
    }
    if (typeof row.h1 !== 'string') {
      errors.push(`Row ${index + 1}: Invalid H1`)
    }
    if (typeof row.wordCount !== 'number') {
      errors.push(`Row ${index + 1}: Invalid word count`)
    }
  })

  return errors
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validateTitle = (title: string): boolean => {
  return title.length >= 30 && title.length <= 60
}

export const validateMetaDescription = (metaDescription: string): boolean => {
  return metaDescription.length >= 120 && metaDescription.length <= 160
}

export const validateH1 = (h1: string): boolean => {
  return h1.length >= 10 && h1.length <= 70
}

export const validateWordCount = (wordCount: number): boolean => {
  return wordCount >= 300
} 