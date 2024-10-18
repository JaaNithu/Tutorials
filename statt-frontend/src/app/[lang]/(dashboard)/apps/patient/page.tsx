// Component Imports
import PatientList from './_components'

// Data Imports
import { getUserData } from '@/app/server/actions'

const PatientListApp = async () => {
  // Vars
  const data = await getUserData()

  return <PatientList userData={data} />
}

export default PatientListApp
