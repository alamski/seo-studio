import { CrawlData, Analysis } from '../types'

export const analyzeCrawlData = (crawlData: CrawlData[]): Analysis => {
  const totalUrls = crawlData.length
  const statusCodes: Record<string, number> = {}
  const contentTypes: Record<string, number> = {}
  const titleLengthStats = { tooShort: 0, optimal: 0, tooLong: 0 }
  const metaDescriptionLengthStats = { tooShort: 0, optimal: 0, tooLong: 0 }
  const h1LengthStats = { tooShort: 0, optimal: 0, tooLong: 0 }
  const seoIssues = {
    missingTitle: 0,
    missingMetaDescription: 0,
    missingH1: 0,
    duplicateTitles: 0,
    duplicateMetaDescriptions: 0,
    duplicateH1s: 0,
    canonicalIssues: 0,
    metaRobotsIssues: 0,
    missingStructuredData: 0
  }
  const issues: string[] = []
  const insights: string[] = []
  const detailedIssues = {
    missingCanonicals: [] as string[],
    missingTitles: [] as string[],
    duplicateTitles: [] as string[],
    missingH1s: [] as string[],
    missingStructuredData: [] as string[]
  }

  // Count status codes and content types
  crawlData.forEach(data => {
    statusCodes[data.status] = (statusCodes[data.status] || 0) + 1
    const contentType = data['Content Type'] || 'unknown'
    contentTypes[contentType] = (contentTypes[contentType] || 0) + 1

    // Analyze title length
    const titleLength = data.title.length
    if (titleLength < 30) {
      titleLengthStats.tooShort++
      issues.push(`Title too short: ${data.url}`)
    } else if (titleLength > 60) {
      titleLengthStats.tooLong++
      issues.push(`Title too long: ${data.url}`)
    } else {
      titleLengthStats.optimal++
    }

    // Analyze meta description length
    const metaLength = data.metaDescription.length
    if (metaLength < 120) {
      metaDescriptionLengthStats.tooShort++
      issues.push(`Meta description too short: ${data.url}`)
    } else if (metaLength > 160) {
      metaDescriptionLengthStats.tooLong++
      issues.push(`Meta description too long: ${data.url}`)
    } else {
      metaDescriptionLengthStats.optimal++
    }

    // Analyze H1 length
    const h1Length = data.h1.length
    if (h1Length < 10) {
      h1LengthStats.tooShort++
      issues.push(`H1 too short: ${data.url}`)
    } else if (h1Length > 70) {
      h1LengthStats.tooLong++
      issues.push(`H1 too long: ${data.url}`)
    } else {
      h1LengthStats.optimal++
    }

    // Check for missing elements
    if (!data.title) {
      seoIssues.missingTitle++
      detailedIssues.missingTitles.push(data.url)
    }
    if (!data.metaDescription) {
      seoIssues.missingMetaDescription++
    }
    if (!data.h1) {
      seoIssues.missingH1++
      detailedIssues.missingH1s.push(data.url)
    }
    if (!data['Canonical Link Element 1']) {
      seoIssues.canonicalIssues++
      detailedIssues.missingCanonicals.push(data.url)
    }
    if (!data['Meta Robots 1']) {
      seoIssues.metaRobotsIssues++
    }
    if (!data['Schema.org Type']) {
      seoIssues.missingStructuredData++
      detailedIssues.missingStructuredData.push(data.url)
    }
  })

  // Check for duplicates
  const titles = new Map<string, string[]>()
  const metaDescriptions = new Map<string, string[]>()
  const h1s = new Map<string, string[]>()

  crawlData.forEach(data => {
    if (data.title) {
      const urls = titles.get(data.title) || []
      urls.push(data.url)
      titles.set(data.title, urls)
    }
    if (data.metaDescription) {
      const urls = metaDescriptions.get(data.metaDescription) || []
      urls.push(data.url)
      metaDescriptions.set(data.metaDescription, urls)
    }
    if (data.h1) {
      const urls = h1s.get(data.h1) || []
      urls.push(data.url)
      h1s.set(data.h1, urls)
    }
  })

  // Count duplicates
  titles.forEach((urls, title) => {
    if (urls.length > 1) {
      seoIssues.duplicateTitles++
      detailedIssues.duplicateTitles.push(...urls)
    }
  })
  metaDescriptions.forEach((urls, meta) => {
    if (urls.length > 1) {
      seoIssues.duplicateMetaDescriptions++
    }
  })
  h1s.forEach((urls, h1) => {
    if (urls.length > 1) {
      seoIssues.duplicateH1s++
    }
  })

  // Generate insights
  if (seoIssues.missingTitle > 0) {
    insights.push(`${seoIssues.missingTitle} pages are missing titles`)
  }
  if (seoIssues.missingMetaDescription > 0) {
    insights.push(`${seoIssues.missingMetaDescription} pages are missing meta descriptions`)
  }
  if (seoIssues.missingH1 > 0) {
    insights.push(`${seoIssues.missingH1} pages are missing H1 tags`)
  }
  if (seoIssues.duplicateTitles > 0) {
    insights.push(`${seoIssues.duplicateTitles} pages have duplicate titles`)
  }
  if (seoIssues.duplicateMetaDescriptions > 0) {
    insights.push(`${seoIssues.duplicateMetaDescriptions} pages have duplicate meta descriptions`)
  }
  if (seoIssues.duplicateH1s > 0) {
    insights.push(`${seoIssues.duplicateH1s} pages have duplicate H1 tags`)
  }
  if (seoIssues.canonicalIssues > 0) {
    insights.push(`${seoIssues.canonicalIssues} pages are missing canonical tags`)
  }
  if (seoIssues.metaRobotsIssues > 0) {
    insights.push(`${seoIssues.metaRobotsIssues} pages are missing meta robots tags`)
  }
  if (seoIssues.missingStructuredData > 0) {
    insights.push(`${seoIssues.missingStructuredData} pages are missing structured data`)
  }

  return {
    totalUrls,
    statusCodes,
    titleLength: titleLengthStats,
    metaDescriptionLength: metaDescriptionLengthStats,
    h1Length: h1LengthStats,
    seoIssues,
    issues,
    insights,
    detailedIssues
  }
} 