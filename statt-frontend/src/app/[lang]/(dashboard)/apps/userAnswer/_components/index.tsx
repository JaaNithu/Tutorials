// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import UserAnswerListTable from './UserAnswerListTable'

const UserAnswerList = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserAnswerListTable />
      </Grid>
    </Grid>
  )
}

export default UserAnswerList
