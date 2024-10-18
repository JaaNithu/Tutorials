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
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import React from 'react'
import Alert from '@mui/material/Alert'

// Type Imports
type Props = {
  open: boolean
  handleClose: () => void
  userId: string | null // Add userId to load the user data for editing
}

type FormDataType = {
  name: string
  email: string
  password?: string // Password can be optional for edit
  role: string
}

// Vars
const initialData = {
  name: '',
  email: '',
  password: '',
  role: ''
}


const EditUser = ({ open, handleClose, userId }: Props) => {
  // States
  const [formData, setFormData] = useState<FormDataType>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Fetch user data for editing
  useEffect(() => {
    if (userId) {  // Fetch only if userId is present
      const fetchUser = async () => {
        try {
          const response = await fetch(`http://localhost:3001/user/${userId}`);
          const data = await response.json();
          setFormData({
            name: data.name,
            email: data.email,
            role: data.role
          });
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };

      fetchUser();
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedData = { ...formData };

      // Remove password if it's not updated
      if (!formData.password) {
        delete updatedData.password;
      }

      const response = await fetch(`http://localhost:3001/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Error updating user');
      }

      const data = await response.json();

      // Provide success feedback
      setSnackbarMessage('User updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Close the drawer and reset form
      handleClose();
      setFormData(initialData);
    } catch (error) {
      console.error('Error updating user:', error);

      // Provide error feedback
      setSnackbarMessage('Error updating user!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  }

  const handleReset = () => {
    handleClose();
    setFormData(initialData);
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
          <Typography variant='h5'>Edit User</Typography>
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
              placeholder='Leave blank to keep the current password'
              value={formData.password || ''} 
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

export default EditUser;
