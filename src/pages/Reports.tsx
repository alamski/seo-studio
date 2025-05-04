import React, { useState, useMemo, useEffect } from 'react'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  HStack,
  Select,
  Card,
  CardBody,
  CardHeader,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Progress,
} from '@chakra-ui/react'
import {
  FiDownload,
  FiCalendar,
  FiBarChart2,
  FiChevronDown,
  FiRefreshCw,
  FiClock,
  FiExternalLink,
  FiAlertCircle,
} from 'react-icons/fi'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import { useApp } from '../context/AppContext'

interface Report {
  id: string
  date: string
  type: 'crawl' | 'analysis'
  status: 'completed' | 'failed' | 'in_progress'
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const Reports: React.FC = () => {
  const { state: { analysis, crawlData } } = useApp()
  const [timeRange, setTimeRange] = useState('7d')
  const [reportType, setReportType] = useState('all')
  const [loading, setLoading] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [reports, setReports] = useState<Report[]>([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  // Fetch reports based on filters
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      try {
        // TODO: Replace with actual API call
        const response = await fetch(`/api/reports?timeRange=${timeRange}&type=${reportType}&page=${currentPage}`)
        const data = await response.json()
        setReports(data.reports)
        setTotalPages(data.totalPages)
      } catch (error) {
        toast({
          title: 'Error fetching reports',
          description: 'Failed to load reports. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
      setLoading(false)
    }

    fetchReports()
  }, [timeRange, reportType, currentPage])

  const trendData = useMemo(() => {
    return reports.map(report => ({
      date: new Date(report.date).toLocaleDateString(),
      totalUrls: report.metrics.totalUrls,
      indexableUrls: report.metrics.indexableUrls,
      averageWordCount: report.metrics.averageWordCount,
      seoScore: report.metrics.seoScore,
    }))
  }, [reports])

  const statusDistribution = useMemo(() => {
    const distribution = reports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(distribution).map(([status, count]) => ({
      name: status,
      value: count,
    }))
  }, [reports])

  const handleExport = (format: 'csv' | 'json' | 'excel') => {
    try {
      const data = reports.map(report => ({
        date: report.date,
        type: report.type,
        status: report.status,
        ...report.metrics
      }))

      let content: string
      let mimeType: string
      let fileExtension: string

      switch (format) {
        case 'csv':
          const headers = ['Date', 'Type', 'Status', 'Total URLs', 'Indexable URLs', 'Average Word Count', 'SEO Score']
          content = [
            headers.join(','),
            ...data.map(item => [
              item.date,
              item.type,
              item.status,
              item.totalUrls,
              item.indexableUrls,
              item.averageWordCount,
              item.seoScore
            ].join(','))
          ].join('\n')
          mimeType = 'text/csv'
          fileExtension = 'csv'
          break
        case 'json':
          content = JSON.stringify(data, null, 2)
          mimeType = 'application/json'
          fileExtension = 'json'
          break
        default:
          throw new Error('Unsupported format')
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `seo-reports-${new Date().toISOString().split('T')[0]}.${fileExtension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: 'Export Successful',
        description: `Reports exported as ${format.toUpperCase()}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export reports',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green'
      case 'failed':
        return 'red'
      case 'in_progress':
        return 'blue'
      default:
        return 'gray'
    }
  }

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report)
    onOpen()
  }

  const handleDownloadReport = async (reportId: string) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/reports/${reportId}/download`)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `report-${reportId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Failed to download report',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <HStack justify="space-between" align="center" mb={4}>
            <Heading size="lg">Reports</Heading>
            <HStack>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                maxW="200px"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </Select>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                maxW="200px"
              >
                <option value="all">All Reports</option>
                <option value="crawl">Crawl Reports</option>
                <option value="analysis">Analysis Reports</option>
              </Select>
              <Menu>
                <MenuButton
                  as={Button}
                  leftIcon={<FiDownload />}
                  rightIcon={<FiChevronDown />}
                >
                  Export
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => handleExport('csv')}>Export as CSV</MenuItem>
                  <MenuItem onClick={() => handleExport('json')}>Export as JSON</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </HStack>
        </Box>

        <Stack spacing={8}>
          <Card bg={bgColor} border="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Trend Analysis</Heading>
            </CardHeader>
            <CardBody>
              <Box h="400px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="totalUrls"
                      stroke="#8884d8"
                      name="Total URLs"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="indexableUrls"
                      stroke="#82ca9d"
                      name="Indexable URLs"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="averageWordCount"
                      stroke="#ffc658"
                      name="Average Word Count"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="seoScore"
                      stroke="#ff8042"
                      name="SEO Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          <Card bg={bgColor} border="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Status Distribution</Heading>
            </CardHeader>
            <CardBody>
              <Box h="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          <Card bg={bgColor} border="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Recent Reports</Heading>
            </CardHeader>
            <CardBody>
              {loading ? (
                <Flex justify="center" align="center" h="200px">
                  <Spinner size="xl" />
                </Flex>
              ) : (
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Date</Th>
                        <Th>Type</Th>
                        <Th>Status</Th>
                        <Th isNumeric>Total URLs</Th>
                        <Th isNumeric>Indexable URLs</Th>
                        <Th isNumeric>Avg. Word Count</Th>
                        <Th isNumeric>SEO Score</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {reports.map((report) => (
                        <Tr key={report.id}>
                          <Td>{new Date(report.date).toLocaleDateString()}</Td>
                          <Td>
                            <Badge colorScheme={report.type === 'crawl' ? 'blue' : 'purple'}>
                              {report.type}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge colorScheme={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                          </Td>
                          <Td isNumeric>{report.metrics.totalUrls}</Td>
                          <Td isNumeric>{report.metrics.indexableUrls}</Td>
                          <Td isNumeric>{report.metrics.averageWordCount}</Td>
                          <Td isNumeric>
                            <Progress
                              value={report.metrics.seoScore}
                              colorScheme={report.metrics.seoScore >= 80 ? 'green' : report.metrics.seoScore >= 60 ? 'yellow' : 'red'}
                              size="sm"
                              borderRadius="full"
                            />
                            {report.metrics.seoScore}
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Tooltip label="View Details">
                                <IconButton
                                  aria-label="View report details"
                                  icon={<FiBarChart2 />}
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleViewDetails(report)}
                                />
                              </Tooltip>
                              <Tooltip label="Download Report">
                                <IconButton
                                  aria-label="Download report"
                                  icon={<FiDownload />}
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDownloadReport(report.id)}
                                />
                              </Tooltip>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </CardBody>
          </Card>
        </Stack>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedReport && (
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={2} spacing={4}>
                  <Stat>
                    <StatLabel>Total URLs</StatLabel>
                    <StatNumber>{selectedReport.metrics.totalUrls}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Indexable URLs</StatLabel>
                    <StatNumber>{selectedReport.metrics.indexableUrls}</StatNumber>
                    <StatHelpText>
                      <StatArrow type={selectedReport.metrics.indexableUrls / selectedReport.metrics.totalUrls > 0.8 ? 'increase' : 'decrease'} />
                      {((selectedReport.metrics.indexableUrls / selectedReport.metrics.totalUrls) * 100).toFixed(1)}%
                    </StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Average Word Count</StatLabel>
                    <StatNumber>{selectedReport.metrics.averageWordCount}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>SEO Score</StatLabel>
                    <StatNumber>{selectedReport.metrics.seoScore}</StatNumber>
                  </Stat>
                </SimpleGrid>

                <Box>
                  <Heading size="sm" mb={4}>Content Analysis</Heading>
                  <SimpleGrid columns={2} spacing={4}>
                    <Stat>
                      <StatLabel>Pages with Titles</StatLabel>
                      <StatNumber>{selectedReport.metrics.urlsWithTitles}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Pages with Meta Descriptions</StatLabel>
                      <StatNumber>{selectedReport.metrics.urlsWithMetaDescriptions}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Pages with H1</StatLabel>
                      <StatNumber>{selectedReport.metrics.urlsWithH1}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Broken Links</StatLabel>
                      <StatNumber color={selectedReport.metrics.brokenLinks > 0 ? 'red.500' : 'green.500'}>
                        {selectedReport.metrics.brokenLinks}
                      </StatNumber>
                    </Stat>
                  </SimpleGrid>
                </Box>

                <Box>
                  <Heading size="sm" mb={4}>Performance</Heading>
                  <Stat>
                    <StatLabel>Average Load Time</StatLabel>
                    <StatNumber>{selectedReport.metrics.loadTime}ms</StatNumber>
                    <StatHelpText>
                      <StatArrow type={selectedReport.metrics.loadTime < 2000 ? 'increase' : 'decrease'} />
                      {selectedReport.metrics.loadTime < 2000 ? 'Good' : 'Needs Improvement'}
                    </StatHelpText>
                  </Stat>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  )
}

export default Reports 