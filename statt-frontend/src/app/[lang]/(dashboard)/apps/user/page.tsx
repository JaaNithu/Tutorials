// Component Imports
import UserList from './_components'

// Data Imports
import { getUserData } from '@/app/server/actions'

const UserListApp = async () => {
  // Vars
  const data = await getUserData()

  return <UserList />
}

export default UserListApp
