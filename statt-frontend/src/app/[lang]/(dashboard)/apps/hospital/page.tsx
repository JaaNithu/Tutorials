// Component Imports
import HospitalList from './_components'

// Data Imports
import { getUserData } from '@/app/server/actions'

const HospitalListApp = async () => {
  // Vars
  const data = await getUserData()

  return <HospitalList userData={data} />
}

export default HospitalListApp
