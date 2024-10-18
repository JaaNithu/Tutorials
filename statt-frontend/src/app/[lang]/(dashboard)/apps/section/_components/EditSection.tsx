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
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import React from 'react'
import { Checkbox, FormControlLabel } from '@mui/material'

// Type Imports
type Props = {
  open: boolean
  handleClose: () => void
  sectionId: string | null // Add sectionId to load the section data for editing
}

type FormDataType = {
  title: string
  description: string
  video_url: string
  section_order: number
  isActive: boolean
  questions: string
}

// Vars
const initialData = {
  title: '',
  description: '',
  video_url: '',
  section_order: 0,
  isActive: false,
  questions: ''
}

const EditSection = ({ open, handleClose, sectionId }: Props) => {
  // States
  const [formData, setFormData] = useState<FormDataType>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')

  // Fetch section data for editing
  useEffect(() => {
    if (sectionId) {
      const fetchSection = async () => {
        try {
          const response = await fetch(`http://localhost:3001/section/${sectionId}`)
          const data = await response.json()
          setFormData({
            title: data.title,
            description: data.description,
            video_url: data.video_url,
            section_order: data.section_order,
            isActive: data.isActive,
            questions: data.questions
          })
        } catch (error) {
          console.error('Error fetching section:', error)
        }
      }

      fetchSection()
    }
  }, [sectionId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const updatedData = { ...formData }
      const response = await fetch(`http://localhost:3001/section/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error(`Error updating section: ${response.statusText}`)
      }

      // Set success message
      setSnackbarMessage('Section updated successfully!')
      setSnackbarSeverity('success')
      setSnackbarOpen(true)

      // Reset form and close drawer
      handleClose()
      setFormData(initialData)
    } catch (error) {
      console.error('Error updating section:', error)

      // Set error message
      setSnackbarMessage('Error updating section!')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    handleClose()
    setFormData(initialData)
  }

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
          <Typography variant='h5'>Edit Section</Typography>
          <IconButton size='small' onClick={handleReset}>
            <i className='ri-close-line text-2xl' />
          </IconButton>
        </div>
        <Divider />
        <div className='p-5'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <TextField
              label='Title'
              fullWidth
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              label='Description'
              fullWidth
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              label='Video Url'
              fullWidth
              value={formData.video_url || ''}
              onChange={e => setFormData({ ...formData, video_url: e.target.value })}
            />
            <TextField
              label='Section Order'
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
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant='outlined' color='error' type='reset' onClick={() => handleReset()}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Drawer>

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default EditSection
