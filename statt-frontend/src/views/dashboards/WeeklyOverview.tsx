'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useColorScheme, useTheme } from '@mui/material/styles'

// Third Party Imports
import type { ApexOptions } from 'apexcharts'

// Type Imports
import type { SystemMode } from '@core/types'

// Components Imports
import OptionMenu from '@core/components/option-menu'

// Util Imports
import { rgbaToHex } from '@/utils/rgbaToHex'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const series = [
  {
    name: 'Sales',
    type: 'column',
    data: [85, 68, 56, 65, 65, 50, 39]
  },
  {
    type: 'line',
    name: 'Sales',
    data: [63, 38, 31, 45, 46, 27, 18]
  }
]

const WeeklyOverview = ({ serverMode }: { serverMode: SystemMode }) => {
  // Hooks
  const theme = useTheme()
  const { mode } = useColorScheme()

  // Vars
  const _mode = (mode === 'system' ? serverMode : mode) || serverMode

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 7,
        columnWidth: '35%',
        colors: {
          ranges: [
            {
              to: 50,
              from: 40,
              color: rgbaToHex(`rgb(${theme.palette.primary.mainChannel} / 1)`)
            }
          ]
        }
      }
    },
    markers: {
      size: 3.5,
      strokeWidth: 2,
      fillOpacity: 1,
      strokeOpacity: 1,
      colors: [rgbaToHex(`rgb(${theme.palette.background.paperChannel} / 1)`)],
      strokeColors: rgbaToHex(`rgb(${theme.palette.primary.mainChannel} / 1)`)
    },
    stroke: {
      width: [0, 2],
      colors: [theme.palette.customColors.trackBg, rgbaToHex(`rgb(${theme.palette.primary.mainChannel} / 1)`)]
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: [theme.palette.customColors.trackBg],
    grid: {
      strokeDashArray: 7,
      borderColor: rgbaToHex(`rgb(${theme.mainColorChannels[_mode]} / 0.12)`),
      padding: {
        left: -2,
        right: 8
      }
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      tickPlacement: 'on',
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      min: 0,
      max: 90,
      show: true,
      tickAmount: 3,
      labels: {
        offsetX: -10,
        formatter: value => `${value > 999 ? `${(value / 1000).toFixed(0)}` : value}k`,
        style: {
          fontSize: '0.8125rem',
          colors: rgbaToHex(`rgb(${theme.mainColorChannels[_mode]} / 0.4)`)
        }
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.xl,
        options: {
          plotOptions: {
            bar: { columnWidth: '35%' }
          }
        }
      },
      {
        breakpoint: 1445,
        options: {
          plotOptions: {
            bar: { columnWidth: '40%', borderRadius: 7 }
          }
        }
      },
      {
        breakpoint: 1368,
        options: {
          plotOptions: {
            bar: { borderRadius: 6 }
          }
        }
      },
      {
        breakpoint: 1201,
        options: {
          plotOptions: {
            bar: { columnWidth: '42%', borderRadius: 7 }
          }
        }
      },
      {
        breakpoint: 1080,
        options: {
          plotOptions: {
            bar: { borderRadius: 6 }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          chart: {
            height: 210
          },
          plotOptions: {
            bar: { columnWidth: '32%', borderRadius: 7 }
          }
        }
      },
      {
        breakpoint: 750,
        options: {
          plotOptions: {
            bar: { columnWidth: '38%', borderRadius: 6 }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: { columnWidth: '25%', borderRadius: 7 }
          }
        }
      },
      {
        breakpoint: 450,
        options: {
          plotOptions: {
            bar: { columnWidth: '35%' }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardHeader title='Weekly Overview' action={<OptionMenu options={['Refresh', 'Update', 'Share']} />} />
      <CardContent className='flex flex-col gap-6'>
        <AppReactApexCharts type='line' height={186} series={series} options={options} />
        <div className='flex items-center gap-4'>
          <Typography variant='h4'>62%</Typography>
          <Typography>Your sales performance is 45% 😎 better compared to last month</Typography>
        </div>
        <Button variant='contained' color='primary'>
          Details
        </Button>
      </CardContent>
    </Card>
  )
}

export default WeeklyOverview
