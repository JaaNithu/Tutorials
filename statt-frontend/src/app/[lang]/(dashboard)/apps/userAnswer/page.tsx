// Component Imports
import UserAnswerList from './_components'

// Data Imports
import { getUserData } from '@/app/server/actions'

const UserAnswerListApp = async () => {
  // Vars
  const data = await getUserData()

  return <UserAnswerList />
}

export default UserAnswerListApp
