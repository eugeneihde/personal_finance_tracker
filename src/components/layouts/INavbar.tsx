'use client'

import { AppBar, Button, Divider, Menu, MenuItem, SpeedDial, SpeedDialAction, Toolbar, Box } from '@mui/material'
import AppsIcon from '@mui/icons-material/Apps'
import { navSpeedDialActions } from '@/config/project.config'
import styles from '@/assets/css/main.module.css'
import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const INavbar = () => {
  const { data: session, status } = useSession()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <AppBar component='nav' color='transparent' className={styles.navbar__appbar}>
        <Toolbar className={styles.navbar__toolbar}>
          <SpeedDial
            ariaLabel='Navigation'
            icon={<AppsIcon />}
            direction='down'
            className={styles.navigation__speeddial}
          >
            {navSpeedDialActions.map((item) => (
              <SpeedDialAction
                className={styles.childitems__speeddial}
                key={item.name}
                icon={item.icon}
                tooltipTitle={item.name}
                tooltipOpen
                tooltipPlacement='right'
                onClick={() => window.location.href = item.link}
              />
            ))}
          </SpeedDial>

          {status !== 'loading' &&
            (status === 'unauthenticated' ?
              <>
              <Box className={styles.login_signup__container}>
                <Button
                  onClick={() => window.location.href = '/login'}
                  variant='outlined'
                >
                  Login <LoginIcon className={styles.icon_button__icon} />
                </Button>
                <Button
                  onClick={() => window.location.href = '/signup'}
                  variant='contained'
                >
                  Signup <PersonAddIcon className={styles.icon_button__icon} />
                </Button>
              </Box>
              </>
            :
              <Button
                id='account-button'
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                variant='contained'
              >
                {session?.user.displayName} <ExpandMoreIcon />
              </Button>
            )
          }
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'account-button',
            }}
          >
            <MenuItem onClick={() => window.location.href = '/profile'}>Profile of {session?.user.username}</MenuItem>
            <Divider />
            <MenuItem onClick={() => signOut()}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default INavbar