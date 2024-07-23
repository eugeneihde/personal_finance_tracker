'use client'

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormGroup,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import FilterListIcon from '@mui/icons-material/FilterList'
import AddIcon from '@mui/icons-material/Add'
import ModeIcon from '@mui/icons-material/Mode'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-toastify'
import { getDateNDaysAgo } from '@/config/project.config'
import { TransactionData, Transaction } from '@/config/project.config'
import styles from '@/assets/css/main.module.css'

const DashboardPage = () => {
  const { data: session, status } = useSession()
  const currency: '$' | '€' = (session?.user.currency === 'dollar' ? '$' : '€')
  const invalidTransactionAmounts: string[] = ['0', '0.00', '']
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTransactionData, setLoadingTransactionData] = useState<boolean>(true)
  const [filterStartDate, setFilterStartDate] = useState<string>(getDateNDaysAgo(7).toISOString().split('T')[0])
  const [filterEndDate, setFilterEndDate] = useState<string>(new Date().toISOString().split('T')[0])

  // CRUD related useStates
  const [actionType, setActionType] = useState<'create' | 'update' | ''>('')
  const [createEditEntryDialogOpen, setCreateEditEntryDialogOpen] = useState<boolean>(false)
  const [deleteEntryDialogOpen, setDeleteEntryDialogOpen] = useState<boolean>(false)
  const [isDeletingUpdatingorCreating, setIsDeletingUpdatingOrCreating] = useState<boolean>(false)
  const [selectedEntry, setSelectedEntry] = useState<Transaction>()
  const [transactionData, setTransactionData] = useState<TransactionData>({
    type: 'income',
    title: '',
    amount: '',
    date: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/login'
    }
  }, [status])

  useEffect(() => {
    if (session) {
      handleCRUDAction('read')
    }
  }, [session])

  const formatDateToUS = (dateString: string): string => {
    const [year, month, day] = dateString.split('-')
    return `${month}/${day}/${year}`
  }

  const handleCRUDAction = async (actionType: 'create' | 'read' | 'update' | 'delete') => {
    if (session) {
      if (actionType === 'create') {
        if (transactionData.title === '') {
          toast.error('Transaction title cant be empty!', { position: 'bottom-right', theme: 'colored' })
          return
        } else if (invalidTransactionAmounts.includes(transactionData.amount)) {
          toast.error('Transaction amount must be greater than 0!', { position: 'bottom-right', theme: 'colored' })
          return
        } else if (transactionData.date === '') {
          toast.error('Transaction date cant be empty!', { position: 'bottom-right', theme: 'colored' })
          return
        }

        axios.put(
          '/api/profile/transactions',
          {
            type: transactionData.type,
            title: transactionData.title,
            amount: transactionData.amount,
            date: transactionData.date
          },
          {
            validateStatus: (status) => {
              return status >= 200 && status < 500
            }
          }
        )
        .then(response => {
          if (response.status === 200) {
            toast.success('Entry created!', { position: 'bottom-right', theme: 'colored' })
            handleCRUDAction('read')
            setTransactionData({ type: 'income', title: '', amount: '', date: '' })
          } else {
            toast.error('Error while creating entry!', { position: 'bottom-right', theme: 'colored' })
            console.error(`Error while creating entry: ${response.data.error}`)
          }
        })
        .catch(error => {
          toast.error('Failed to create entry!', { position: 'bottom-right', theme: 'colored' })
          console.error(`Failed to create entry: ${error}`)
        })
        .finally(() => {
          setIsDeletingUpdatingOrCreating(false)
          setCreateEditEntryDialogOpen(false)
        })
      } else if (actionType === 'read') {
        setLoadingTransactionData(true)

        axios.post(
          '/api/profile/transactions',
          {
            startDate: filterStartDate,
            endDate: filterEndDate
          },
          {
            validateStatus: (status) => {
              return status >= 200 && status < 500
            }
          }
        )
        .then(response => {
          if (response.status === 200) {
            setTransactions(response.data)
          } else {
            toast.error('Error while fetching transactions!', { position: 'bottom-right', theme: 'colored' })
            console.error(`Error while fetching transactions: ${response.data.error}`)
          }
        })
        .catch(error => {
          toast.error('Failed to fetch transactions!', { position: 'bottom-right', theme: 'colored' })
          console.error(`Failed to fetch transactions: ${error}`)
        })
        .finally(() => {
          setLoadingTransactionData(false)
        })
      } else if (actionType === 'update') {
        setIsDeletingUpdatingOrCreating(true)

        axios.patch(
          '/api/profile/transactions',
          {
            entryId: selectedEntry?.id,
            type: transactionData.type,
            title: transactionData.title,
            amount: transactionData.amount,
            date: transactionData.date
          },
          {
            validateStatus: (status) => {
              return status >= 200 && status < 500
            }
          }
        )
        .then(response => {
          if (response.status === 200) {
            toast.success('Entry updated!', { position: 'bottom-right', theme: 'colored' })
            handleCRUDAction('read')
          } else {
            toast.error('Error while updating entry!', { position: 'bottom-right', theme: 'colored' })
            console.error(`Error while updating entry: ${response.data.error}`)
          }
        })
        .catch(error => {
          toast.error('Failed to update entry!', { position: 'bottom-right', theme: 'colored' })
          console.error(`Failed to update entry: ${error}`)
        })
        .finally(() => {
          setIsDeletingUpdatingOrCreating(false)
          setCreateEditEntryDialogOpen(false)
        })
      } else if (actionType === 'delete') {
        setIsDeletingUpdatingOrCreating(true)

        axios.delete('/api/profile/transactions', {
          data: {
            entry: selectedEntry
          },
          validateStatus: (status) => {
            return status >= 200 && status < 500
          }
        })
        .then(response => {
          if (response.status === 200) {
            toast.success('Entry deleted!', { position: 'bottom-right', theme: 'colored' })
            handleCRUDAction('read')
          } else {
            toast.error('Error while deleting entry!', { position: 'bottom-right', theme: 'colored' })
            console.error(`Error while deleting entry: ${response.data.error}`)
          }
        })
        .catch(error => {
          toast.error('Failed to delete entry!', { position: 'bottom-right', theme: 'colored' })
          console.error(`Failed to delete entry: ${error}`)
        })
        .finally(() => {
          setIsDeletingUpdatingOrCreating(false)
          setDeleteEntryDialogOpen(false)
        })
      }
    }
  }

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterStartDate(event.target.value)
    if (new Date(event.target.value) > new Date(filterEndDate)) {
      setFilterEndDate(event.target.value)
    }
  }

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterEndDate(event.target.value)
    if (new Date(event.target.value) < new Date(filterStartDate)) {
      setFilterStartDate(event.target.value)
    }
  }

  const handleNewTransactionTypeChange = (event: React.MouseEvent<HTMLElement>, clickedType: 'income' | 'expense' | null) => {
    if (clickedType !== null) {
      setTransactionData((prevData) => ({
        ...prevData,
        type: clickedType
      }))
    }
  }

  if (status === 'loading') {
    return (
      <>
        <Typography>Loading…</Typography>
      </>
    )
  }

  return (
    <>
      <Typography variant='h1'>Overview</Typography>
      <Box className={styles.income_expense__container}>
        <Box className={styles.table_controlbar__container}>
          <Box>
            <TextField
              className={styles.datepicker__date}
              label='Start Date'
              type='date'
              value={filterStartDate}
              onChange={handleStartDateChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: filterEndDate }}
            />
            <TextField
              className={styles.datepicker__date}
              label='End Date'
              type='date'
              value={filterEndDate}
              onChange={handleEndDateChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: filterStartDate }}
            />
            <Button
              className={styles.datepicker__button}
              variant='outlined'
              onClick={() => handleCRUDAction('read')}
            >
              Filter <FilterListIcon className={styles.icon_button__icon} />
            </Button>
          </Box>
          <Button
            className={styles.create_entry__button}
            variant='outlined'
            onClick={() => {
              setCreateEditEntryDialogOpen(true)
              setActionType('create')
              setTransactionData({
                type: 'income',
                title: '',
                amount: '',
                date: ''
              })
            }}
          >
            Create Entry <AddIcon className={styles.icon_button__icon} />
          </Button>
        </Box>
        <TableContainer component={Paper} className={styles.table__tablecontainer}>
          <Table key={transactions.length}>
            <TableHead className={styles.table_head_tablehead}>
              <TableRow>
                <TableCell className={styles.table_head__tablecell}>TITLE</TableCell>
                <TableCell className={styles.table_head__tablecell} align='right'>AMOUNT</TableCell>
                <TableCell className={styles.table_head__tablecell} align='right'>DATE</TableCell>
                <TableCell className={styles.table_head__tablecell} align='right'>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loadingTransactionData &&
                (transactions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell component='th' scope='row'>{item.title}</TableCell>
                    {item.type === 'income' ?
                      <TableCell align='right' className={styles.amount_income_tablecell}>+ {item.amount} {currency}</TableCell>
                    :
                      <TableCell align='right' className={styles.amount_expense_tablecell}>- {item.amount} {currency}</TableCell>
                    }
                    <TableCell align='right'>{formatDateToUS(item.date)}</TableCell>
                    <TableCell align='right'>
                      <ModeIcon
                        className={styles.table_actions_edit__tablecell}
                        onClick={() => {
                          setCreateEditEntryDialogOpen(true)
                          setActionType('update')
                          setSelectedEntry(item)
                          setTransactionData({
                            type: item.type as 'income' | 'expense',
                            title: item.title,
                            amount: item.amount.toString(),
                            date: item.date
                          })
                        }}
                      />
                      <DeleteIcon
                        className={styles.table_actions_delete__tablecell}
                        onClick={() => {
                          setDeleteEntryDialogOpen(true)
                          setSelectedEntry(item)
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )))
              }
            </TableBody>
          </Table>
          {loadingTransactionData &&
            <Box className={styles.table_infobox__container}>
              <ThreeDots
                height='75px'
                width='75px'
                color='white'
              />
            </Box>
          }
          {!loadingTransactionData && transactions.length === 0 &&
            <Box className={styles.table_infobox__container}>
              <Typography variant='h3'>No Data available for the selected time period</Typography>
            </Box>
          }
        </TableContainer>
        <Dialog open={deleteEntryDialogOpen} onClose={() => setDeleteEntryDialogOpen(false)} maxWidth='md'>
          <DialogTitle variant='h4' className={styles.delete_entry__title}>Confirm Deletion of Entry</DialogTitle>
          <DialogContent className={styles.dialog_background}>
            {/* make listing of entry data */}
            <Box className={styles.delete_entry_content__container}>
              <Typography>Title: {selectedEntry?.title}</Typography>
              <Typography>Date: {selectedEntry?.date}</Typography>
            </Box>
            <Box sx={{ px: 6, gap: 2, display: 'flex' }}>
              <Button
                variant='contained'
                disabled={isDeletingUpdatingorCreating}
                onClick={() => setDeleteEntryDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant='outlined'
                disabled={isDeletingUpdatingorCreating}
                onClick={() => handleCRUDAction('delete')}
              >
                Delete
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
        <Dialog open={createEditEntryDialogOpen} onClose={() => setCreateEditEntryDialogOpen(false)} maxWidth='lg'>
          <DialogTitle
            variant='h4'
            className={styles.dialog_background} 
          >
            {actionType === 'create' ? 'Create new' : 'Update'} Entry
          </DialogTitle>
          <DialogContent className={styles.create_entry__container}>
            <FormGroup>
              <Box className={styles.form_components__container}>
                <Box className={styles.amount_type__container}>
                  <ToggleButtonGroup
                    value={transactionData.type}
                    exclusive
                    onChange={handleNewTransactionTypeChange}
                    className={styles.amount_type__togglegroup}
                  >
                    <ToggleButton
                      value='income'
                      className={`${styles.amount_type_income__togglebutton} ${transactionData.type === 'income' ? styles.amount_type_income_selected__togglebutton : ''}`}
                    >
                      Income
                    </ToggleButton>
                    <ToggleButton
                      value='expense'
                      className={`${styles.amount_type_expense__togglebutton} ${transactionData.type === 'expense' ? styles.amount_type_expense_selected__togglebutton : ''}`}
                    >
                      Expense
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                <FormControl fullWidth>
                  <TextField
                    required
                    type='text'
                    label='Transaction Title'
                    value={transactionData.title}
                    onChange={(e) => setTransactionData((prevData) => ({ ...prevData, title: e.target.value }))}
                    // @todo: make maxLength smaller?
                    inputProps={{ maxLength: 255 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Typography
                            className={styles.maxlength_counter__typography}
                          >
                            {transactionData.title.length} / 255
                          </Typography>
                        </InputAdornment>
                      )
                    }}
                  />
                </FormControl>
              </Box>
              <Box className={styles.form_components__container}>
                <FormControl fullWidth>
                  <TextField
                    required
                    type='number'
                    label='Transaction Amount'
                    value={transactionData.amount}
                    onChange={(e) => {
                      const regex = /^\d*([.,]?\d{0,2})$/

                      if (regex.test(e.target.value)) {
                        setTransactionData((prevData) => ({ ...prevData, amount: e.target.value }))
                      }
                    }}
                    onBlur={() => {
                      if (transactionData.amount) {
                        const floatValue = parseFloat(transactionData.amount).toFixed(2)
                        setTransactionData((prevData) => ({ ...prevData, amount: floatValue }))
                      }
                    }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    required
                    type='date'
                    value={transactionData.date}
                    label='Entry Date'
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setTransactionData((prevData) => ({ ...prevData, date: e.target.value }))}
                  />
                </FormControl>
              </Box>
              <Box className={styles.form_components__container}>
                <Button
                  className={styles.create_entry_buttons__button}
                  variant='contained'
                  disabled={isDeletingUpdatingorCreating}
                  onClick={() => {
                    if (actionType === 'create') {
                      handleCRUDAction('create')
                    } else {
                      handleCRUDAction('update')
                    }
                  }}
                >
                  {actionType === 'create' ? 'Create' : 'Update'} Entry
                </Button>
                <Button
                  className={styles.create_entry_buttons__button}
                  variant='outlined'
                  disabled={isDeletingUpdatingorCreating}
                  onClick={() => setCreateEditEntryDialogOpen(false)}
                >
                  Cancel
                </Button>
              </Box>
            </FormGroup>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  )
}

export default DashboardPage