// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

type Params = {
  [key: string]: string | string[]
}

const horizontalMenuData = (
  dictionary: Awaited<ReturnType<typeof getDictionary>>,
  params: Params
): HorizontalMenuDataType[] => [
    {
      label: dictionary['navigation'].dashboards,
      href: '/dashboards',
      icon: 'ri-home-smile-line'
    },
    {
      label: dictionary['navigation'].rdhs,
      href: '/user',
      icon: 'ri-user-line'
    },
    {
      label: dictionary['navigation'].hospital,
      href: '/apps/hospital',
      icon: 'ri-user-line'
    },
    {
      label: dictionary['navigation'].patient,
      href: '/apps/patient',
      icon: 'ri-user-line'
    },
    {
      label: dictionary['navigation'].humanResources,
      icon: 'ri-more-line',
      children: [
        {
          label: dictionary['navigation'].humanResourcesRoles,
          href: '/apps/human-resources/human-resources-roles',
          icon: 'ri-user-line'
        },
        {
          label: dictionary['navigation'].addHumanresources,
          href: '/apps/human-resources/add-human-resources',
          icon: 'ri-user-line'
        }
      ]
    }
  ]

export default horizontalMenuData
