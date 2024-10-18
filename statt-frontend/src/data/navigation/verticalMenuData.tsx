// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

type Params = {
  [key: string]: string | string[]
}

const verticalMenuData = (
  dictionary: Awaited<ReturnType<typeof getDictionary>>,
  params: Params
): VerticalMenuDataType[] => [
    // This is how you will normally render menu section
    {
      label: dictionary['navigation'].dashboards,
      href: '/dashboards',
      icon: 'ri-home-smile-line'
    },
    {
      label: dictionary['navigation'].rdhs,
      href: '/apps/rdhs',
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
    }
  ]


export default verticalMenuData
