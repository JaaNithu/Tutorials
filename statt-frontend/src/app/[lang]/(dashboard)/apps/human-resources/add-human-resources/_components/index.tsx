// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import HumanResourcesTable from './HumanResourcesListTable'

const HumanResources = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <HumanResourcesTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default HumanResources
