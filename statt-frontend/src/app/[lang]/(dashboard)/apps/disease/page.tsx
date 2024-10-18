// Component Imports
import DiseaseList from './_components'

// Data Imports
import { getUserData } from '@/app/server/actions'

const DiseaseListApp = async () => {
  // Vars
  const data = await getUserData()

  return <DiseaseList userData={data} />
}

export default DiseaseListApp
