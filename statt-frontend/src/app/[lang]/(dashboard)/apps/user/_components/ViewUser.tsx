'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'

// Type Imports
type Props = {
  open: boolean
  handleClose: () => void
  userId: string | null // userId for fetching specific user details
}

type FormDataType = {
  name: string
  email: string
  role: string
}

// Vars
const initialData = {
  name: '',
  email: '',
  role: ''
}

const ViewUser = ({ open, handleClose, userId }: Props) => {
  // States
  const [formData, setFormData] = useState<FormDataType>(initialData)

  // Fetch user data for viewing
  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`http://localhost:3001/user/${userId}`)
          const data = await response.json()
          setFormData({
            name: data.name,
            email: data.email,
            role: data.role
          })
        } catch (error) {
          console.error('Error fetching user:', error)
        }
      }

      fetchUser()
    }
  }, [userId])

  const handleReset = () => {
    handleClose()
    setFormData(initialData)
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>View User</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form className='flex flex-col gap-5'>
          <TextField
            label='User Name'
            fullWidth
            value={formData.name}
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            label='Email'
            fullWidth
            value={formData.email}
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            label='Role'
            fullWidth
            value={formData.role}
            InputProps={{
              readOnly: true
            }}
          />
        </form>
      </div>
    </Drawer>
  )
}

export default ViewUser
