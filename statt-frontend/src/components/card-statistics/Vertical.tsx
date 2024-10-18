// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

// Types Imports
import type { CardStatsVerticalProps } from '@/types/pages/widgetTypes'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

const CardStatVertical = (props: CardStatsVerticalProps) => {
  // Props
  const {
    title,
    avatarIcon,
    avatarIconSize,
    avatarColor,
    trend,
    chipColor,
    avatarSkin,
    avatarSize
  } = props

  return (
    <Card>
      <CardContent className='flex flex-wrap justify-between items-start gap-2'>
        <CustomAvatar size={avatarSize} variant='rounded' skin={avatarSkin} color={avatarColor}>
          <i className={classnames(avatarIcon, `text-[${avatarIconSize}px]`)} />
        </CustomAvatar>
      </CardContent>
      <CardContent className='flex flex-col items-start gap-4'>
        <div className='flex flex-col flex-wrap gap-1'>
          <Typography>{title}</Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardStatVertical
