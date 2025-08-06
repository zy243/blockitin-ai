import { v4 as uuidv4 } from 'uuid'
import { GoogleSheetsService } from './GoogleSheetsService'

export interface SearchQuery {
  q: string
  userId: string
  sections?: string[]
  sortBy?: 'relevance' | 'date' | 'popularity'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
  dateRange?: {
    from: string
    to: string
  }
}

export interface SearchFilters {
  userId: string
  query: string
  sections: string[]
  types: string[]
  dateRange?: {
    from: string
    to: string
  }
  status?: string[]
  priority?: string[]
  tags?: string[]
  authors?: string[]
  institutions?: string[]
}

export interface SearchResult {
  id: string
  type: string
  section: string
  title: string
  description: string
  content?: string
  relevanceScore: number
  metadata: {
    date?: string
    author?: string
    status?: string
    tags?: string[]
    url?: string
  }
  highlights: string[]
}

export interface SearchAnalytics {
  userId: string
  period: number
  totalSearches: number
  uniqueQueries: number
  averageResultsPerSearch: number
  mostSearchedSections: Array<{
    section: string
    count: number
    percentage: number
  }>
  topQueries: Array<{
    query: string
    count: number
    avgRelevance: number
  }>
  searchTrends: Array<{
    date: string
    searches: number
    uniqueUsers: number
  }>
  clickThroughRates: {
    overall: number
    bySection: Record<string, number>
  }
}

export class SearchService {
  private sheetsService: GoogleSheetsService
  private searchIndex: Map<string, SearchResult[]> = new Map()

  constructor() {
    this.sheetsService = new GoogleSheetsService()
    this.initializeSearchIndex()
  }

  private async initializeSearchIndex() {
    // Initialize with mock data - in production, this would load from database
    const mockData = this.generateMockSearchData()
    this.searchIndex.set('default_user', mockData)
  }

  private generateMockSearchData(): SearchResult[] {
    return [
      // NFT Credentials
      {
        id: 'cred-1',
        type: 'credential',
        section: 'credentials',
        title: 'Bachelor of Computer Science',
        description: 'MIT Computer Science Degree - Blockchain Verified',
        content: 'Computer Science degree from Massachusetts Institute of Technology with focus on AI and Machine Learning',
        relevanceScore: 0.95,
        metadata: {
          date: '2024-05-15',
          author: 'MIT',
          status: 'verified',
          tags: ['degree', 'computer-science', 'mit', 'blockchain'],
          url: '/dashboard/credentials/cred-1'
        },
        highlights: ['Computer Science', 'MIT', 'verified']
      },
      {
        id: 'cred-2',
        type: 'certification',
        section: 'credentials',
        title: 'AWS Solutions Architect',
        description: 'Amazon Web Services Solutions Architect Certification',
        content: 'Professional certification in cloud architecture and AWS services',
        relevanceScore: 0.88,
        metadata: {
          date: '2024-03-20',
          author: 'Amazon Web Services',
          status: 'verified',
          tags: ['certification', 'aws', 'cloud', 'architecture'],
          url: '/dashboard/credentials/cred-2'
        },
        highlights: ['AWS', 'Solutions Architect', 'cloud']
      },
      // Assignments
      {
        id: 'assign-1',
        type: 'assignment',
        section: 'assignments',
        title: 'Machine Learning Final Project',
        description: 'Deep learning model for student performance prediction',
        content: 'Final project implementing neural networks for educational analytics using TensorFlow and Python',
        relevanceScore: 0.92,
        metadata: {
          date: '2024-01-20',
          status: 'in_progress',
          tags: ['machine-learning', 'python', 'tensorflow', 'final-project'],
          url: '/dashboard/assignments/assign-1'
        },
        highlights: ['Machine Learning', 'neural networks', 'TensorFlow']
      },
      // Health Records
      {
        id: 'health-1',
        type: 'vaccination',
        section: 'health',
        title: 'COVID-19 Vaccination Record',
        description: 'Complete COVID-19 vaccination series',
        content: 'Pfizer-BioNTech COVID-19 vaccine series completed at Campus Health Center',
        relevanceScore: 0.85,
        metadata: {
          date: '2024-01-15',
          author: 'Campus Health Center',
          status: 'verified',
          tags: ['vaccination', 'covid-19', 'pfizer', 'health'],
          url: '/dashboard/health/health-1'
        },
        highlights: ['COVID-19', 'vaccination', 'Pfizer']
      },
      // Publications
      {
        id: 'pub-1',
        type: 'publication',
        section: 'publishing',
        title: 'Deep Learning Approaches for Student Performance Prediction',
        description: 'Research paper on AI in education',
        content: 'Comprehensive study on using deep learning models to predict and improve student academic outcomes',
        relevanceScore: 0.90,
        metadata: {
          date: '2024-01-15',
          author: 'Sarah Johnson, Dr. Michael Chen',
          status: 'published',
          tags: ['deep-learning', 'education', 'ai', 'research'],
          url: '/dashboard/publishing/pub-1'
        },
        highlights: ['Deep Learning', 'Student Performance', 'AI']
      },
      // Resume
      {
        id: 'resume-1',
        type: 'resume',
        section: 'resume',
        title: 'AI-Generated Resume',
        description: 'Professional resume optimized for tech roles',
        content: 'Computer Science graduate resume with focus on AI/ML and full-stack development experience',
        relevanceScore: 0.87,
        metadata: {
          date: '2024-01-15',
          status: 'active',
          tags: ['resume', 'ai-generated', 'tech', 'computer-science'],
          url: '/dashboard/resume'
        },
        highlights: ['AI-Generated', 'tech roles', 'Computer Science']
      },
      // Campus Locations
      {
        id: 'loc-1',
        type: 'location',
        section: 'map',
        title: 'Stata Center',
        description: 'Computer Science and AI Laboratory',
        content: 'Main building for Computer Science department with AI lab, study rooms, and cafeteria',
        relevanceScore: 0.83,
        metadata: {
          tags: ['building', 'computer-science', 'ai-lab', 'study-rooms'],
          url: '/dashboard/map/loc-1'
        },
        highlights: ['Stata Center', 'Computer Science', 'AI Laboratory']
      },
      // Academic Results
      {
        id: 'result-1',
        type: 'grade',
        section: 'results',
        title: 'Machine Learning Course Grade',
        description: 'CS 6.867 - Grade: A (4.0 GPA)',
        content: 'Advanced Machine Learning course with Dr. Johnson covering neural networks, deep learning, and AI applications',
        relevanceScore: 0.89,
        metadata: {
          date: '2023-12-15',
          author: 'Dr. Johnson',
          status: 'completed',
          tags: ['grade', 'machine-learning', 'cs-6867', 'a-grade'],
          url: '/dashboard/results/result-1'
        },
        highlights: ['Machine Learning', 'Grade: A', 'neural networks']
      }
    ]
  }

  // ===== ADVANCED SEARCH =====
  async advancedSearch(params: SearchQuery): Promise<any> {
    const { q, userId, sections = [], sortBy = 'relevance', sortOrder = 'desc', limit = 20, offset = 0 } = params

    // Log search activity
    await this.sheetsService.sendToSheets({
      action: 'advanced_search',
      data: { 
        query: q, 
        sections, 
        sortBy, 
        sortOrder, 
        limit, 
        offset,
        timestamp: new Date().toISOString() 
      },
      userId,
      timestamp: new Date().toISOString(),
      source: 'Search Backend'
    })

    const userIndex = this.searchIndex.get(userId) || []
    let results = userIndex.filter(item => {
      // Text matching
      const searchText = `${item.title} ${item.description} ${item.content || ''}`.toLowerCase()
      const queryMatch = q.toLowerCase().split(' ').some(term => searchText.includes(term))
      
      // Section filtering
      const sectionMatch = sections.length === 0 || sections.includes(item.section)
      
      return queryMatch && sectionMatch
    })

    // Update relevance scores based on query
    results = results.map(item => ({
      ...item,
      relevanceScore: this.calculateRelevanceScore(item, q)
    }))

    // Sorting
    results.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'relevance':
          comparison = b.relevanceScore - a.relevanceScore
          break
        case 'date':
          const dateA = new Date(a.metadata.date || '1970-01-01').getTime()
          const dateB = new Date(b.metadata.date || '1970-01-01').getTime()
          comparison = dateB - dateA
          break
        case 'popularity':
          comparison = Math.random() - 0.5 // Mock popularity
          break
      }
      return sortOrder === 'desc' ? comparison : -comparison
    })

    // Pagination
    const paginatedResults = results.slice(offset, offset + limit)

    return {
      query: q,
      total: results.length,
      limit,
      offset,
      results: paginatedResults,
      facets: this.generateFacets(results),
      searchTime: Math.random() * 100 + 50, // Mock search time in ms
      suggestions: await this.getQuerySuggestions(q)
    }
  }

  private calculateRelevanceScore(item: SearchResult, query: string): number {
    const queryTerms = query.toLowerCase().split(' ')
    const title = item.title.toLowerCase()
    const description = item.description.toLowerCase()
    const content = (item.content || '').toLowerCase()
    
    let score = 0
    
    queryTerms.forEach(term => {
      if (title.includes(term)) score += 3
      if (description.includes(term)) score += 2
      if (content.includes(term)) score += 1
      if (item.metadata.tags?.some(tag => tag.includes(term))) score += 1.5
    })
    
    return Math.min(score / (queryTerms.length * 3), 1) // Normalize to 0-1
  }

  private generateFacets(results: SearchResult[]) {
    const sections: Record<string, number> = {}
    const types: Record<string, number> = {}
    const tags: Record<string, number> = {}
    
    results.forEach(item => {
      sections[item.section] = (sections[item.section] || 0) + 1
      types[item.type] = (types[item.type] || 0) + 1
      item.metadata.tags?.forEach(tag => {
        tags[tag] = (tags[tag] || 0) + 1
      })
    })
    
    return { sections, types, tags }
  }

  // ===== SEARCH SUGGESTIONS =====
  async getSearchSuggestions(query: string, limit: number, userId: string): Promise<any> {
    const suggestions = [
      'machine learning',
      'computer science',
      'assignments',
      'health records',
      'vaccination',
      'resume',
      'grades',
      'publications',
      'campus map',
      'attendance',
      'wellness',
      'credentials',
      'blockchain',
      'AI projects',
      'study rooms'
    ]

    const filtered = suggestions
      .filter(s => s.toLowerCase().includes(query.toLowerCase()))
      .slice(0, limit)

    return {
      query,
      suggestions: filtered.map(s => ({
        text: s,
        type: 'suggestion',
        count: Math.floor(Math.random() * 100) + 1
      }))
    }
  }

  private async getQuerySuggestions(query: string): Promise<string[]> {
    // Mock query suggestions based on current query
    const suggestions = [
      `${query} projects`,
      `${query} courses`,
      `${query} research`,
      `${query} assignments`,
      `${query} grades`
    ]
    
    return suggestions.slice(0, 3)
  }

  // ===== FILTERED SEARCH =====
  async searchWithFilters(filters: SearchFilters): Promise<any> {
    const { userId, query, sections, types, dateRange, status, tags } = filters

    await this.sheetsService.sendToSheets({
      action: 'filtered_search',
      data: { ...filters, timestamp: new Date().toISOString() },
      userId,
      timestamp: new Date().toISOString(),
      source: 'Search Backend'
    })

    const userIndex = this.searchIndex.get(userId) || []
    let results = userIndex.filter(item => {
      // Basic query match
      const searchText = `${item.title} ${item.description} ${item.content || ''}`.toLowerCase()
      const queryMatch = !query || query.toLowerCase().split(' ').some(term => searchText.includes(term))
      
      // Filter by sections
      const sectionMatch = sections.length === 0 || sections.includes(item.section)
      
      // Filter by types
      const typeMatch = types.length === 0 || types.includes(item.type)
      
      // Filter by status
      const statusMatch = !status || status.length === 0 || status.includes(item.metadata.status || '')
      
      // Filter by tags
      const tagMatch = !tags || tags.length === 0 || tags.some(tag => 
        item.metadata.tags?.includes(tag)
      )
      
      // Filter by date range
      let dateMatch = true
      if (dateRange && item.metadata.date) {
        const itemDate = new Date(item.metadata.date)
        const fromDate = new Date(dateRange.from)
        const toDate = new Date(dateRange.to)
        dateMatch = itemDate >= fromDate && itemDate <= toDate
      }
      
      return queryMatch && sectionMatch && typeMatch && statusMatch && tagMatch && dateMatch
    })

    return {
      query,
      filters,
      total: results.length,
      results: results.slice(0, 50), // Limit results
      appliedFilters: {
        sections: sections.length,
        types: types.length,
        status: status?.length || 0,
        tags: tags?.length || 0,
        dateRange: !!dateRange
      }
    }
  }

  // ===== SEARCH ANALYTICS =====
  async getSearchAnalytics(userId: string, days: number): Promise<SearchAnalytics> {
    return {
      userId,
      period: days,
      totalSearches: 156,
      uniqueQueries: 89,
      averageResultsPerSearch: 12.4,
      mostSearchedSections: [
        { section: 'assignments', count: 45, percentage: 28.8 },
        { section: 'credentials', count: 32, percentage: 20.5 },
        { section: 'health', count: 28, percentage: 17.9 },
        { section: 'results', count: 24, percentage: 15.4 },
        { section: 'resume', count: 18, percentage: 11.5 }
      ],
      topQueries: [
        { query: 'machine learning', count: 23, avgRelevance: 0.87 },
        { query: 'assignments', count: 19, avgRelevance: 0.92 },
        { query: 'health records', count: 15, avgRelevance: 0.85 },
        { query: 'grades', count: 12, avgRelevance: 0.89 },
        { query: 'resume', count: 11, avgRelevance: 0.83 }
      ],
      searchTrends: Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        searches: Math.floor(Math.random() * 20) + 5,
        uniqueUsers: Math.floor(Math.random() * 10) + 1
      })),
      clickThroughRates: {
        overall: 0.73,
        bySection: {
          assignments: 0.85,
          credentials: 0.78,
          health: 0.71,
          results: 0.82,
          resume: 0.69,
          publishing: 0.64,
          map: 0.58
        }
      }
    }
  }

  // ===== POPULAR SEARCHES =====
  async getPopularSearches(limit: number, days: number): Promise<any> {
    const popular = [
      { query: 'machine learning', count: 89, trend: 'up' },
      { query: 'assignments due', count: 67, trend: 'up' },
      { query: 'health records', count: 54, trend: 'stable' },
      { query: 'resume builder', count: 43, trend: 'up' },
      { query: 'campus map', count: 38, trend: 'down' },
      { query: 'grades', count: 35, trend: 'stable' },
      { query: 'publications', count: 29, trend: 'up' },
      { query: 'attendance', count: 24, trend: 'stable' },
      { query: 'wellness tracker', count: 21, trend: 'up' },
      { query: 'blockchain credentials', count: 18, trend: 'up' }
    ]

    return {
      period: days,
      total: popular.length,
      searches: popular.slice(0, limit)
    }
  }

  // ===== SEARCH HISTORY =====
  async getSearchHistory(userId: string, limit: number): Promise<any> {
    const history = [
      {
        id: 'search-1',
        query: 'machine learning assignments',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        resultsCount: 8,
        sections: ['assignments', 'results']
      },
      {
        id: 'search-2',
        query: 'health vaccination records',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        resultsCount: 3,
        sections: ['health']
      },
      {
        id: 'search-3',
        query: 'resume optimization',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        resultsCount: 12,
        sections: ['resume']
      }
    ]

    return {
      userId,
      total: history.length,
      history: history.slice(0, limit)
    }
  }

  async clearSearchHistory(userId: string): Promise<any> {
    await this.sheetsService.sendToSheets({
      action: 'clear_search_history',
      data: { userId, timestamp: new Date().toISOString() },
      userId,
      timestamp: new Date().toISOString(),
      source: 'Search Backend'
    })

    return {
      userId,
      cleared: true,
      message: 'Search history cleared successfully'
    }
  }

  // ===== SAVED SEARCHES =====
  async saveSearch(userId: string, query: string, filters: any, name?: string): Promise<any> {
    const searchId = uuidv4()
    
    await this.sheetsService.sendToSheets({
      action: 'save_search',
      data: { searchId, userId, query, filters, name, timestamp: new Date().toISOString() },
      userId,
      timestamp: new Date().toISOString(),
      source: 'Search Backend'
    })

    return {
      id: searchId,
      name: name || `Search: ${query}`,
      query,
      filters,
      savedAt: new Date().toISOString(),
      message: 'Search saved successfully'
    }
  }

  async getSavedSearches(userId: string): Promise<any> {
    const saved = [
      {
        id: 'saved-1',
        name: 'ML Assignments',
        query: 'machine learning assignments',
        filters: { sections: ['assignments'], types: ['assignment'] },
        savedAt: '2024-01-10T10:30:00Z',
        lastUsed: '2024-01-15T14:20:00Z'
      },
      {
        id: 'saved-2',
        name: 'Health Records',
        query: 'vaccination health',
        filters: { sections: ['health'], types: ['vaccination', 'checkup'] },
        savedAt: '2024-01-08T09:15:00Z',
        lastUsed: '2024-01-14T11:45:00Z'
      }
    ]

    return {
      userId,
      total: saved.length,
      searches: saved
    }
  }

  async deleteSavedSearch(searchId: string): Promise<any> {
    await this.sheetsService.sendToSheets({
      action: 'delete_saved_search',
      data: { searchId, timestamp: new Date().toISOString() },
      userId: 'system',
      timestamp: new Date().toISOString(),
      source: 'Search Backend'
    })

    return {
      id: searchId,
      deleted: true,
      message: 'Saved search deleted successfully'
    }
  }

  // ===== SEARCH INDEXING =====
  async rebuildSearchIndex(userId: string, sections?: string[]): Promise<any> {
    await this.sheetsService.sendToSheets({
      action: 'rebuild_search_index',
      data: { userId, sections, timestamp: new Date().toISOString() },
      userId,
      timestamp: new Date().toISOString(),
      source: 'Search Backend'
    })

    // Simulate index rebuild
    const mockData = this.generateMockSearchData()
    this.searchIndex.set(userId, mockData)

    return {
      userId,
      sections: sections || 'all',
      indexedItems: mockData.length,
      rebuildTime: Math.random() * 5000 + 1000, // Mock rebuild time in ms
      message: 'Search index rebuilt successfully'
    }
  }

  // ===== SEARCH EXPORT =====
  async exportSearchResults(userId: string, query: string, filters: any, format: string): Promise<any> {
    const exportId = uuidv4()
    
    await this.sheetsService.sendToSheets({
      action: 'export_search_results',
      data: { exportId, userId, query, filters, format, timestamp: new Date().toISOString() },
      userId,
      timestamp: new Date().toISOString(),
      source: 'Search Backend'
    })

    return {
      exportId,
      query,
      format,
      downloadUrl: `/api/search/export/${exportId}/download`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      message: 'Search results export prepared successfully'
    }
  }
}
