// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import UserProgressListTable from './UserProgressListTable'

const UserProgressList = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProgressListTable />
      </Grid>
    </Grid>
  )
}

export default UserProgressList
