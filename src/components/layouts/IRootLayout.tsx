'use client'

import { Container } from '@mui/material'
import INavbar from './INavbar'
import styles from '@/assets/css/main.module.css'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const IRootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <SessionProvider>
        <INavbar />
        <ToastContainer />
        <Container className={styles.root__container}>
          {children}
        </Container>
      </SessionProvider>
    </>
  )
}

export default IRootLayout