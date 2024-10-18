import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { QuestionType, SectionType } from '@/types/apps/userTypes'; // Adjust this import based on your project structure
import axios from 'axios';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 600,
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
  fontSize: '1.5rem',
};

const labelStyle = {
  mb: 1,
  fontSize: '1rem',
};

const buttonStyle = {
  mt: 3,
  width: '100%',
};

interface ViewSectionProps {
  open: boolean;
  handleClose: () => void;
  sectionId: string | null;
}

const ViewSection: React.FC<ViewSectionProps> = ({ open, handleClose, sectionId }) => {
  const [section, setSection] = useState<SectionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionType[]>([]); // State for storing fetched questions

  useEffect(() => {
    const fetchSection = async () => {
      setLoading(true); // Set loading to true before the API call
      if (sectionId) {
        try {
          // Fetch section data
          const response = await axios.get(`http://localhost:3001/section/${sectionId}`);
          setSection(response.data); // Set the fetched section

          // Fetch questions for the specific section by sectionId
          const questionsResponse = await axios.get(`http://localhost:3001/questions/section/${sectionId}`, {
            params: { sectionId: sectionId }, // Send sectionId as a parameter
          });

          setQuestions(questionsResponse.data); // Set the fetched questions
        } catch (error) {
          console.error('Failed to fetch section or questions', error);
          setError('Failed to fetch section or questions'); // Set error state
        } finally {
          setLoading(false); // Set loading to false after the API call completes
        }
      }
    };

    fetchSection();
  }, [sectionId]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!section) {
    return null; // No section found
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" component="h2" sx={titleStyle}>
          Section Details
        </Typography>

        {/* Label and Section Title */}
        <Typography sx={labelStyle}>Section Title:</Typography>
        <TextField
          variant="outlined"
          value={section.title || 'N/A'} // Safe navigation
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          sx={{ mb: 2 }}
        />

        {/* Label and Section Description */}
        <Typography sx={labelStyle}>Description:</Typography>
        <TextField
          variant="outlined"
          value={section.description || 'N/A'} // Safe navigation
          multiline
          rows={2}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          sx={{ mb: 2 }}
        />

        {/* Label and Related Questions */}
        <Typography sx={labelStyle}>Related Questions:</Typography>
        {questions.length > 0 ? (
          questions.map((question) => (
            <TextField
              key={question.id}
              variant="outlined"
              value={question.question} // Use the question text
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{ mb: 1 }}
            />
          ))
        ) : (
          <Typography>No questions available</Typography>
        )}

        <Button onClick={handleClose} variant="contained" color="primary" sx={buttonStyle}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ViewSection;
