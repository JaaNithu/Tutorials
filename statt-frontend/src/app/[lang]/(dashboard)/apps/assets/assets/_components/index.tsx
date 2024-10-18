// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import AssetsListTable from './AssetsListTable'

const AssetsList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <AssetsListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default AssetsList
