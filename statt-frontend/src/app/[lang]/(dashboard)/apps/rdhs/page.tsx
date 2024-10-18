// Component Imports
import RdhsList from './_components'

// Data Imports
import { getUserData } from '@/app/server/actions'

const RdhsListApp = async () => {
  // Vars
  const data = await getUserData()

  return <RdhsList userData={data} />
}

export default RdhsListApp
