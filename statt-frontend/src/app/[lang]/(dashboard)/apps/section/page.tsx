// Component Imports
import UserList from './_components'

// Data Imports
import { getUserData } from '@/app/server/actions'

const SectionListApp = async () => {
  // Vars
  const data = await getUserData()

  return <UserList />
}

export default SectionListApp
