'use client';
// React Imports
import { useEffect, useState } from 'react';

// MUI Imports
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import { SectionType } from '@/types/apps/userTypes';

type Props = {
  open: boolean;
  handleClose: () => void;
};

type FormDataType = {
  question: string;
  sectionId: string;
};

// Vars
const initialData = {
  question: '',
  sectionId: ''
};

const AddNewOption = ({ open, handleClose }: Props) => {
  // States
  const [formData, setFormData] = useState<FormDataType>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error'>('success'); // Message type
  const [sections, setSections] = useState<SectionType[]>([]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch('http://localhost:3001/section/');
        const data = await response.json();

        // Verify that data is an array and map through it
        if (Array.isArray(data)) {
          setSections(data);
        } else {
          console.error('Expected an array for sections');
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };
    fetchSections();
  }, []);


const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Basic validation
  if (!formData.question || !formData.sectionId) {
    setMessageType('error');
    setMessage('All fields are required!');
    return;
  }

  setIsSubmitting(true); // This should trigger the effect to call addQuestion
};

useEffect(() => {
  if (isSubmitting) {
    addQuestion(); // Ensure this function runs when isSubmitting changes to true
  }
}, [isSubmitting]);


  const handleReset = () => {
    handleClose();
    setFormData(initialData);
    setMessage(null); // Clear message on reset
  };

  const addQuestion = async () => {
    try {
      const response = await fetch(`http://localhost:3001/questions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error adding question');
      }
  
      const data = await response.json();
      console.log('Question added successfully:', data);
      setMessageType('success');
      setMessage('Question added successfully!');
      handleClose(); // Close the drawer/modal after successful submission
      setFormData(initialData); // Reset the form data
    } catch (error) {
      setMessageType('error');
      setMessage('Failed to add question. Please try again.');
      console.error('Error adding question:', error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  useEffect(() => {
    if (isSubmitting) {
      addQuestion();
    }
  }, [isSubmitting]);

  return (
    <>
      <Drawer
        open={open}
        anchor="right"
        variant="temporary"
        onClose={handleReset}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >
        <div className="flex items-center justify-between pli-5 plb-4">
          <Typography variant="h5">Add New Question</Typography>
          <IconButton size="small" onClick={handleReset}>
            <i className="ri-close-line text-2xl" />
          </IconButton>
        </div>
        <Divider />

        <div className="p-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <TextField
              label="Question"
              fullWidth
              placeholder="Enter the question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            />
            <TextField
              label="Section"
              fullWidth
              select
              placeholder="Choose section"
              value={formData.sectionId}
              onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
            >
              {sections.map((section) => (
                <MenuItem key={section.id} value={section.id.toString()}>
                  {section.title} {/* Make sure this is a valid string */}
                </MenuItem>
              ))}
            </TextField>

            {/* Submit and Cancel buttons */}
            <div className="flex items-center gap-4">
              <Button variant="contained" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outlined" color="error" type="reset" onClick={handleReset}>
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
  );
};

export default AddNewOption;
