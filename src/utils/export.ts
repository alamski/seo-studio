import { CrawlData, Analysis } from '../types'
import * as XLSX from 'xlsx'

export const exportToCSV = (data: CrawlData[]): string => {
  const headers = Object.keys(data[0])
  const rows = data.map(row => headers.map(header => row[header]))
  const csvContent = [
    headers.join(';'),
    ...rows.map(row => row.join(';'))
  ].join('\n')
  return csvContent
}

export const exportToJSON = (data: CrawlData[]): string => {
  return JSON.stringify(data, null, 2)
}

export const exportToExcel = (analysis: Analysis) => {
  const insightsData = Object.keys(analysis.insights || {}).map(key => [
    key,
    String(analysis.insights?.[key] || '')
  ])

  const data = [
    ['SEO Analysis Report'],
    [''],
    ['Summary'],
    [`Total URLs Analyzed: ${analysis.totalUrls}`],
    [''],
    ['Status Code Distribution'],
    ...Object.entries(analysis.statusCodes).map(([code, count]) => [
      `Status ${code}: ${count} URLs`
    ]),
    [''],
    ['Title Length Analysis'],
    [`Too Short (< 30 chars): ${analysis.titleLength.tooShort}`],
    [`Optimal (30-60 chars): ${analysis.titleLength.optimal}`],
    [`Too Long (> 60 chars): ${analysis.titleLength.tooLong}`],
    [''],
    ['Meta Description Length Analysis'],
    [`Too Short (< 120 chars): ${analysis.metaDescriptionLength.tooShort}`],
    [`Optimal (120-155 chars): ${analysis.metaDescriptionLength.optimal}`],
    [`Too Long (> 155 chars): ${analysis.metaDescriptionLength.tooLong}`],
    [''],
    ['H1 Length Analysis'],
    [`Too Short (< 20 chars): ${analysis.h1Length.tooShort}`],
    [`Optimal (20-70 chars): ${analysis.h1Length.optimal}`],
    [`Too Long (> 70 chars): ${analysis.h1Length.tooLong}`],
    [''],
    ['SEO Issues'],
    [`Missing Titles: ${analysis.seoIssues.missingTitle}`],
    [`Missing Meta Descriptions: ${analysis.seoIssues.missingMetaDescription}`],
    [`Missing H1 Tags: ${analysis.seoIssues.missingH1}`],
    [`Duplicate Titles: ${analysis.seoIssues.duplicateTitles}`],
    [`Duplicate Meta Descriptions: ${analysis.seoIssues.duplicateMetaDescriptions}`],
    [`Duplicate H1 Tags: ${analysis.seoIssues.duplicateH1s}`],
    [`Missing Canonical Tags: ${analysis.seoIssues.canonicalIssues}`],
    [`Missing Meta Robots Tags: ${analysis.seoIssues.metaRobotsIssues}`],
    [`Missing Structured Data: ${analysis.seoIssues.missingStructuredData}`],
    [''],
    ['Detailed Issues'],
    ...analysis.issues.map(issue => [issue]),
    [''],
    ['Insights'],
    ...insightsData
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'SEO Analysis')
  XLSX.writeFile(workbook, 'seo-analysis.xlsx')
}

export const exportAnalysis = (analysis: Analysis): string => {
  const sections = [
    ['SEO Analysis Report'],
    [''],
    ['Summary'],
    [`Total URLs: ${analysis.totalUrls}`],
    [''],
    ['Status Codes'],
    ...Object.entries(analysis.statusCodes).map(([code, count]) => [`${code}: ${count}`]),
    [''],
    ['Title Length Distribution'],
    [`Too Short (< 30 chars): ${analysis.titleLength.tooShort}`],
    [`Optimal (30-60 chars): ${analysis.titleLength.optimal}`],
    [`Too Long (> 60 chars): ${analysis.titleLength.tooLong}`],
    [''],
    ['Meta Description Length Distribution'],
    [`Too Short (< 120 chars): ${analysis.metaDescriptionLength.tooShort}`],
    [`Optimal (120-160 chars): ${analysis.metaDescriptionLength.optimal}`],
    [`Too Long (> 160 chars): ${analysis.metaDescriptionLength.tooLong}`],
    [''],
    ['H1 Length Distribution'],
    [`Too Short (< 10 chars): ${analysis.h1Length.tooShort}`],
    [`Optimal (10-70 chars): ${analysis.h1Length.optimal}`],
    [`Too Long (> 70 chars): ${analysis.h1Length.tooLong}`],
    [''],
    ['SEO Issues'],
    [`Missing Titles: ${analysis.seoIssues.missingTitle}`],
    [`Missing Meta Descriptions: ${analysis.seoIssues.missingMetaDescription}`],
    [`Missing H1 Tags: ${analysis.seoIssues.missingH1}`],
    [`Duplicate Titles: ${analysis.seoIssues.duplicateTitles}`],
    [`Duplicate Meta Descriptions: ${analysis.seoIssues.duplicateMetaDescriptions}`],
    [`Duplicate H1 Tags: ${analysis.seoIssues.duplicateH1s}`],
    [`Missing Canonical Tags: ${analysis.seoIssues.canonicalIssues}`],
    [`Missing Meta Robots Tags: ${analysis.seoIssues.metaRobotsIssues}`],
    [`Missing Structured Data: ${analysis.seoIssues.missingStructuredData}`],
    [''],
    ['Detailed Issues'],
    ...analysis.issues,
    [''],
    ['Insights'],
    ...analysis.insights,
    [''],
    ['Missing Canonicals'],
    ...analysis.detailedIssues.missingCanonicals,
    [''],
    ['Missing Titles'],
    ...analysis.detailedIssues.missingTitles,
    [''],
    ['Duplicate Titles'],
    ...analysis.detailedIssues.duplicateTitles,
    [''],
    ['Missing H1s'],
    ...analysis.detailedIssues.missingH1s,
    [''],
    ['Missing Structured Data'],
    ...analysis.detailedIssues.missingStructuredData
  ]

  return sections.map(section => section.join('\n')).join('\n\n')
} 