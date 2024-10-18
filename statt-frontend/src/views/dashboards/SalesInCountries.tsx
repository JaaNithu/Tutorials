// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Components Imports
import OptionMenu from '@core/components/option-menu'

// Styles Imports
import tableStyles from '@core/styles/table.module.css'

type DataType = {
  country: string
  sales: string
  trend: string
  trendNumber: string
}

// Vars
const data: DataType[] = [
  {
    country: 'RDHS Batticaloa',
    sales: '18,879',
    trendNumber: '15%',
    trend: 'down'
  },
  {
    country: 'RDHS Kalmunai',
    sales: '10,357',
    trendNumber: '85%',
    trend: 'up'
  },
  {
    country: 'RDHS Ampara',
    sales: '4,860',
    trendNumber: '88%',
    trend: 'up'
  },
  {
    country: 'RDHS Trincomalee',
    sales: '899',
    trendNumber: '16%',
    trend: 'down'
  }
]

const SalesInCountries = () => {
  return (
    <Card>
      <CardHeader
        title='Dengue Patients List'
        action={<OptionMenu options={['Last 28 Days', 'Last Month', 'Last Year']} />}
      />
      <CardContent className='flex flex-col gap-11'>
        <div className='flex flex-col gap-1.5'>
          <div className='flex items-center gap-2'>
            <Typography variant='h1'>Total - 24,895</Typography>
          </div>
          <Typography>Last 90 Days</Typography>
        </div>
        <div>
          <table className={tableStyles.table}>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className='first:border-bs'>
                  <td className='!pis-0'>
                    <Typography color='text.primary'>{row.country}</Typography>
                  </td>
                  <td className='text-end'>
                    <Typography color='text.primary' className='font-medium'>
                      {row.sales}
                    </Typography>
                  </td>
                  <td className='!pie-0'>
                    <div className='flex gap-2 items-center justify-end !pie-0'>
                      <Typography color='text.primary' className='font-medium'>
                        {row.trendNumber}
                      </Typography>
                      <i
                        className={classnames(
                          row.trend === 'up' ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line',
                          row.trend === 'up' ? 'text-error' : 'text-success'
                        )}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default SalesInCountries
