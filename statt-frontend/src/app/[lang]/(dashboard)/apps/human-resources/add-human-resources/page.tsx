// Component Imports
import HumanResourcesList from './_components'

// Data Imports
import { getUserData } from '@/app/server/actions'

const HumanResourcesListApp = async () => {
  // Vars
  const data = await getUserData()

  return <HumanResourcesList userData={data} />
}

export default HumanResourcesListApp
