import axios from 'axios'

export interface SheetsRequest {
  action: string
  data: any
  userId: string
  timestamp: string
  source: string
}

export interface SheetsResponse {
  success: boolean
  message?: string
  data?: any
  error?: string
}

export class GoogleSheetsService {
  private readonly webhookUrl: string

  constructor() {
    this.webhookUrl = process.env.GOOGLE_APPS_SCRIPT_URL || ''
    
    if (!this.webhookUrl) {
      console.warn('Google Apps Script URL not configured')
    }
  }

  async sendToSheets(request: SheetsRequest): Promise<SheetsResponse> {
    if (!this.webhookUrl) {
      return {
        success: false,
        error: 'Google Apps Script URL not configured'
      }
    }

    try {
      console.log('Sending to Google Sheets:', {
        url: this.webhookUrl,
        action: request.action,
        userId: request.userId
      })

      const response = await axios.post(this.webhookUrl, request, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 second timeout
      })

      console.log('Google Sheets response:', response.status, response.statusText)

      return {
        success: true,
        message: 'Data successfully sent to Google Sheets',
        data: response.data
      }
    } catch (error) {
      console.error('Google Sheets error:', error.message)
      
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: `HTTP ${error.response?.status}: ${error.response?.statusText || error.message}`
        }
      }

      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      }
    }
  }

  async getFromSheets(action: string, params?: any): Promise<SheetsResponse> {
    if (!this.webhookUrl) {
      return {
        success: false,
        error: 'Google Apps Script URL not configured'
      }
    }

    try {
      const queryParams = new URLSearchParams({
        action,
        ...params
      })

      console.log('Getting from Google Sheets:', {
        url: `${this.webhookUrl}?${queryParams}`,
        action
      })

      const response = await axios.get(`${this.webhookUrl}?${queryParams}`, {
        timeout: 10000
      })

      return {
        success: true,
        message: 'Data retrieved from Google Sheets',
        data: response.data
      }
    } catch (error) {
      console.error('Google Sheets GET error:', error.message)
      
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: `HTTP ${error.response?.status}: ${error.response?.statusText || error.message}`
        }
      }

      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      }
    }
  }

  async testConnection(): Promise<SheetsResponse> {
    return await this.sendToSheets({
      action: 'test_connection',
      data: {
        test: true,
        timestamp: new Date().toISOString(),
        source: 'Backend Connection Test'
      },
      userId: 'system',
      timestamp: new Date().toISOString(),
      source: 'Blockitin AI Chatbot Backend'
    })
  }
}
