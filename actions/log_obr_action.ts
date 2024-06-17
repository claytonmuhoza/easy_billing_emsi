'use server'
import { getSocieteId } from '@/data/societe'
import db from '@/helpers/db'

export const get_log_obr = async () => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      return await db.logOBR.findMany({
         where: { societe_id },
         orderBy: { date_envoi: 'desc' },
      })
   } else {
      return []
   }
}
