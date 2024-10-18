// Component Imports
import AssetsList from './_components'

// Data Imports
import { getUserData } from '@/app/server/actions'

const AssetsListApp = async () => {
  // Vars
  const data = await getUserData()

  return <AssetsList userData={data} />
}

export default AssetsListApp
