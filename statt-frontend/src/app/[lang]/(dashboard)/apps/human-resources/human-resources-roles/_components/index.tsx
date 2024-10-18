// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import HumanResourcesRolesTable from './HumanResourcesRolesListTable'

const HumanResourcesRoles = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <HumanResourcesRolesTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default HumanResourcesRoles
