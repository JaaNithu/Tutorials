// Component Imports
import AssetTypeList from './_components'

// Data Imports
import { getUserData } from '@/app/server/actions'

const AssetTypeListApp = async () => {
  // Vars
  const data = await getUserData()

  return <AssetTypeList userData={data} />
}

export default AssetTypeListApp
