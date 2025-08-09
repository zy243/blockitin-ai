import React, { useState, useEffect } from 'react'
import { Wallet, LogOut } from 'lucide-react'

const WalletConnect: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState('')

  const handleConnect = async () => {
    if (!(window as any).ethereum) {
      alert('MetaMask not detected. Please install MetaMask.')
      return
    }
    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
      }
    } catch (error) {
      console.error(error)
      alert('Wallet connection failed')
    }
  }

  useEffect(() => {
    const ethereum = (window as any).ethereum
    if (!ethereum) return
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setIsConnected(false)
        setAddress('')
      } else {
        setAddress(accounts[0])
        setIsConnected(true)
      }
    }
    ethereum.on?.('accountsChanged', handleAccountsChanged)
    return () => {
      ethereum.removeListener?.('accountsChanged', handleAccountsChanged)
    }
  }, [])

  const handleDisconnect = () => {
    setIsConnected(false)
    setAddress('')
  }

  return (
    <div>
      {!isConnected ? (
        <button
          onClick={handleConnect}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Wallet className="w-5 h-5" />
          <span className="hidden md:inline">Connect Wallet</span>
        </button>
      ) : (
        <div className="flex items-center space-x-3">
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <p className="text-sm font-mono text-gray-700">{address}</p>
          </div>
          <button
            onClick={handleDisconnect}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}

export default WalletConnect
