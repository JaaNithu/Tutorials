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
import { Checkbox, FormControlLabel, Snackbar } from '@mui/material'
import React from 'react'

type Props = {
  open: boolean
  handleClose: () => void
}

type FormDataType = {
  title: string
  description: string
  video_url: string
  section_order: number
  isActive: boolean
}

// Vars
const initialData = {
  title: '',
  description: '',
  video_url: '',
  section_order: 0,
  isActive: false,
}

const AddNewSection = ({ open, handleClose }: Props) => {
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

  const addSection = async () => {
    try {
      const response = await fetch(`http://localhost:3001/section/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error('Error adding section');
      }

      const data = await response.json()
      console.log('Section added successfully:', data)

      // Show success message
      setMessageType('success');
      setMessage('Section added successfully!');

      // Close the drawer and reset form
      handleClose()
      setFormData(initialData)
    } catch (error) {
      // Show error message
      setMessageType('error');
      setMessage('Failed to add section. Please try again.');
      console.error('Error adding section:', error)
    } finally {
      setIsSubmitting(false) // Reset submitting state
    }
  }

  useEffect(() => {
    if (isSubmitting) {
      addSection()
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
        <Typography variant='h5'>Add New Section</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />

      <div className='p-5'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <TextField
              label='Title'
              placeholder='Title...'
              fullWidth
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              label='Description'
              placeholder='Description...'
              fullWidth
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              label='Video Url'
              placeholder='Url...'
              fullWidth
              value={formData.video_url || ''}
              onChange={e => setFormData({ ...formData, video_url: e.target.value })}
            />
            <TextField
              label='Section Order'
              placeholder='Section Order...'
              fullWidth
              value={formData.section_order}
              onChange={e => setFormData({ ...formData, section_order: Number(e.target.value) })}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                />
              }
              label='Is Active'
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

export default AddNewSection
