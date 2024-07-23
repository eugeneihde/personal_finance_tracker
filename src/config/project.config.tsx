import WebIcon from '@mui/icons-material/Web'
import BarChartIcon from '@mui/icons-material/BarChart'
import HomeIcon from '@mui/icons-material/Home'

export const navSpeedDialActions = [
  { icon: <HomeIcon />, name: 'Homepage', link: '/' },
  { icon: <WebIcon />, name: 'Dashboard', link: '/dashboard' },
  { icon: <BarChartIcon />, name: 'Statistics', link: '/dashboard/statistics' },
]

// Interfaces
export interface Transaction {
  id: number
  title: string
  date: string
  amount: number
  type: string
}

export interface TransactionData {
  type: 'income' | 'expense'
  title: string
  amount: string
  date: string
}

export interface ProfileDetails {
  displayName: string
  username: string
  currency: 'dollar' | 'euro'
}

// Functions
export const getDateNDaysAgo = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - days)

  return date
}

export const isValidDate = (date: any): date is Date => {
  return !isNaN(Date.parse(date))
}