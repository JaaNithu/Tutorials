// Component Imports
import UserProgressList from './_components'

// Data Imports
import { getUserData } from '@/app/server/actions'

const UserProgressListApp = async () => {
  // Vars
  const data = await getUserData()

  return <UserProgressList />
}

export default UserProgressListApp
