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
import { Checkbox, FormControlLabel } from '@mui/material'

// Type Imports
import { SectionType, AnswerType } from '@/types/apps/userTypes'
import React from 'react'

// Type Definitions
type Props = {
  open: boolean
  handleClose: () => void
  questionId: string | null | number
}

type OptionType = {
  id: string | number;
  text: string
  isCorrect: boolean
}

type FormDataType = {
  question: string
  section: string
  options: OptionType[]
}

const initialData: FormDataType = {
  question: '',
  section: '',
  options: []
}

const EditQuestion = ({ open, handleClose, questionId }: Props) => {
  // States
  const [formData, setFormData] = useState<FormDataType>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')
  const [sections, setSections] = useState<SectionType[]>([])

  // Fetch sections and question data for editing
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch('http://localhost:3001/section/')
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

    if (questionId) {
      const fetchQuestion = async () => {
        try {
          const response = await fetch(`http://localhost:3001/questions/${questionId}`)
          const data = await response.json()

          setFormData({
            question: data.question,
            section: data.section?.sectionId || '',
            options: data.options ? data.options.map((option: any) => ({
              id: option.id,
              text: option.text,
              isCorrect: option.isCorrect
          })) : []          
          })
        } catch (error) {
          console.error('Error fetching question:', error)
        }
      }

      fetchQuestion()
    }
  }, [questionId])

  // Handle option change
  const handleOptionChange = (index: number, newValue: string) => {
    const updatedOptions = [...formData.options]
    updatedOptions[index].text = newValue
    setFormData({ ...formData, options: updatedOptions })
  }

  // Handle correct answer checkbox toggle
  const handleCorrectAnswerChange = (index: number) => {
    const updatedOptions = [...formData.options]
    updatedOptions[index].isCorrect = !updatedOptions[index].isCorrect
    setFormData({ ...formData, options: updatedOptions })
  }

  // Remove an option
  const handleRemoveOption = (index: number) => {
    const updatedOptions = [...formData.options]
    updatedOptions.splice(index, 1)
    setFormData({ ...formData, options: updatedOptions })
  }

  // Add a new option
  const handleAddOption = () => {
    const newOption = { id: generateNewId(), text: '', isCorrect: false }
    setFormData({ ...formData, options: [...formData.options, newOption] })
  }

  // Generate a new unique ID
  const generateNewId = () => {
    return Date.now(); // Simple example using current timestamp as an ID
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Format options for submission
    const formattedOptions = formData.options.map(option => ({
      optionId: option.id,
      text: option.text,
      isCorrect: option.isCorrect,
    }));

    try {
      const updatedData = {
        question: formData.question,
        sectionId: formData.section,
        options: formattedOptions,
      };

      const response = await fetch(`http://localhost:3001/questions/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error(`Error updating question: ${response.statusText}`);
      }
  
      const responseData = await response.json();
      console.log('Updated question data:', responseData);
  
      // Set success message
      setSnackbarMessage('Question updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
  
      // Reset form and close drawer
      handleClose();
      setFormData(initialData);
    } catch (error) {
      console.error('Error updating question:', error);
  
      // Set error message
      setSnackbarMessage('Error updating question!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
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

            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center gap-4">
                <TextField
                  label={`Option ${index + 1}`}
                  fullWidth
                  placeholder={`Enter option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={option.isCorrect}
                      onChange={() => handleCorrectAnswerChange(index)}
                    />
                  }
                  label="Correct"
                />
                <IconButton color="error" onClick={() => handleRemoveOption(index)}>
                  <i className="ri-delete-bin-line" />
                </IconButton>
              </div>
            ))}

            <Button variant="contained" onClick={handleAddOption}>
              Add Option
            </Button>

            <div className="flex items-center gap-4">
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Question'}
              </Button>
              <Button variant="outlined" color="error" onClick={handleReset}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Drawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default EditQuestion
