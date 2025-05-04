import React, { useState } from 'react'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Badge,
  Progress,
  ProgressLabel,
  List,
  ListItem,
  ListIcon,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Tooltip,
  Flex,
  Spacer,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tag,
  TagLabel,
  TagLeftIcon,
  Wrap,
  WrapItem,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import { FiAlertCircle, FiExternalLink, FiCheckCircle, FiSearch, FiFilter, FiAlertTriangle, FiInfo } from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import { Analysis as AnalysisType } from '../types'
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Add type definition for detailed issues
type DetailedIssues = {
  missingCanonicals: string[];
  missingTitles: string[];
  duplicateTitles: string[];
  missingH1s: string[];
  missingStructuredData: string[];
  missingMetaDescriptions: string[];
  criticalIssues: string[];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

const Analysis: React.FC = () => {
  const { state } = useApp()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const [searchTerm, setSearchTerm] = useState('')
  const [issueFilter, setIssueFilter] = useState('all')
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  if (!state.analysis) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          p={6}
          shadow="sm"
        >
          <VStack spacing={6} align="stretch">
            <Heading size="lg">SEO Analysis</Heading>
            <Text>Upload your SEO data file to begin analysis.</Text>
          </VStack>
        </Box>
      </Container>
    )
  }

  const analysis = state.analysis

  // Calculate SEO score (0-100)
  const totalIssues = Object.values(analysis.seoIssues).reduce((a, b) => a + b, 0)
  const seoScore = Math.max(0, 100 - (totalIssues * 5)) // Each issue reduces score by 5 points

  // Categorize issues
  const categorizedIssues = analysis.issues.reduce((acc, issue) => {
    let category = 'Other'
    if (issue.includes('title')) category = 'Title Issues'
    else if (issue.includes('meta')) category = 'Meta Issues'
    else if (issue.includes('H1')) category = 'Heading Issues'
    else if (issue.includes('404')) category = 'Critical Issues'
    else if (issue.includes('duplicate')) category = 'Duplicate Content'
    else if (issue.includes('canonical')) category = 'Canonical Issues'
    else if (issue.includes('robots')) category = 'Robots Issues'
    
    if (!acc[category]) acc[category] = []
    acc[category].push(issue)
    return acc
  }, {} as Record<string, string[]>)

  // Prepare data for charts
  const pieChartData = Object.entries(categorizedIssues).map(([category, issues]) => ({
    name: category,
    value: issues.length,
  }))

  // Get severity level for an issue
  const getSeverityLevel = (issue: string) => {
    if (issue.includes('404')) return 'critical'
    if (issue.includes('duplicate') || issue.includes('canonical')) return 'warning'
    return 'info'
  }

  const severityData = analysis.issues.reduce((acc, issue) => {
    const severity = getSeverityLevel(issue)
    acc[severity] = (acc[severity] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const barChartData = Object.entries(severityData).map(([severity, count]) => ({
    name: severity.charAt(0).toUpperCase() + severity.slice(1),
    value: count,
  }))

  const radarChartData = [
    {
      category: 'Titles',
      value: categorizedIssues['Title Issues']?.length || 0,
    },
    {
      category: 'Meta',
      value: categorizedIssues['Meta Issues']?.length || 0,
    },
    {
      category: 'Headings',
      value: categorizedIssues['Heading Issues']?.length || 0,
    },
    {
      category: 'Critical',
      value: categorizedIssues['Critical Issues']?.length || 0,
    },
    {
      category: 'Duplicate',
      value: categorizedIssues['Duplicate Content']?.length || 0,
    },
    {
      category: 'Canonical',
      value: categorizedIssues['Canonical Issues']?.length || 0,
    },
  ]

  // Get icon for severity level
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return FiAlertCircle
      case 'warning':
        return FiAlertTriangle
      default:
        return FiInfo
    }
  }

  // Get color for severity level
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'red'
      case 'warning':
        return 'orange'
      default:
        return 'blue'
    }
  }

  // Filter issues based on search term and filter
  const filteredIssues = Object.entries(categorizedIssues).reduce((acc, [category, issues]) => {
    const filtered = issues.filter(issue => {
      const matchesSearch = issue.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = issueFilter === 'all' || 
        (issueFilter === 'critical' && issue.includes('404')) ||
        (issueFilter === 'titles' && issue.includes('title')) ||
        (issueFilter === 'meta' && issue.includes('meta')) ||
        (issueFilter === 'h1' && issue.includes('H1'))
      return matchesSearch && matchesFilter
    })
    if (filtered.length > 0) {
      acc[category] = filtered
    }
    return acc
  }, {} as Record<string, string[]>)

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green'
    if (score >= 60) return 'yellow'
    return 'red'
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Summary Section */}
        <Box
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          p={6}
          shadow="sm"
        >
          <Heading size="lg" mb={6}>Analysis Summary</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Stat>
              <StatLabel>Total URLs</StatLabel>
              <StatNumber>{analysis.totalUrls}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Issues Found</StatLabel>
              <StatNumber>{analysis.issues.length}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>SEO Score</StatLabel>
              <StatNumber color={getScoreColor(seoScore)}>{seoScore}</StatNumber>
              <Progress value={seoScore} colorScheme={getScoreColor(seoScore)} mt={2} />
            </Stat>
          </SimpleGrid>
        </Box>

        {/* Charts Section */}
        <Box
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          p={6}
          shadow="sm"
        >
          <Heading size="lg" mb={6}>Issue Distribution</Heading>
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab>By Category</Tab>
              <Tab>By Severity</Tab>
              <Tab>Issue Types</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box h="400px">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </TabPanel>
              <TabPanel>
                <Box h="400px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8">
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getSeverityColor(entry.name.toLowerCase())} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </TabPanel>
              <TabPanel>
                <Box h="400px">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={150} data={radarChartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis />
                      <Radar
                        name="Issues"
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <RechartsTooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* Search and Filter Section */}
        <Box
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          p={4}
          shadow="sm"
        >
          <Flex gap={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Select
              value={issueFilter}
              onChange={(e) => setIssueFilter(e.target.value)}
              maxW="200px"
            >
              <option value="all">All Issues</option>
              <option value="critical">Critical Issues</option>
              <option value="titles">Title Issues</option>
              <option value="meta">Meta Issues</option>
              <option value="h1">H1 Issues</option>
            </Select>
          </Flex>
        </Box>

        {/* Issues List Section */}
        <Box
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          p={6}
          shadow="sm"
        >
          <Heading size="lg" mb={6}>Detailed Issues</Heading>
          <Accordion allowMultiple defaultIndex={[0]}>
            {Object.entries(categorizedIssues).map(([category, issues]) => {
              // Filter issues within the category based on search/filter
              const filtered = issues.filter(issue => {
                const matchesSearch = issue.toLowerCase().includes(searchTerm.toLowerCase())
                const matchesFilter = issueFilter === 'all' || 
                  (issueFilter === 'critical' && issue.includes('404')) ||
                  (issueFilter === 'titles' && issue.includes('title')) ||
                  (issueFilter === 'meta' && issue.includes('meta')) ||
                  (issueFilter === 'h1' && issue.includes('H1'))
                return matchesSearch && matchesFilter
              })
              if (filtered.length === 0) return null
              return (
                <AccordionItem key={category}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        <HStack>
                          <Heading size="md">{category}</Heading>
                          <Badge colorScheme={getSeverityColor(getSeverityLevel(filtered[0]))}>
                            {filtered.length} issues
                          </Badge>
                        </HStack>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <VStack align="stretch" spacing={4}>
                      {filtered.map((issue, index) => {
                        const severity = getSeverityLevel(issue)
                        const Icon = getSeverityIcon(severity)
                        // Map issue description to detailedIssues key
                        let urls: string[] = []
                        if (issue.includes('canonical')) {
                          urls = analysis.detailedIssues.missingCanonicals
                        } else if (issue.includes('title')) {
                          if (issue.includes('duplicate')) {
                            urls = analysis.detailedIssues.duplicateTitles
                          } else {
                            urls = analysis.detailedIssues.missingTitles
                          }
                        } else if (issue.includes('H1')) {
                          urls = analysis.detailedIssues.missingH1s
                        } else if (issue.includes('meta')) {
                          urls = analysis.detailedIssues.missingMetaDescriptions
                        } else if (issue.includes('404')) {
                          urls = analysis.detailedIssues.criticalIssues
                        } else if (issue.includes('structured data')) {
                          urls = analysis.detailedIssues.missingStructuredData
                        }
                        if (issue.includes('duplicate')) {
                          if (issue.includes('title')) {
                            urls = analysis.detailedIssues.duplicateTitles
                          } else if (issue.includes('meta')) {
                            urls = analysis.detailedIssues.duplicateMetaDescriptions
                          } else if (issue.includes('H1')) {
                            urls = analysis.detailedIssues.duplicateH1s
                          }
                        }
                        return (
                          <Box
                            key={index}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            borderColor={getSeverityColor(severity)}
                          >
                            <HStack>
                              <Icon color={getSeverityColor(severity)} />
                              <Text>{issue}</Text>
                            </HStack>
                            {urls && urls.length > 0 && (
                              <Box mt={2}>
                                <Text fontSize="sm" color="gray.500" mb={2}>Affected URLs:</Text>
                                <VStack align="stretch" spacing={2}>
                                  {urls.map((url, urlIndex) => (
                                    <Box
                                      key={urlIndex}
                                      p={2}
                                      borderWidth="1px"
                                      borderRadius="md"
                                      borderColor={borderColor}
                                      _hover={{ bg: 'gray.50' }}
                                    >
                                      <HStack>
                                        <Box as={FiExternalLink} color={getSeverityColor(severity)} />
                                        <Link
                                          href={url}
                                          isExternal
                                          color={getSeverityColor(severity)}
                                          fontWeight="medium"
                                          _hover={{ textDecoration: 'underline' }}
                                        >
                                          {url}
                                        </Link>
                                      </HStack>
                                    </Box>
                                  ))}
                                </VStack>
                              </Box>
                            )}
                          </Box>
                        )
                      })}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              )
            })}
          </Accordion>
        </Box>
      </VStack>
    </Container>
  )
}

export default Analysis 