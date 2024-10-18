// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import HospitalListTable from './HospitalListTable'

const HospitalList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <HospitalListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default HospitalList
