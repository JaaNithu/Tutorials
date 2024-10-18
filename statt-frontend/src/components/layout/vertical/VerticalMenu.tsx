// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'
import Chip from '@mui/material/Chip'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Menu Data Imports
// import menuData from '@/data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const params = useParams()
  const { isBreakpointReached } = useVerticalNav()

  // Vars
  const { transitionDuration } = verticalNavOptions
  const { lang: locale, id } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
          className: 'bs-full overflow-y-auto overflow-x-hidden',
          onScroll: container => scrollMenu(container, false)
        }
        : {
          options: { wheelPropagation: false, suppressScrollX: true },
          onScrollY: container => scrollMenu(container, true)
        })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
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

        {/* <SubMenu label={dictionary['navigation'].humanResources} icon={<i className='ri-user-shared-line' />}>
          <MenuItem href={`/${locale}/apps/human-resources/human-resources-roles`}>{dictionary['navigation'].humanResourcesRoles}</MenuItem>
          <MenuItem href={`/${locale}/apps/human-resources/add-human-resources`}>
            {dictionary['navigation'].addHumanresources}
          </MenuItem>
        </SubMenu>
        <SubMenu label={dictionary['navigation'].assets} icon={<i className='ri-table-line' />}>
          <MenuItem href={`/${locale}/apps/assets/asset-types`}>{dictionary['navigation'].assetsType}</MenuItem>
          <MenuItem href={`/${locale}/apps/assets/assets`}>
            {dictionary['navigation'].assets}
          </MenuItem>
        </SubMenu>
      </Menu> */}
      {/* <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary, params)} />*/}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
