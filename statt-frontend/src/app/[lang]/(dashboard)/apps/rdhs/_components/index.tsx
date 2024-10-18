// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import RdhsListTable from './RdhsListTable'

const RdhsList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <RdhsListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default RdhsList
