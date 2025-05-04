import Papa from 'papaparse'
import { CrawlData } from '../types'

export const parseCSV = async (file: File): Promise<CrawlData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<CrawlData>(file, {
      header: true,
      delimiter: ';', // Screaming Frog uses semicolon as delimiter
      complete: (results: Papa.ParseResult<CrawlData>) => {
        if (results.errors.length > 0) {
          reject(new Error(results.errors[0].message))
          return
        }
        
        // Transform the data to match our CrawlData interface
        const crawlData: CrawlData[] = results.data.map(row => ({
          ...row,
          url: row['Address'] || '',
          status: parseInt(row['Status Code'] || '0'),
          title: row['Title 1'] || '',
          metaDescription: row['Meta Description 1'] || '',
          h1: row['H1-1'] || '',
          wordCount: parseInt(row['Word Count'] || '0')
        }))
        
        resolve(crawlData)
      },
      error: (error: Error) => {
        reject(new Error(error.message))
      },
    })
  })
} 