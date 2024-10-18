import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { QuestionType } from '@/types/apps/userTypes'; // Adjust this import based on your project structure
import axios from 'axios';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 600, // Increase maximum width
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  outline: 'none',
};

const titleStyle = {
  mb: 2,
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: '1.5rem', // Increase font size for the title
};

const labelStyle = {
  mb: 1,
  fontSize: '1rem',
};

const buttonStyle = {
  mt: 3,
  width: '100%', // Make button full width
};

interface ViewQuestionProps {
  open: boolean;
  handleClose: () => void;
  questionId: string | null;
}

const ViewQuestion: React.FC<ViewQuestionProps> = ({ open, handleClose, questionId }) => {
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (questionId) {
        try {
          const response = await axios.get(`http://localhost:3001/questions/${questionId}`);
          setQuestion(response.data);
        } catch (err) {
          setError('Failed to fetch question details.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuestion();
  }, [questionId]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!question) {
    return null; // No question found
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" component="h2" sx={titleStyle}>
          Question Details
        </Typography>

        {/* Label and Question Text */}
        <Typography sx={labelStyle}>Question:</Typography>
        <TextField
          variant="outlined"
          value={question.question}
          multiline
          rows={2}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          sx={{ mb: 2 }}
        />

        {/* Label and Section */}
        <Typography sx={labelStyle}>Section:</Typography>
        <TextField
          variant="outlined"
          value={question.section ? question.section.title : 'N/A'}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          sx={{ mb: 2 }}
        />

        {/* Label and Options */}
        <Typography sx={labelStyle}>Options:</Typography>
        {question.options && question.options.length > 0 ? (
          question.options.map((option) => (
            <TextField
              key={option.id}
              variant="outlined"
              value={option.text}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{ mb: 1 }}
            />
          ))
        ) : (
          <Typography>No options available</Typography>
        )}

        {/* Label and Correct Answers */}
        <Typography sx={labelStyle}>Correct Answers:</Typography>
        <TextField
          variant="outlined"
          value={
            question.options && question.options.length > 0
              ? question.options.filter(option => option.isCorrect).map(option => option.text).join(', ')
              : 'N/A'
          }
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          sx={{ mb: 2 }}
        />

        <Button onClick={handleClose} variant="contained" color="primary" sx={buttonStyle}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ViewQuestion;
