'use client'

import {
  Typography,
  Box,
  Dialog,
  TextField,
  Button,
  InputAdornment,
  DialogTitle,
  DialogContent,
  FormGroup,
  IconButton,
  Alert
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { signIn, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Oval } from 'react-loader-spinner'
import ModeIcon from '@mui/icons-material/Mode'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import KeyIcon from '@mui/icons-material/Key'
import { toast } from 'react-toastify'
import styles from '@/assets/css/main.module.css'
import { ProfileDetails } from '@/config/project.config'
import axios from 'axios'

const ProfilePage = () => {
  const { data: session, status, update } = useSession()
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState<boolean>(false)
  const [profileDetails, setProfileDetails] = useState<ProfileDetails>({
    displayName: '',
    username: '',
    currency: 'dollar'
  })
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [editProfileDetail, setEditProfileDetail] = useState<'displayName' | 'username' | 'password' | null>(null)
  const [newDisplayName, setNewDisplayName] = useState<string>('')
  const [newUsername, setNewUsername] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [profileDataChanged, setProfileDataChanged] = useState<boolean>(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/login'
    }
  }, [status])

  useEffect(() => {
    if (session) {
      setProfileDetails({
        displayName: session?.user.displayName || '',
        username: session?.user.username || '',
        currency: session.user.currency as 'euro' | 'dollar' || 'dollar',
      })
    }
  }, [session])

  const handleDisplayNameUpdate = async () => {
    if (session) {
      setIsUpdating(true)

      if (newDisplayName.length === 0) {
        toast.error('New Display Name cant be empty!', { position: 'bottom-right', theme: 'colored' })
        setIsUpdating(false)
        return
      } else if (newDisplayName.length > 20) {
        toast.error('New Display Name cant be longer than 20 characters!', { position: 'bottom-right', theme: 'colored' })
        setIsUpdating(false)
        return
      }

      axios.patch(
        '/api/profile',
        {
          userId: session.user.id,
          updateType: 'displayName',
          newValue: newDisplayName
        },
        {
          validateStatus: (status) => {
            return status >= 200 && status < 500
          }
        }
      )
      .then(response => {
        if (response.status === 200) {
          toast.success('Display Name updated!', { position: 'bottom-right', theme: 'colored' })
          profileDetails.displayName = newDisplayName
          setProfileDataChanged(true)
          setEditProfileDetail(null)
        } else {
          toast.error('Error while updating display name!', { position: 'bottom-right', theme: 'colored' })
          console.error(`Error while updating display name: ${response.data.error}`)
        }
      })
      .catch(error => {
        toast.error('Failed to update display name!', { position: 'bottom-right', theme: 'colored' })
        console.error(`Failed to update display name: ${error}`)
      })
      .finally(() => {
        setIsUpdating(false)
      })
    }
  }

  const handleUsernameUpdate = async () => {
    if (session) {
      setIsUpdating(true)

      if (newUsername.length === 0) {
        toast.error('New Username cant be empty!', { position: 'bottom-right', theme: 'colored' })
        setIsUpdating(false)
        return
      } else if (newUsername.length > 15) {
        toast.error('New Username cant be longer than 15 characters!', { position: 'bottom-right', theme: 'colored' })
        setIsUpdating(false)
        return
      }

      axios.patch(
        '/api/profile',
        {
          userId: session.user.id,
          updateType: 'username',
          newValue: newUsername
        },
        {
          validateStatus: (status) => {
            return status >= 200 && status < 500
          }
        }
      )
      .then(response => {
        if (response.status === 200) {
          toast.success('Username updated!', { position: 'bottom-right', theme: 'colored' })
          profileDetails.username = newUsername
          setProfileDataChanged(true)
          setEditProfileDetail(null)
        } else {
          toast.error('Error while updating username!', { position: 'bottom-right', theme: 'colored' })
          console.error(`Error while updating username: ${response.data.error}`)
        }
      })
      .catch(error => {
        toast.error('Failed to update username!', { position: 'bottom-right', theme: 'colored' })
        console.error(`Failed to update username: ${error}`)
      })
      .finally(() => {
        setIsUpdating(false)
      })
    }
  }

  const handlePasswordUpdate = async () => {
    if (session) {
      setIsUpdating(true)

      if (newPassword.length === 0) {
        toast.error('New Password cant be empty!', { position: 'bottom-right', theme: 'colored' })
        setIsUpdating(false)
        return
      } else if (newPassword.length > 32) {
        toast.error('New Password cant be longer than 15 characters!', { position: 'bottom-right', theme: 'colored' })
        setIsUpdating(false)
        return
      }

      axios.patch(
        '/api/profile',
        {
          userId: session.user.id,
          updateType: 'password',
          newValue: newPassword
        },
        {
          validateStatus: (status) => {
            return status >= 200 && status < 500
          }
        }
      )
      .then(response => {
        if (response.status === 200) {
          toast.success('Password updated!', { position: 'bottom-right', theme: 'colored' })
          setEditProfileDetail(null)
        } else {
          toast.error('Error while updating password!', { position: 'bottom-right', theme: 'colored' })
          console.error(`Error while updating password: ${response.data.error}`)
        }
      })
      .catch(error => {
        toast.error('Failed to update password!', { position: 'bottom-right', theme: 'colored' })
        console.error(`Failed to update password: ${error}`)
      })
      .finally(() => {
        setIsUpdating(false)
        setChangePasswordDialogOpen(false)
      })
    }
  }

  return (
    <>
      {status !== 'loading' && session &&
        <>
          <Box className={styles.profile__container}>
            <Box className={styles.profile_box__container}>
              <Typography variant='h1'>Your Profile</Typography>
              {/* @hint: remove when automatic session update is implemented */}
              {profileDataChanged &&
                <Alert
                  severity='info'
                  className={`${styles.info_general__container}`}
                >
                  Your Profile data was updated. Please log out and then log back in!
                </Alert>
              }
              <Box className={styles.profile_column__container}>
                <TextField
                  type='text'
                  label='Display Name'
                  disabled={(editProfileDetail !== 'displayName' || isUpdating)}
                  value={editProfileDetail !== 'displayName' ? profileDetails?.displayName : newDisplayName}
                  className={styles.profile_column__textfield}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  inputProps={{ maxLength: 20 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        {editProfileDetail === 'displayName' ?
                          (!isUpdating ?
                            <>
                              <CloseIcon
                                className={styles.pointer__icon}
                                onClick={() => setEditProfileDetail(null)}
                              />
                              <CheckIcon
                                className={styles.pointer__icon}
                                onClick={handleDisplayNameUpdate}
                              />
                            </>
                          :
                            <Oval
                              height='20'
                              width='20'
                              color='white'
                              secondaryColor='white'
                            />
                          )
                        :
                          (editProfileDetail === null &&
                            <ModeIcon
                              className={styles.pointer__icon}
                              onClick={() => {
                                setEditProfileDetail('displayName')
                                setNewDisplayName(profileDetails?.displayName as string)
                              }}
                          />
                          )
                        }
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Box className={styles.profile_column__container}>
                <TextField
                  type='text'
                  label='Username'
                  disabled={(editProfileDetail !== 'username' || isUpdating)}
                  value={editProfileDetail !== 'username' ? profileDetails?.username : newUsername}
                  className={styles.profile_column__textfield}
                  onChange={(e) => setNewUsername(e.target.value)}
                  inputProps={{ maxLength: 15 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        {editProfileDetail === 'username' ?
                          (!isUpdating ?
                            <>
                              <CloseIcon
                                className={styles.pointer__icon}
                                onClick={() => setEditProfileDetail(null)}
                              />
                              <CheckIcon
                                className={styles.pointer__icon}
                                onClick={handleUsernameUpdate}
                              />
                            </>
                          :
                            <Oval
                              height='20'
                              width='20'
                              color='white'
                              secondaryColor='white'
                            />
                          )
                        :
                          (editProfileDetail === null &&
                            <ModeIcon
                              className={styles.pointer__icon}
                              onClick={() => {
                                setEditProfileDetail('username')
                                setNewUsername(profileDetails?.username as string)
                              }}
                            />
                          )
                        }
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Box className={styles.profile_column__container}>
                <Button
                  variant='outlined'
                  onClick={() => {
                    setEditProfileDetail(null)
                    setChangePasswordDialogOpen(true)
                  }}
                >
                  <KeyIcon className={styles.password_change__icon} /> Change Password
                </Button>
              </Box>
            </Box>
          </Box>
        </>
      }
      <Dialog open={changePasswordDialogOpen} onClose={() => setChangePasswordDialogOpen(false)} maxWidth='md'>
        <DialogTitle variant='h4' className={styles.dialog_background}>Change Password</DialogTitle>
        <DialogContent className={styles.dialog_background}>
          <FormGroup>
            <Box className={styles.change_password__container}>
              <TextField
                required
                type={showPassword ? 'text' : 'password'}
                label='New Password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                inputProps={{ maxLength: 32 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Typography
                          className={styles.maxlength_counter__typography}
                        >
                          {newPassword.length} / 32
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
              <TextField
                required
                type={showPassword ? 'text' : 'password'}
                label='Confirm new Password'
                error={newPassword !== confirmNewPassword}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                inputProps={{ maxLength: 32 }}
              />
              {newPassword !== confirmNewPassword &&
                <Typography className={styles.password_match__typography}>Passwords do not match</Typography>
              }
              <Box className={styles.change_password_buttons__container}>
                <Button
                  variant='contained'
                  disabled={isUpdating}
                  onClick={handlePasswordUpdate}
                >
                  Update
                </Button>
                <Button
                  variant='outlined'
                  disabled={isUpdating}
                  onClick={() => setChangePasswordDialogOpen(false)}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </FormGroup>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProfilePage