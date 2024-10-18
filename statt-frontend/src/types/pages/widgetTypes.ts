// MUI Imports
import type { ChipProps } from '@mui/material'

// Type Imports
import type { ThemeColor } from '@core/types'
import type { CustomAvatarProps } from '@core/components/mui/Avatar'

export type CardStatsHorizontalProps = {
  title: string
  stats: string
  avatarIcon: string
  trendNumber: string
  trend?: string
  avatarColor?: ThemeColor
  avatarIconSize?: number
  avatarSize?: number
  avatarSkin?: CustomAvatarProps['skin']
}

export type CardStatsVerticalProps = {
  title: string
  stats: string
  avatarIcon: string
  chipText: string
  chipColor?: ChipProps['color']
  trendNumber: string
  trend?: 'positive' | 'negative'
  avatarColor?: ThemeColor
  avatarIconSize?: number
  avatarSize?: number
  avatarSkin?: CustomAvatarProps['skin']
}

export type CardStatsCharacterProps = {
  stats: string
  title: string
  trendNumber: string
  chipText: string
  src: string
  trend?: 'positive' | 'negative'
  chipColor?: ThemeColor
}

export type CardStatsType = {
  statsVertical: CardStatsVerticalProps[]
  statsCharacter: CardStatsCharacterProps[]
  statsHorizontal: CardStatsHorizontalProps[]
}
