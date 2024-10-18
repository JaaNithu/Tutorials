import { useEffect, useState } from 'react';
import { Button, Drawer, IconButton, TextField, Typography, Divider, Alert, Snackbar, Checkbox, FormControlLabel, MenuItem } from '@mui/material';
import React from 'react';
import { SectionType } from '@/types/apps/userTypes';

type Props = {
  open: boolean;
  handleClose: () => void;
};

type OptionType = {
  text: string;
  isCorrect: boolean;
};

type FormDataType = {
  question: string;
  sectionId: number;
  options: OptionType[];
};

const initialData: FormDataType = {
  question: '',
  sectionId: 0,
  options: [{ text: '', isCorrect: false }]
};

const AddNewQuestion = ({ open, handleClose }: Props) => {
  const [formData, setFormData] = useState<FormDataType>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [sections, setSections] = useState<SectionType[]>([]);
  
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch('http://localhost:3001/section/');
        const data = await response.json();
        console.log("Fetched sections:", data);
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

    // Validate required fields
    if (!formData.question || !formData.sectionId || formData.options.length === 0) {
      setMessageType('error');
      setMessage('All fields are required, and at least one option is needed!');
      return;
    }

    // Validate if the selected section exists
    const sectionExists = sections.some(section => section.id === formData.sectionId);
    if (!sectionExists) {
      setMessageType('error');
      setMessage('Selected section does not exist. Please select a valid section.');
      return;
    }

    // Check for at least one correct answer
    const hasCorrectAnswer = formData.options.some(option => option.isCorrect);
    if (!hasCorrectAnswer) {
      setMessageType('error');
      setMessage('Please select a correct answer!');
      return;
    }

    setIsSubmitting(true);
    formData.sectionId = Number(formData.sectionId);
  };

  useEffect(() => {
    if (isSubmitting) {
      console.log("Form Data before submission:", formData);
      addQuestion();
    }
  }, [isSubmitting]);

  const handleReset = () => {
    handleClose();
    setFormData(initialData);
    setMessage(null);
  };

  const addQuestion = async () => {
    console.log("Form Data:", formData); // Check what is being sent
    try {
      const response = await fetch('http://localhost:3001/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error adding question');
      }

      const data = await response.json();
      setMessageType('success');
      setMessage('Question added successfully!');
      handleClose();
      setFormData(initialData);
    } catch (error) {
      setMessageType('error');
      setMessage('Failed to add question. Please try again.');
      console.error('Error adding question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { text: '', isCorrect: false }]
    });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = formData.options.map((option, i) =>
      i === index ? { ...option, text: value } : option
    );
    setFormData({ ...formData, options: newOptions });
  };

  const handleCorrectAnswerChange = (index: number) => {
    const newOptions = formData.options.map((option, i) => ({
      ...option,
      isCorrect: i === index
    }));
    setFormData({ ...formData, options: newOptions });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: name === 'sectionId' ? Number(value) : value,
    });
  };

  return (
    <>
      <Drawer open={open} anchor="right" onClose={handleReset} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}>
        <div className="flex items-center justify-between pli-5 plb-4">
          <Typography variant="h5">Add New Question</Typography>
          <IconButton size="small" onClick={handleReset}><i className="ri-close-line text-2xl" /></IconButton>
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
              onChange={(e) => setFormData({ ...formData, sectionId: Number(e.target.value) })}
            >
              {sections.map((section) => (
                <MenuItem key={section.id} value={section.id}>
                  {section.title}
                </MenuItem>
              ))}
            </TextField>

            <Typography variant="h6">Options</Typography>
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <TextField
                  label={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  fullWidth
                />
                <FormControlLabel
                  control={<Checkbox checked={option.isCorrect} onChange={() => handleCorrectAnswerChange(index)} />}
                  label="Correct"
                />
                <IconButton onClick={() => handleRemoveOption(index)}><i className="ri-delete-bin-line" /></IconButton>
              </div>
            ))}
            <Button variant="contained" onClick={handleAddOption}>Add Option</Button>
            <div className="flex items-center gap-4">
              <Button variant="contained" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
              <Button variant="outlined" color="error" type="reset" onClick={handleReset}>Cancel</Button>
            </div>
          </form>
        </div>
      </Drawer>

      <Snackbar open={!!message} autoHideDuration={4000} onClose={() => setMessage(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setMessage(null)} severity={messageType}>{message}</Alert>
      </Snackbar>
    </>
  );
};

export default AddNewQuestion;
