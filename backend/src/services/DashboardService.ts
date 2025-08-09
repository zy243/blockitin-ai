import { GoogleSheetsService } from './GoogleSheetsService';
import { mockDatabase, Credential, HealthRecord, Publication, Assignment } from './mockDatabase';

function simpleUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export interface DashboardOverview {
  userId: string;
  stats: {
    nftCredentials: number;
    resumeViews: number;
    healthRecords: number;
    wellnessScore: number;
    assignments: number;
    publications: number;
    attendanceRate: number;
    gpa: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    time: string;
    section: string;
  }>;
  quickActions: Array<{
    id: string;
    title: string;
    description: string;
    action: string;
    section: string;
  }>;
}

export class DashboardService {
  private sheetsService: GoogleSheetsService;

  constructor() {
    this.sheetsService = new GoogleSheetsService();
  }

  // ===== DASHBOARD OVERVIEW =====
  async getDashboardOverview(userId: string): Promise<DashboardOverview> {
    await this.sheetsService.sendToSheets({
      action: 'dashboard_access',
      data: { userId, section: 'overview', timestamp: new Date().toISOString() },
      userId,
      timestamp: new Date().toISOString(),
      source: 'Dashboard Backend'
    });

    const userCredentials = Array.from(mockDatabase.credentials.values()).filter(c => c.userId === userId);
    const userHealthRecords = Array.from(mockDatabase.healthRecords.values()).filter(h => h.userId === userId);
    const userAssignments = Array.from(mockDatabase.assignments.values()).filter(a => a.userId === userId);
    const userPublications = Array.from(mockDatabase.publications.values()).filter(p => p.userId === userId);
    const userAttendance = Array.from(mockDatabase.attendance.values()).filter(a => a.userId === userId);

    return {
      userId,
      stats: {
        nftCredentials: userCredentials.length,
        resumeViews: 234, // Mocked
        healthRecords: userHealthRecords.length,
        wellnessScore: 85, // Mocked
        assignments: userAssignments.length,
        publications: userPublications.length,
        attendanceRate: userAttendance.length > 0 ? (userAttendance.filter(a => a.status === 'present').length / userAttendance.length) * 100 : 0,
        gpa: 3.85 // Mocked
      },
      recentActivity: [
        {
          id: 'activity-1',
          type: 'credential',
          title: 'Computer Science Degree NFT Minted',
          time: '2 hours ago',
          section: 'credentials'
        }
      ],
      quickActions: [
        {
          id: 'action-1',
          title: 'Mint New Credential',
          description: 'Convert your achievements to NFTs',
          action: 'mint_credential',
          section: 'credentials'
        }
      ]
    };
  }

  // ===== NFT CREDENTIALS =====
  async getCredentials(userId: string) {
    const userCredentials = Array.from(mockDatabase.credentials.values()).filter(c => c.userId === userId);
    return {
      total: userCredentials.length,
      verified: userCredentials.filter(c => c.status === 'verified').length,
      pending: userCredentials.filter(c => c.status === 'pending').length,
      credentials: userCredentials
    };
  }

  async mintCredential(data: any) {
    const credentialId = simpleUUID();
    const newCredential: Credential = {
      id: credentialId,
      userId: data.userId,
      title: data.title,
      institution: data.institution,
      date: data.date,
      type: data.type,
      status: 'minting',
      views: 0
    };
    mockDatabase.credentials.set(credentialId, newCredential);

    // Simulate minting process
    // @ts-ignore
    setTimeout(() => {
      const mintedCredential = mockDatabase.credentials.get(credentialId);
      if (mintedCredential) {
        mintedCredential.status = 'verified';
        mintedCredential.nftAddress = `0x${simpleUUID().replace(/-/g, '')}`;
        mintedCredential.ipfsHash = `Qm${simpleUUID().replace(/-/g, '')}`;
      }
    }, 30000); // 30 seconds delay

    return {
      id: credentialId,
      status: 'minting',
      transactionHash: '0xabcd1234...',
      estimatedTime: '30 seconds',
      message: 'NFT credential is being minted on the blockchain'
    };
  }

  async verifyCredential(credentialId: string) {
    const credential = mockDatabase.credentials.get(credentialId);
    if (credential && credential.status === 'verified') {
      return {
        id: credentialId,
        verified: true,
        verificationDate: new Date().toISOString(),
        blockchainHash: credential.nftAddress,
        issuer: credential.institution,
        recipient: '0x1111...2222'
      };
    }
    return { id: credentialId, verified: false };
  }

  // ===== AI RESUME BUILDER =====
  async getResume(userId: string) {
    // This part will remain mostly mocked as it depends on external AI services.
    // However, we can pull some data from our mock DB.
    const user = mockDatabase.users.get(userId);
    const userCredentials = Array.from(mockDatabase.credentials.values()).filter(c => c.userId === userId && c.type === 'degree');
    const education = userCredentials.map(c => ({
        degree: c.title,
        institution: c.institution,
        year: new Date(c.date).getFullYear().toString(),
        gpa: '3.85/4.0' // Mocked
    }));

    return {
        id: 'resume-1',
        userId,
        // ... other resume data
        personalInfo: {
            name: user?.name,
            email: user?.email,
            // ...
        },
        education,
        // ...
    }
  }

  async generateResume(data: any) {
    const resumeId = simpleUUID();
    // AI generation is mocked
    return {
      id: resumeId,
      status: 'generated',
      aiSuggestions: [
        'Added quantified achievements to increase impact',
        'Optimized keywords for ATS compatibility',
      ],
      downloadUrl: `/api/dashboard/resume/${resumeId}/download`,
    };
  }

  async optimizeResume(userId: string, jobDescription: string, resumeData: any) {
    // AI optimization is mocked
    return {
      matchScore: 87,
      optimizations: [
        'Added "cloud computing" keyword 3 times',
      ],
      missingKeywords: ['Docker', 'Kubernetes'],
    };
  }


  // ===== HEALTH PASSPORT =====
  async getHealthRecords(userId: string) {
    const userHealthRecords = Array.from(mockDatabase.healthRecords.values()).filter(h => h.userId === userId);
    return {
      userId,
      totalRecords: userHealthRecords.length,
      wellnessScore: 85, // Mocked
      lastCheckup: '2024-01-10', // Mocked
      records: userHealthRecords
    };
  }

  async uploadHealthRecord(data: any) {
    const recordId = simpleUUID();
    const newRecord: HealthRecord = {
        id: recordId,
        userId: data.userId,
        type: data.type,
        title: data.title,
        date: data.date,
        provider: data.provider,
        status: 'uploaded',
        shared: false,
        encrypted: true,
        ipfsHash: `Qm${simpleUUID().replace(/-/g, '')}`
    };
    mockDatabase.healthRecords.set(recordId, newRecord);

    return {
      id: recordId,
      status: 'uploaded',
      encrypted: true,
      ipfsHash: newRecord.ipfsHash,
      message: 'Health record uploaded and encrypted successfully'
    };
  }

  async shareHealthRecord(recordId: string, shareWith: string, permissions: string[]) {
    const record = mockDatabase.healthRecords.get(recordId);
    if(record){
        record.shared = true;
    }
    return {
      shareId: simpleUUID(),
      recordId,
      sharedWith: shareWith,
      permissions,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      accessLink: `https://health.blockitin.ai/shared/${recordId}`
    };
  }

  async calculateWellnessScore(userId: string) {
    const userWellnessData = Array.from(mockDatabase.wellnessCheckins.values()).filter(w => w.userId === userId);
    if (userWellnessData.length === 0) {
        return { userId, currentScore: 0, previousScore: 0, trend: 'no_data' };
    }
    const latestWellness = userWellnessData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const score = Math.floor((latestWellness.mood + latestWellness.energy + (6 - latestWellness.stress) + latestWellness.sleep) / 4 * 20);
    return {
      userId,
      currentScore: score,
      previousScore: score - 5, // Mocked
      trend: 'improving', // Mocked
    };
  }

  // ===== MOOD & WELLNESS TRACKER =====
  async getWellnessData(userId: string, days: number) {
    const userWellnessData = Array.from(mockDatabase.wellnessCheckins.values()).filter(w => w.userId === userId);
    return {
      userId,
      period: days,
      averageScore: 85, // Mocked
      checkins: userWellnessData,
    };
  }

  async recordWellnessCheckin(data: any) {
    const checkinId = simpleUUID();
    const newCheckin = {
      id: checkinId,
      userId: data.userId,
      date: new Date().toISOString(),
      mood: data.mood,
      energy: data.energy,
      stress: data.stress,
      sleep: data.sleep,
      notes: data.notes
    };
    mockDatabase.wellnessCheckins.set(checkinId, newCheckin);
    const wellnessScore = Math.floor((data.mood + data.energy + (6 - data.stress) + data.sleep) / 4 * 20);
    return {
      id: checkinId,
      status: 'recorded',
      wellnessScore,
      message: 'Wellness check-in recorded successfully'
    };
  }

  // ===== ATTENDANCE LOG =====
  async getAttendanceLog(userId: string, semester: string) {
      const userAttendance = Array.from(mockDatabase.attendance.values()).filter(a => a.userId === userId);
      return {
          userId,
          semester,
          overallRate: userAttendance.length > 0 ? (userAttendance.filter(a => a.status === 'present').length / userAttendance.length) * 100 : 0,
          totalClasses: userAttendance.length,
          attended: userAttendance.filter(a => a.status === 'present').length,
          courses: [], // Mocked
          recentAttendance: userAttendance.slice(-5)
      };
  }

  async recordAttendance(data: any) {
    const attendanceId = simpleUUID();
    const newAttendance = {
        id: attendanceId,
        userId: data.userId,
        course: data.course,
        date: data.date,
        time: data.time,
        status: data.status,
    };
    mockDatabase.attendance.set(attendanceId, newAttendance);
    return {
      id: attendanceId,
      status: 'recorded',
      course: data.course,
      date: data.date,
      message: 'Attendance recorded successfully'
    };
  }

  // ===== ACADEMIC PUBLISHING =====
  async getPublications(userId: string) {
    const userPublications = Array.from(mockDatabase.publications.values()).filter(p => p.userId === userId);
    return {
        userId,
        totalPublications: userPublications.length,
        publications: userPublications
    };
  }

  async submitPublication(data: any) {
    const publicationId = simpleUUID();
    const newPublication: Publication = {
        id: publicationId,
        userId: data.userId,
        title: data.title,
        authors: data.authors,
        journal: data.journal,
        status: 'submitted',
        date: new Date().toISOString(),
        citations: 0
    };
    mockDatabase.publications.set(publicationId, newPublication);
    return {
      id: publicationId,
      status: 'submitted',
      submissionDate: new Date().toISOString(),
      message: 'Publication submitted successfully'
    };
  }

  // ===== WALLET CONNECTION =====
  async getWalletInfo(userId: string) {
    return {
      userId,
      connected: true,
      address: '0x1234567890abcdef1234567890abcdef12345678',
      network: 'Ethereum Mainnet',
      balance: {
        eth: '2.45',
        tokens: [
          { symbol: 'USDC', balance: '1,250.00', value: '$1,250.00' },
          { symbol: 'LINK', balance: '45.2', value: '$678.30' }
        ]
      },
      nfts: 12,
      transactions: [
        {
          hash: '0xabcd1234...',
          type: 'NFT Mint',
          amount: '0.05 ETH',
          date: '2024-01-15T10:30:00Z',
          status: 'confirmed'
        }
      ]
    }
  }

  async connectWallet(data: any) {
    await this.sheetsService.sendToSheets({
      action: 'connect_wallet',
      data: { ...data, timestamp: new Date().toISOString() },
      userId: data.userId,
      timestamp: new Date().toISOString(),
      source: 'Dashboard Backend'
    })

    return {
      status: 'connected',
      address: data.address,
      network: data.network,
      message: 'Wallet connected successfully'
    }
  }

  // ===== ASSIGNMENT TRACKER =====
  async getAssignments(userId: string, status: string) {
    let userAssignments = Array.from(mockDatabase.assignments.values()).filter(a => a.userId === userId);
    if (status !== 'all') {
        userAssignments = userAssignments.filter(a => a.status === status);
    }
    return {
      userId,
      total: userAssignments.length,
      assignments: userAssignments
    };
  }

  async createAssignment(data: any) {
    const assignmentId = simpleUUID();
    const newAssignment: Assignment = {
        id: assignmentId,
        userId: data.userId,
        title: data.title,
        course: data.course,
        dueDate: data.dueDate,
        status: 'not_started',
        priority: data.priority,
        progress: 0,
        estimatedHours: data.estimatedHours,
        spentHours: 0
    };
    mockDatabase.assignments.set(assignmentId, newAssignment);
    return {
      id: assignmentId,
      ...newAssignment,
      message: 'Assignment created successfully'
    };
  }

  async updateAssignment(assignmentId: string, updates: any) {
    const assignment = mockDatabase.assignments.get(assignmentId);
    if (assignment) {
        Object.assign(assignment, updates);
    }
    return {
      id: assignmentId,
      ...assignment,
      message: 'Assignment updated successfully'
    };
  }

  // ===== CAMPUS MAP =====
  async getCampusLocations(category: string) {
    const allLocations = [
      {
        id: 'loc-1',
        name: 'Stata Center',
        category: 'academic',
        coordinates: { lat: 42.361145, lng: -71.090240 },
        description: 'Computer Science and AI Lab',
        amenities: ['WiFi', 'Study Rooms', 'Cafeteria'],
        hours: '24/7'
      },
      {
        id: 'loc-2',
        name: 'Student Center',
        category: 'dining',
        coordinates: { lat: 42.359055, lng: -71.094520 },
        description: 'Main dining and social hub',
        amenities: ['Food Court', 'ATM', 'Bookstore'],
        hours: '6:00 AM - 11:00 PM'
      },
      {
        id: 'loc-3',
        name: 'Zesiger Sports Center',
        category: 'recreation',
        coordinates: { lat: 42.361234, lng: -71.087456 },
        description: 'Fitness and recreation facility',
        amenities: ['Gym', 'Pool', 'Courts'],
        hours: '5:00 AM - 12:00 AM'
      }
    ]

    const filteredLocations = category === 'all' 
      ? allLocations 
      : allLocations.filter(l => l.category === category)

    return {
      total: filteredLocations.length,
      category,
      locations: filteredLocations
    }
  }

  async getNavigation(data: any) {
    await this.sheetsService.sendToSheets({
      action: 'get_navigation',
      data: { ...data, timestamp: new Date().toISOString() },
      userId: data.userId,
      timestamp: new Date().toISOString(),
      source: 'Dashboard Backend'
    })

    return {
      from: data.from,
      to: data.to,
      distance: '0.3 miles',
      walkingTime: '6 minutes',
      route: [
        { lat: 42.361145, lng: -71.090240, instruction: 'Start at Stata Center' },
        { lat: 42.360500, lng: -71.091000, instruction: 'Head south on Vassar St' },
        { lat: 42.359055, lng: -71.094520, instruction: 'Arrive at Student Center' }
      ],
      landmarks: ['Stata Center', 'Building 32', 'Student Center']
    }
  }

  // ===== ACADEMIC RESULTS =====
  async getAcademicResults(userId: string, semester: string) {
    await this.sheetsService.sendToSheets({
      action: 'view_academic_results',
      data: { userId, semester, section: 'results' },
      userId,
      timestamp: new Date().toISOString(),
      source: 'Dashboard Backend'
    })

    return {
      userId,
      semester,
      overallGPA: 3.85,
      creditHours: 48,
      courses: [
        {
          id: 'course-1',
          code: 'CS 6.867',
          name: 'Machine Learning',
          credits: 12,
          grade: 'A',
          gpa: 4.0,
          professor: 'Dr. Johnson'
        },
        {
          id: 'course-2',
          code: 'CS 6.824',
          name: 'Distributed Systems',
          credits: 12,
          grade: 'A-',
          gpa: 3.7,
          professor: 'Dr. Smith'
        },
        {
          id: 'course-3',
          code: 'CS 6.046',
          name: 'Design and Analysis of Algorithms',
          credits: 12,
          grade: 'B+',
          gpa: 3.3,
          professor: 'Dr. Brown'
        },
        {
          id: 'course-4',
          code: 'CS 6.034',
          name: 'Artificial Intelligence',
          credits: 12,
          grade: 'A',
          gpa: 4.0,
          professor: 'Dr. Wilson'
        }
      ],
      semesterGPA: 3.75,
      cumulativeGPA: 3.85,
      rank: 15,
      totalStudents: 200
    }
  }

  async calculateGPA(userId: string, semester?: string) {
    return {
      userId,
      semester,
      semesterGPA: 3.75,
      cumulativeGPA: 3.85,
      creditHours: 48,
      qualityPoints: 184.8,
      calculation: {
        totalGradePoints: 184.8,
        totalCreditHours: 48,
        gpa: 3.85
      }
    }
  }

  async generateTranscript(userId: string, format: string) {
    await this.sheetsService.sendToSheets({
      action: 'generate_transcript',
      data: { userId, format, timestamp: new Date().toISOString() },
      userId,
      timestamp: new Date().toISOString(),
      source: 'Dashboard Backend'
    })

    return {
      userId,
      format,
      transcriptId: simpleUUID(),
      downloadUrl: `/api/dashboard/results/transcript/${userId}/download`,
      generatedAt: new Date().toISOString(),
      message: 'Transcript generated successfully'
    }
  }

  // ===== SEARCH FUNCTIONALITY =====
  async searchDashboard(query: string, category: string, userId: string) {
    await this.sheetsService.sendToSheets({
      action: 'dashboard_search',
      data: { query, category, userId, timestamp: new Date().toISOString() },
      userId,
      timestamp: new Date().toISOString(),
      source: 'Dashboard Backend'
    })

    // Mock search results across all sections
    const allResults = [
      {
        id: 'result-1',
        type: 'credential',
        title: 'Computer Science Degree',
        description: 'Bachelor of Computer Science from MIT',
        section: 'credentials',
        relevance: 0.95
      },
      {
        id: 'result-2',
        type: 'assignment',
        title: 'Machine Learning Final Project',
        description: 'Due January 20, 2024 - In Progress',
        section: 'assignments',
        relevance: 0.87
      },
      {
        id: 'result-3',
        type: 'health',
        title: 'COVID-19 Vaccination Record',
        description: 'Vaccination record from Campus Health Center',
        section: 'health',
        relevance: 0.76
      }
    ]

    const filteredResults = category === 'all' 
      ? allResults 
      : allResults.filter(r => r.type === category)

    return {
      query,
      category,
      total: filteredResults.length,
      results: filteredResults.sort((a, b) => b.relevance - a.relevance)
    }
  }

  // ===== ANALYTICS & REPORTING =====
  async getDashboardAnalytics(userId: string, days: number) {
    return {
      userId,
      period: days,
      overview: {
        totalSessions: 45,
        averageSessionTime: '12 minutes',
        mostUsedSection: 'assignments',
        totalActions: 234
      },
      sectionUsage: {
        credentials: 23,
        resume: 18,
        health: 15,
        wellness: 32,
        attendance: 12,
        publishing: 8,
        wallet: 6,
        assignments: 45,
        map: 14,
        results: 19,
        search: 28
      },
      trends: {
        dailyActive: Array.from({ length: days }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          sessions: Math.floor(Math.random() * 10) + 1
        }))
      }
    }
  }

  async exportDashboardData(userId: string, sections: string[], format: string) {
    await this.sheetsService.sendToSheets({
      action: 'export_dashboard_data',
      data: { userId, sections, format, timestamp: new Date().toISOString() },
      userId,
      timestamp: new Date().toISOString(),
      source: 'Dashboard Backend'
    })

    return {
      exportId: simpleUUID(),
      userId,
      sections,
      format,
      downloadUrl: `/api/dashboard/export/${userId}/download`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      message: 'Dashboard data export prepared successfully'
    }
  }
}
