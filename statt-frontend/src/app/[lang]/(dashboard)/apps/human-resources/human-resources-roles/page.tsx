// Component Imports
import HumanResourcesRolesList from './_components'

// Data Imports
import { getUserData } from '@/app/server/actions'

const HumanResourcesRolesListApp = async () => {
  // Vars
  const data = await getUserData()

  return <HumanResourcesRolesList userData={data} />
}

export default HumanResourcesRolesListApp
