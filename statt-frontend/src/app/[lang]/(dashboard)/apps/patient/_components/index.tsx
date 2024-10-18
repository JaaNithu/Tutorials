// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import PatientListTable from './PatientListTable'

const PatientList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PatientListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default PatientList
