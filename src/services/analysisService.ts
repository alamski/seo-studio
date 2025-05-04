import { CrawlData, Analysis } from '../types'

export const processCrawlData = async (file: File): Promise<CrawlData[]> => {
  const text = await file.text()
  const rows = text.split('\n')
  const headers = rows[0].split(';')
  
  return rows.slice(1)
    .map(row => {
      const values = row.split(';')
      return headers.reduce((obj: any, header, index) => {
        obj[header] = values[index]
        return obj
      }, {})
    })
    .filter(row => Object.keys(row).length > 1)
}

export const generateAnalysis = (crawlData: CrawlData[]): Analysis => {
  const totalUrls = crawlData.length
  const issues: string[] = []
  const detailedIssues = {
    missingCanonicals: [] as string[],
    missingTitles: [] as string[],
    duplicateTitles: [] as string[],
    missingH1s: [] as string[],
    missingStructuredData: [] as string[],
    missingMetaDescriptions: [] as string[],
    criticalIssues: [] as string[],
    duplicateMetaDescriptions: [] as string[],
    duplicateH1s: [] as string[],
  }

  // Track duplicates
  const titles = new Set<string>()
  const metaDescriptions = new Set<string>()
  const h1s = new Set<string>()

  // Track content types
  const contentTypes: Record<string, number> = {}

  crawlData.forEach(data => {
    // Track content type
    const contentType = data['Content Type'] || 'unknown'
    contentTypes[contentType] = (contentTypes[contentType] || 0) + 1

    // Check for missing titles
    if (!data['Title 1']) {
      issues.push(`Missing title for ${data['Address']}`)
      detailedIssues.missingTitles.push(data['Address'])
    } else if (titles.has(data['Title 1'])) {
      issues.push(`Duplicate title found: ${data['Title 1']}`)
    } else {
      titles.add(data['Title 1'])
    }

    // Check for missing meta descriptions
    if (!data['Meta Description 1']) {
      issues.push(`Missing meta description for ${data['Address']}`)
      detailedIssues.missingMetaDescriptions.push(data['Address'])
    } else if (metaDescriptions.has(data['Meta Description 1'])) {
      issues.push(`Duplicate meta description found: ${data['Meta Description 1']}`)
      detailedIssues.duplicateMetaDescriptions.push(data['Address'])
    } else {
      metaDescriptions.add(data['Meta Description 1'])
    }

    // Check for missing H1s
    if (!data['H1-1']) {
      issues.push(`Missing H1 for ${data['Address']}`)
      detailedIssues.missingH1s.push(data['Address'])
    } else if (h1s.has(data['H1-1'])) {
      issues.push(`Duplicate H1 found: ${data['H1-1']}`)
      detailedIssues.duplicateH1s.push(data['Address'])
    } else {
      h1s.add(data['H1-1'])
    }

    // Check status codes
    if ((data['Status Code'] + '').trim() === '404') {
      issues.push(`404 error found for ${data['Address']}`)
      detailedIssues.criticalIssues.push(data['Address'])
    }
  })

  // Calculate SEO metrics
  const seoIssues = {
    missingTitle: detailedIssues.missingTitles.length,
    missingMetaDescription: crawlData.filter(d => !d['Meta Description 1']).length,
    missingH1: detailedIssues.missingH1s.length,
    duplicateTitles: crawlData.length - titles.size,
    duplicateMetaDescriptions: crawlData.length - metaDescriptions.size,
    duplicateH1s: crawlData.length - h1s.size,
    canonicalIssues: detailedIssues.missingCanonicals.length,
    metaRobotsIssues: 0,
    missingStructuredData: detailedIssues.missingStructuredData.length
  }

  return {
    totalUrls,
    statusCodes: crawlData.reduce((acc, row) => {
      const code = row['Status Code'] || 'unknown'
      acc[code] = (acc[code] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    contentTypes,
    titleLength: {
      tooShort: 0,
      optimal: 0,
      tooLong: 0
    },
    metaDescriptionLength: {
      tooShort: 0,
      optimal: 0,
      tooLong: 0
    },
    h1Length: {
      tooShort: 0,
      optimal: 0,
      tooLong: 0
    },
    seoIssues,
    issues,
    insights: [],
    detailedIssues
  }
} 