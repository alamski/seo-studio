import React, { useState, useMemo } from 'react'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  HStack,
  Badge,
  useColorModeValue,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
  Checkbox,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Tooltip,
  Link,
} from '@chakra-ui/react'
import { FiFilter, FiDownload, FiChevronDown, FiBarChart2 } from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import { CrawlData } from '../types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'

type SortField = 'Address' | 'Status_Code' | 'Word_Count' | 'Inlinks' | 'Outlinks'
type SortOrder = 'asc' | 'desc'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box bg="white" p={3} borderRadius="md" boxShadow="lg" border="1px" borderColor="gray.200">
        <Text fontWeight="bold">{label}</Text>
        {payload.map((entry: any, index: number) => (
          <Text key={index} color={entry.color}>
            {entry.name}: {entry.value}
          </Text>
        ))}
      </Box>
    )
  }
  return null
}

const CrawlAnalysis: React.FC = () => {
  const { state: { analysis, crawlData } } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('Address')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [showCharts, setShowCharts] = useState(false)
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...crawlData]

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.Address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Title_1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Meta_Description_1?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.Status_Code.toString() === statusFilter)
    }

    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      return sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number)
    })

    return filtered
  }, [crawlData, searchTerm, statusFilter, sortField, sortOrder])

  const statusCodeData = useMemo(() => {
    const statusCounts = filteredAndSortedData.reduce((acc, curr) => {
      acc[curr.Status_Code] = (acc[curr.Status_Code] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    return Object.entries(statusCounts).map(([code, count]) => ({
      name: `Status ${code}`,
      value: count,
      color: getStatusColor(parseInt(code))
    }))
  }, [filteredAndSortedData])

  const wordCountData = useMemo(() => {
    const ranges = [
      { min: 0, max: 300, name: '0-300' },
      { min: 301, max: 600, name: '301-600' },
      { min: 601, max: 1000, name: '601-1000' },
      { min: 1001, max: Infinity, name: '1000+' }
    ]

    return ranges.map(range => ({
      name: range.name,
      value: filteredAndSortedData.filter(item => 
        item.Word_Count >= range.min && item.Word_Count <= range.max
      ).length
    }))
  }, [filteredAndSortedData])

  const linkData = useMemo(() => {
    const sortedByInlinks = [...filteredAndSortedData]
      .sort((a, b) => b.Inlinks - a.Inlinks)
      .slice(0, 10)
      .map(item => ({
        name: item.Address.split('/').pop() || item.Address,
        inlinks: item.Inlinks,
        outlinks: item.Outlinks
      }))

    return sortedByInlinks
  }, [filteredAndSortedData])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(filteredAndSortedData.map((_, index) => index)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (index: number) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedRows(newSelected)
  }

  const exportSelectedToCSV = () => {
    if (selectedRows.size === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select rows to export',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      const headers = ['Address', 'Status Code', 'Title', 'Meta Description', 'Word Count', 'Inlinks', 'Outlinks']
      const selectedData = Array.from(selectedRows).map(index => filteredAndSortedData[index])
      const csvContent = [
        headers.join(','),
        ...selectedData.map(item => [
          item.Address,
          item.Status_Code,
          item.Title_1,
          item.Meta_Description_1,
          item.Word_Count,
          item.Inlinks,
          item.Outlinks
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `selected-urls-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: 'Export Successful',
        description: `Exported ${selectedRows.size} URLs to CSV`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting the selected URLs',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const getStatusColor = (status: number) => {
    if (status >= 500) return 'red'
    if (status >= 400) return 'orange'
    if (status >= 300) return 'blue'
    return 'green'
  }

  if (!analysis || !crawlData.length) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="lg" mb={4}>Crawl Analysis</Heading>
            <Text>Upload a Screaming Frog export file to view detailed crawl analysis.</Text>
          </Box>
        </VStack>
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <HStack justify="space-between" align="center" mb={4}>
            <Heading size="lg">Crawl Analysis</Heading>
            <HStack>
              <Button
                leftIcon={<FiBarChart2 />}
                onClick={() => setShowCharts(!showCharts)}
                variant="outline"
              >
                {showCharts ? 'Hide Charts' : 'Show Charts'}
              </Button>
              <Button
                leftIcon={<FiDownload />}
                colorScheme="blue"
                onClick={exportSelectedToCSV}
                isDisabled={selectedRows.size === 0}
              >
                Export Selected ({selectedRows.size})
              </Button>
            </HStack>
          </HStack>

          {showCharts && (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={8}>
              <Box p={4} bg={bgColor} borderRadius="lg" border="1px" borderColor={borderColor}>
                <Heading size="md" mb={4}>Status Code Distribution</Heading>
                <Box h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusCodeData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {statusCodeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Box>

              <Box p={4} bg={bgColor} borderRadius="lg" border="1px" borderColor={borderColor}>
                <Heading size="md" mb={4}>Word Count Distribution</Heading>
                <Box h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={wordCountData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill="#8884d8" name="Number of Pages" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>

              <Box p={4} bg={bgColor} borderRadius="lg" border="1px" borderColor={borderColor} gridColumn={{ base: 1, md: 'span 2' }}>
                <Heading size="md" mb={4}>Top 10 Pages by Inlinks</Heading>
                <Box h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={linkData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="inlinks" stroke="#8884d8" name="Inlinks" />
                      <Line type="monotone" dataKey="outlinks" stroke="#82ca9d" name="Outlinks" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            </SimpleGrid>
          )}

          <HStack spacing={4} mb={4}>
            <Input
              placeholder="Search URLs, titles, or meta descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              maxW="400px"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              maxW="200px"
            >
              <option value="all">All Status Codes</option>
              <option value="200">200 OK</option>
              <option value="301">301 Redirect</option>
              <option value="404">404 Not Found</option>
              <option value="500">500 Server Error</option>
            </Select>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FiChevronDown />}
                leftIcon={<FiFilter />}
              >
                Sort by: {sortField}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => setSortField('Address')}>URL</MenuItem>
                <MenuItem onClick={() => setSortField('Status_Code')}>Status Code</MenuItem>
                <MenuItem onClick={() => setSortField('Word_Count')}>Word Count</MenuItem>
                <MenuItem onClick={() => setSortField('Inlinks')}>Inlinks</MenuItem>
                <MenuItem onClick={() => setSortField('Outlinks')}>Outlinks</MenuItem>
              </MenuList>
            </Menu>
            <IconButton
              aria-label="Toggle sort order"
              icon={<FiChevronDown style={{ transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none' }} />}
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            />
          </HStack>

          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>
                    <Checkbox
                      isChecked={selectedRows.size === filteredAndSortedData.length}
                      isIndeterminate={selectedRows.size > 0 && selectedRows.size < filteredAndSortedData.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </Th>
                  <Th>URL</Th>
                  <Th>Status</Th>
                  <Th>Title</Th>
                  <Th>Meta Description</Th>
                  <Th isNumeric>Word Count</Th>
                  <Th isNumeric>Inlinks</Th>
                  <Th isNumeric>Outlinks</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredAndSortedData.map((item, index) => (
                  <Tr key={index}>
                    <Td>
                      <Checkbox
                        isChecked={selectedRows.has(index)}
                        onChange={() => handleSelectRow(index)}
                      />
                    </Td>
                    <Td maxW="300px" isTruncated>
                      <Link href={item.Address} color="blue.500" isExternal>
                        {item.Address}
                      </Link>
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(item.Status_Code)}>
                        {item.Status_Code}
                      </Badge>
                    </Td>
                    <Td maxW="300px" isTruncated>{item.Title_1}</Td>
                    <Td maxW="300px" isTruncated>{item.Meta_Description_1}</Td>
                    <Td isNumeric>{item.Word_Count}</Td>
                    <Td isNumeric>{item.Inlinks}</Td>
                    <Td isNumeric>{item.Outlinks}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </VStack>
    </Container>
  )
}

export default CrawlAnalysis 