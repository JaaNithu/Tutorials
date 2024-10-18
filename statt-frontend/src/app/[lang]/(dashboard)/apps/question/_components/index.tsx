// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import QuestionListTable from './QuestionListTable'

const QuestionList = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <QuestionListTable />
      </Grid>
    </Grid>
  )
}

export default QuestionList
