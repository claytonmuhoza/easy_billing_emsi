import { auth } from '@/auth'
import { getSocieteId } from '@/data/societe'
const SettingsPage = async () => {
   const session = await auth()
   const societe_id = await getSocieteId()
   return (
      <div>
         {JSON.stringify(session)} <div>societe id {societe_id}</div>
      </div>
   )
}
export default SettingsPage
