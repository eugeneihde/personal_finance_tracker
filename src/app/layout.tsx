import { CssBaseline, ThemeProvider, Typography } from '@mui/material'
import type { Metadata } from 'next'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

import { themeProviderConfig } from '@/config/theme.config'
import { testConnection } from '@/db/sequelize'
import IRootLayout from '@/components/layouts/IRootLayout'


export const metadata: Metadata = {
  title: 'Personal Finance Tracker',
  authors: [
    { name: 'Eugene Ihde', url: 'https://github.com/eugeneihde' }
  ]
}

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang='en'>
      <body>
        <ThemeProvider theme={themeProviderConfig}>
          <CssBaseline />
          {await testConnection() ?
            <>
              <IRootLayout children={children} />
            </>
          :
            <Typography variant='h1'>Error while connecting to database…</Typography>
          }
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout