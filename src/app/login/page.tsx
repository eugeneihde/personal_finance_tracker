'use client'

import {
  Alert,
  Box,
  Button,
  FormControl,
  FormGroup,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { signIn } from 'next-auth/react'
import { FormEvent, useEffect, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import styles from '@/assets/css/main.module.css'

const LoginPage = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)
  const [showLoginError, setShowLoginError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const autoLoginParam = urlParams.get('autoLogin')

    if (autoLoginParam !== null && autoLoginParam === 'failed') {
      setShowLoginError(true)
      setErrorMessage('Your Account was created but the Auto-Login failed! Please log in manually.')
    }
  }, [])

  const handleLoginSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsLoggingIn(true)
    setShowLoginError(false)
    setErrorMessage('')

    const loginResult = await signIn('credentials', {
      redirect: false,
      username,
      password
    })

    if (loginResult?.ok) {
      window.location.href = '/dashboard'
    } else {
      setShowLoginError(true)
      setErrorMessage('Invalid Username or Password!')
      setIsLoggingIn(false)
    }
  }

  return (
    <>
      <Box className={styles.main__container}>
        <Box className={styles.form_header__container}>
          <Typography variant='h3'>Login into your Account</Typography>
        </Box>
        {showLoginError &&
          <Box className={styles.alert_general__container}>
            <Alert
              className={styles.error_general__container}
              severity='error'
            >
              {errorMessage}
            </Alert>
          </Box>
        }
        <Box className={styles.form_components__container}>
          <FormGroup className={styles.form_components__formgroup}>
            <FormControl fullWidth>
              <TextField
                required
                type='text'
                label='Username'
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                required
                type={showPassword ? 'text' : 'password'}
                label='Password'
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => setShowPassword((prevState) => !prevState)}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
            <Button
              type='submit'
              disabled={
                isLoggingIn ||
                username === '' ||
                password === ''
              }
              variant='contained'
              onClick={handleLoginSubmit}
            >
              {!isLoggingIn ?
                'Login'
              :
                <ThreeDots
                  height='25px'
                  width='50px'
                  color='white'
                />
              }
            </Button>
          </FormGroup>
        </Box>
      </Box>
    </>
  )
}

export default LoginPage