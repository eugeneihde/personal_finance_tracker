'use client'

import {
  Box,
  Alert,
  Button,
  FormControl,
  FormGroup,
  TextField,
  Typography,
  InputAdornment,
  IconButton
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { FormEvent, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import { signIn } from 'next-auth/react'
import axios from 'axios'
import styles from '@/assets/css/main.module.css'

const SignupPage = () => {
  const [displayName, setDisplayName] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showSignupError, setShowSignupError] = useState<boolean>(false)
  const [signupErrorMessage, setSignupErrorMessage] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleSignupSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setShowSignupError(false)
    setSignupErrorMessage('')

    try {
      const response = await axios.post('/api/signup', { displayName, username, password })

      if (response.status === 200) {
        const loginResult = await signIn('credentials', {
          redirect: false,
          username,
          password
        })

        if (loginResult?.ok) {
          window.location.href = '/dashboard?profileCreated=true'
        } else {
          window.location.href = '/login?autoLogin=failed'
        }
      } else {
        setShowSignupError(true)
        setSignupErrorMessage(response.data.error)
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setShowSignupError(true)
        setSignupErrorMessage(error.response?.data.error)
      } else {
        setShowSignupError(true)
        setSignupErrorMessage('An unexpected Error occurred. Please try again later.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Box className={styles.main__container}>
        <Box className={styles.form_header__container}>
          <Typography variant='h3'>Create new Account</Typography>
        </Box>
        {showSignupError &&
          <Box className={styles.alert_general__container}>
            <Alert
              className={styles.error_general__container}
              severity='error'
            >
              {signupErrorMessage}
            </Alert>
          </Box>
        }
        <Box className={styles.form_components__container}>
          <FormGroup className={styles.form_components__formgroup}>
            <FormControl fullWidth>
              <TextField
                required
                type='text'
                label='Your displayed Name'
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                inputProps={{ maxLength: 20 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Typography
                        className={styles.maxlength_counter__typography}
                      >
                        {displayName.length} / 20
                      </Typography>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                required
                type='text'
                label='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                inputProps={{ maxLength: 15 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Typography
                        className={styles.maxlength_counter__typography}
                      >
                        {username.length} / 15
                      </Typography>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                required
                type={showPassword ? 'text' : 'password'}
                label='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                inputProps={{ maxLength: 32 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Typography
                        className={styles.maxlength_counter__typography}
                      >
                        {password.length} / 32
                      </Typography>
                      <IconButton
                        onClick={() => setShowPassword((prevState) => !prevState)}
                      >
                        {showPassword ?
                          <Visibility className={styles.password_visibility__icon} />
                        :
                          <VisibilityOff className={styles.password_visibility__icon} />
                        }
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                required
                type={showPassword ? 'text' : 'password'}
                label='Confirm Password'
                error={password !== confirmPassword}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                inputProps={{ maxLength: 32 }}
              />
              {password !== confirmPassword &&
                <Typography
                  className={styles.password_match__typography}
                >
                  Passwords do not match
                </Typography>
              }
            </FormControl>
            <Button
              type='submit'
              disabled={
                isSubmitting ||
                displayName === '' ||
                username === '' ||
                password === '' ||
                password !== confirmPassword
              }
              variant='contained'
              onClick={handleSignupSubmit}
            >
              {!isSubmitting ?
                'Create Account'
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

export default SignupPage