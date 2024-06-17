'use server'

import { getSocieteId } from '@/data/societe'
import db from '@/helpers/db'
import { url } from '@/helpers/url'
import { z } from 'zod'
import { getOBRToken } from './login'
import { get_invoice_result } from './schema'

export const get_invoice_action = async (invoice_identifier: string) => {
   const societe_id = await getSocieteId()
   if (societe_id) {
      const tokenObject = await getOBRToken()
      if (tokenObject.success) {
         try {
            const res = await fetch(url + 'getInvoice', {
               headers: { Authorization: 'Bearer ' + tokenObject.result.token },
               method: 'post',
               body: JSON.stringify({ invoice_identifier }),
               cache: 'no-store',
            })
            if (res.ok) {
               const data: z.infer<typeof get_invoice_result> = await res.json()
               data.status = res.status
               return data
            } else {
               const data: z.infer<typeof get_invoice_result> = await res.json()
               data.status = res.status
               await db.logOBR.create({
                  data: {
                     lien: 'checkTIN',
                     methode: 'post',
                     code_reponse: res.status,
                     message_reponse: data.msg,
                     result: '',
                     societe_id,
                  },
               })
               return data
            }
         } catch (e) {
            const data: z.infer<typeof get_invoice_result> = {
               success: false,
               msg: "vous n'etez pas connecté à internet",
            }
            return data
         }
      } else {
         if (tokenObject.status) {
            await db.logOBR.create({
               data: {
                  lien: 'login',
                  methode: 'post',
                  code_reponse: tokenObject.status,
                  message_reponse: tokenObject.msg,
                  result: '',
                  societe_id,
               },
            })
            const resultat: z.infer<typeof get_invoice_result> = {
               status: tokenObject.status,
               success: tokenObject.success,
               msg: tokenObject.msg,
            }
            return resultat
         } else {
            const resultat: z.infer<typeof get_invoice_result> = {
               success: tokenObject.success,
               msg: tokenObject.msg,
            }
            return resultat
         }
      }
   } else {
      const resultat: z.infer<typeof get_invoice_result> = {
         success: false,
         msg: "Une erreur s'est produit veuillez vous deconnectez puis vous reconnectez au système",
      }
      return resultat
   }
}
