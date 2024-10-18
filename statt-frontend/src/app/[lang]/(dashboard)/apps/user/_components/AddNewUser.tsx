'use client'
// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import { Snackbar } from '@mui/material'
import React from 'react'

type Props = {
  open: boolean
  handleClose: () => void
}

type FormDataType = {
  name: string
  email: string
  password: string
  role: string
}

// Vars
const initialData = {
  name: '',
  email: '',
  password: '',
  role: ''
}

const AddNewUser = ({ open, handleClose }: Props) => {
  // States
  const [formData, setFormData] = useState<FormDataType>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null) // Message state for success/error
  const [messageType, setMessageType] = useState<'success' | 'error'>('success') // Message type

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null) // Clear any previous message
  }

  const handleReset = () => {
    handleClose()
    setFormData(initialData)
    setMessage(null) // Clear message on reset
  }

  const addUser = async () => {
    try {
      const response = await fetch('http://localhost:3001/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error('Error adding user');
      }

      const data = await response.json()
      console.log('User added successfully:', data)

      // Show success message
      setMessageType('success');
      setMessage('User added successfully!');

      // Close the drawer and reset form
      handleClose()
      setFormData(initialData)
    } catch (error) {
      // Show error message
      setMessageType('error');
      setMessage('Failed to add user. Please try again.');
      console.error('Error adding user:', error)
    } finally {
      setIsSubmitting(false) // Reset submitting state
    }
  }

  useEffect(() => {
    if (isSubmitting) {
      addUser()
    }
  }, [isSubmitting])

  return (
    <>
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>Add New User</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />

      <div className='p-5'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <TextField
            label='User Name'
            fullWidth
            placeholder='John Doe'
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label='Email'
            fullWidth
            placeholder='johndoe@gmail.com'
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            label='Password'
            fullWidth
            placeholder='Password'
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />
          <TextField
            label='Role'
            fullWidth
            placeholder='Admin or User...'
            value={formData.role}
            onChange={e => setFormData({ ...formData, role: e.target.value })}
          />
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
            <Button variant='outlined' color='error' type='reset' onClick={() => handleReset()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>

      {/* Snackbar for Success/Error messages */}
      <Snackbar
        open={!!message}
        autoHideDuration={4000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setMessage(null)} severity={messageType}>
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default AddNewUser
