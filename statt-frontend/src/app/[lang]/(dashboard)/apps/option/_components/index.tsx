// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports

// Component Imports
import OptionListTable from './OptionListTable'

const OptionList = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <OptionListTable />
      </Grid>
    </Grid>
  )
}

export default OptionList
