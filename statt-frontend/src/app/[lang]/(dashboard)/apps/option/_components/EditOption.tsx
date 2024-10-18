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
import MenuItem from '@mui/material/MenuItem'

// Type Imports
import { SectionType, AnswerType } from '@/types/apps/userTypes'
import React from 'react'

// Type Imports
type Props = {
  open: boolean
  handleClose: () => void
  optionId: string | null
}

type FormDataType = {
  question: string
  section: string
  option: string
}

// Vars
const initialData = {
  question: '',
  section: '',
  option: '',
}

const EditOption = ({ open, handleClose, optionId }: Props) => {
  // States
  const [formData, setFormData] = useState<FormDataType>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')
  const [sections, setSections] = useState<SectionType[]>([]) // Section data
  const [options, setOptions] = useState<AnswerType[]>([]) // Options data

  // Fetch sections and question data for editing
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch('http://localhost:3001/section/') // Adjust the endpoint as needed
        const data = await response.json()

        // Ensure data is an array before setting it
        if (Array.isArray(data)) {
          setSections(data) // Store fetched sections in state
        } else {
          console.error('Fetched sections is not an array:', data)
        }
      } catch (error) {
        console.error('Error fetching sections:', error)
      }
    }

    fetchSections()

    const fetchOptions = async () => {
      try {
        const response = await fetch('http://localhost:3001/question/option/');
        const data = await response.json();
    
        // Ensure options is an array before updating the state
        if (Array.isArray(data)) {
          setOptions(data);
        } else if (data.options && Array.isArray(data.options)) {
          setOptions(data.options); // In case of nested array like { options: [...] }
        } else {
          console.error('Options data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    
    fetchOptions();
    
    

    if (optionId) {
      const fetchQuestion = async () => {
        try {
          const response = await fetch(`http://localhost:3001/questions/${optionId}`)
          const data = await response.json()

          setFormData({
            question: data.question,
            section: data.section?.sectionId || '',
            option: data.option || '',
          })
        } catch (error) {
          console.error('Error fetching question:', error)
        }
      }

      fetchQuestion()
    }
  }, [optionId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const updatedData = { ...formData }
      const response = await fetch(`http://localhost:3001/questions/${optionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error(`Error updating question: ${response.statusText}`)
      }

      // Set success message
      setSnackbarMessage('Question updated successfully!')
      setSnackbarSeverity('success')
      setSnackbarOpen(true)

      // Reset form and close drawer
      handleClose()
      setFormData(initialData)
    } catch (error) {
      console.error('Error updating question:', error)

      // Set error message
      setSnackbarMessage('Error updating question!')
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
          <Typography variant='h5'>Edit Question</Typography>
          <IconButton size='small' onClick={handleReset}>
            <i className='ri-close-line text-2xl' />
          </IconButton>
        </div>
        <Divider />
        <div className='p-5'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <TextField
              label='Question'
              fullWidth
              value={formData.question}
              onChange={e => setFormData({ ...formData, question: e.target.value })}
            />
            <TextField
              select
              label='Section'
              fullWidth
              value={formData.section}
              onChange={e => setFormData({ ...formData, section: e.target.value })}
            >
              {Array.isArray(sections) && sections.map(section => (
                <MenuItem key={section.id} value={section.id}>
                  {section.title}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Answer"
              fullWidth
              value={formData.option}
              onChange={e => setFormData({ ...formData, option: e.target.value })}
            >
              {Array.isArray(options) && options.length > 0 ? (
                options.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.text}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No options available</MenuItem>
              )}
            </TextField>

            <div className='flex items-center gap-4'>
              <Button variant='contained' type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant='outlined' color='error' type='reset' onClick={handleReset}>
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

export default EditOption
