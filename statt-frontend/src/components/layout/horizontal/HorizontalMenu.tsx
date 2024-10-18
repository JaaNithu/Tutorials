// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'
import Chip from '@mui/material/Chip'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import HorizontalNav, { Menu, SubMenu, MenuItem } from '@menu/horizontal-menu'
import VerticalNavContent from './VerticalNavContent'

// import { GenerateHorizontalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Styled Component Imports
import StyledHorizontalNavExpandIcon from '@menu/styles/horizontal/StyledHorizontalNavExpandIcon'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/horizontal/menuItemStyles'
import menuRootStyles from '@core/styles/horizontal/menuRootStyles'
import verticalMenuItemStyles from '@core/styles/vertical/menuItemStyles'
import verticalNavigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'

// Menu Data Imports
// import menuData from '@/data/navigation/horizontalMenuData'

type RenderExpandIconProps = {
  level?: number
}

type RenderVerticalExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ level }: RenderExpandIconProps) => (
  <StyledHorizontalNavExpandIcon level={level}>
    <i className='ri-arrow-right-s-line' />
  </StyledHorizontalNavExpandIcon>
)

const RenderVerticalExpandIcon = ({ open, transitionDuration }: RenderVerticalExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const HorizontalMenu = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  // Hooks
  const verticalNavOptions = useVerticalNav()
  const theme = useTheme()
  const { settings } = useSettings()
  const params = useParams()

  // Vars
  const { skin } = settings
  const { transitionDuration } = verticalNavOptions
  const { lang: locale, id } = params

  return (
    <HorizontalNav
      switchToVertical
      verticalNavContent={VerticalNavContent}
      verticalNavProps={{
        customStyles: verticalNavigationCustomStyles(verticalNavOptions, theme),
        backgroundColor:
          skin === 'bordered' ? 'var(--mui-palette-background-paper)' : 'var(--mui-palette-background-default)'
      }}
    >
      <Menu
        rootStyles={menuRootStyles(theme)}
        renderExpandIcon={({ level }) => <RenderExpandIcon level={level} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuItemStyles={menuItemStyles(settings, theme, 'ri-circle-fill')}
        popoutMenuOffset={{
          mainAxis: ({ level }) => (level && level > 0 ? 4 : 14),
          alignmentAxis: 0
        }}
        verticalMenuProps={{
          menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme, settings),
          renderExpandIcon: ({ open }) => (
            <RenderVerticalExpandIcon open={open} transitionDuration={transitionDuration} />
          ),
          renderExpandedMenuItemIcon: { icon: <i className='ri-circle-fill' /> }
        }}
      >
        <SubMenu label={dictionary['navigation'].apps} icon={<i className='ri-mail-open-line' />}>
          <MenuItem href={`/${locale}/dashboards`} icon={<i className='ri-home-smile-line' />}>
            {dictionary['navigation'].dashboards}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/user`} icon={<i className='ri-user-3-line' />}>
  {dictionary['navigation'].user} {/* User icon */}
</MenuItem>

<MenuItem href={`/${locale}/apps/section`} icon={<i className='ri-layout-grid-line' />}>
  {dictionary['navigation'].section} {/* Section icon */}
</MenuItem>

<MenuItem href={`/${locale}/apps/question`} icon={<i className='ri-question-line' />}>
  {dictionary['navigation'].question} {/* Question icon */}
</MenuItem>

{/* <MenuItem href={`/${locale}/apps/option`} icon={<i className='ri-checkbox-multiple-line' />}>
  {dictionary['navigation'].option}
</MenuItem> */}

<MenuItem href={`/${locale}/apps/userAnswer`} icon={<i className='ri-checkbox-circle-line' />}>
  {dictionary['navigation'].userAnswer} {/* User Answer icon */}
</MenuItem>


<MenuItem href={`/${locale}/apps/userProgress`} icon={<i className='ri-bar-chart-line' />}>
  {dictionary['navigation'].userProgress} {/* Progress icon */}
</MenuItem>
          {/* <SubMenu label={dictionary['navigation'].humanResources} icon={<i className='ri-file-list-2-line' />}>
            <MenuItem href={`/${locale}/apps/human-resources/human-resources-roles`}>{dictionary['navigation'].humanResourcesRoles}</MenuItem>
            <MenuItem href={`/${locale}/apps/human-resources/add-human-resources`}>
              {dictionary['navigation'].addHumanresources}
            </MenuItem>
          </SubMenu>
          <SubMenu label={dictionary['navigation'].assets} icon={<i className='ri-file-list-2-line' />}>
            <MenuItem href={`/${locale}/apps/assets/asset-types`}>{dictionary['navigation'].assetsType}</MenuItem>
            <MenuItem href={`/${locale}/apps/assets/assets`}>
              {dictionary['navigation'].assets}
            </MenuItem>
          </SubMenu>*/}
        </SubMenu> 
      </Menu>
      {/* <Menu
        rootStyles={menuRootStyles(theme)}
        renderExpandIcon={({ level }) => <RenderExpandIcon level={level} />}
        menuItemStyles={menuItemStyles(settings, theme)}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        popoutMenuOffset={{
          mainAxis: ({ level }) => (level && level > 0 ? 14 : 12),
          alignmentAxis: 0
        }}
        verticalMenuProps={{
          menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme, settings),
          renderExpandIcon: ({ open }) => (
            <RenderVerticalExpandIcon open={open} transitionDuration={transitionDuration} />
          ),
          renderExpandedMenuItemIcon: { icon: <i className='ri-circle-fill' /> }
        }}
      >
        <GenerateHorizontalMenu menuData={menuData(dictionary, params)} />
      </Menu> */}
    </HorizontalNav>
  )
}

export default HorizontalMenu
