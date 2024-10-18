// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import CardStatVertical from '@components/card-statistics/Vertical'
import WeeklyOverview from '@/views/dashboards/WeeklyOverview'
import SocialNetworkVisits from '@/views/dashboards/SocialNetworkVisits'
import MonthlyBudget from '@/views/dashboards/MonthlyBudget'
import MeetingSchedule from '@/views/dashboards/MeetingSchedule'
import ExternalLinks from '@/views/dashboards/ExternalLinks'
import PaymentHistory from '@/views/dashboards/PaymentHistory'
import SalesInCountries from '@/views/dashboards/SalesInCountries'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

// Data Imports
import { getUserData } from '@/app/server/actions'

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/user-list` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */

/* const getUserData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/apps/user-list`)

  if (!res.ok) {
    throw new Error('Failed to fetch userData')
  }

  return res.json()
} */

const DashboardCRM = async () => {
  // Vars
  const data = await getUserData()
  const serverMode = getServerMode()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={3} md={3}>
        <CardStatVertical
          stats='155k'
          title='RDHS Batticaloa'
          trendNumber='22%'
          chipText='Last 4 Month'
          avatarColor='primary'
          avatarIcon='ri-shopping-cart-line'
          avatarIconSize={24}
          avatarSkin='light'
          chipColor='secondary'
        />
      </Grid>
      <Grid item xs={12} sm={3} md={3}>
        <CardStatVertical
          stats='$13.4k'
          title='RDHS Kalmunai'
          trendNumber='38%'
          chipText='Last Six Months'
          avatarColor='success'
          avatarIcon='ri-handbag-line'
          avatarIconSize={24}
          avatarSkin='light'
          chipColor='secondary'
        />
      </Grid>
      <Grid item xs={12} sm={3} md={3}>
        <CardStatVertical
          stats='$13.4k'
          title='RDHS Ampara'
          trendNumber='38%'
          chipText='Last Six Months'
          avatarColor='success'
          avatarIcon='ri-handbag-line'
          avatarIconSize={24}
          avatarSkin='light'
          chipColor='secondary'
        />
      </Grid>
      <Grid item xs={12} sm={3} md={3}>
        <CardStatVertical
          stats='$13.4k'
          title='RDHS Trincomalee'
          trendNumber='38%'
          chipText='Last Six Months'
          avatarColor='success'
          avatarIcon='ri-handbag-line'
          avatarIconSize={24}
          avatarSkin='light'
          chipColor='secondary'
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <SalesInCountries />
      </Grid>
      {/* <Grid item xs={12} sm={6} md={4}>
        <WeeklyOverview serverMode={serverMode} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <SocialNetworkVisits />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <MonthlyBudget />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <MeetingSchedule />
      </Grid> */}
      {/* <Grid item xs={12} sm={6} md={4}>
        <ExternalLinks serverMode={serverMode} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <PaymentHistory serverMode={serverMode} />
      </Grid> */}
    </Grid>
  )
}

export default DashboardCRM
