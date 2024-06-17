'use server'

import { getSocieteId } from '@/data/societe'
import db from '@/helpers/db'
import { url } from '@/helpers/url'
import { z } from 'zod'
import { login_result_schema } from './schema'
export interface login_result {
   status?: number
   success: boolean
   msg: string
   result?: { token: string }
}

export const login_credential_only = async (
   username: string,
   password: string,
) => {
   try {
      const res = await fetch(url + 'login', {
         method: 'post',
         body: JSON.stringify({ username, password }),
         cache: 'no-store',
      })
      console.log(res)
      if (res.ok) {
         const data: z.infer<typeof login_result_schema> = await res.json()
         data.status = res.status
         return data
      } else {
         const data: z.infer<typeof login_result_schema> = await res.json()
         data.status = res?.status
         return data
      }
   } catch (e) {
      console.log(e)
      const data: z.infer<typeof login_result_schema> = {
         success: false,
         msg: "vous n'etez pas connecté à internet",
      }
      return data
   }
}
export const login_credential_only_burundi_clay = async (
   username: string,
   password: string,
) => {
   try {
      const res = await fetch('https://ebms.obr.gov.bi:8443/ebms_api/login', {
         method: 'post',
         body: JSON.stringify({ username, password }),
         cache: 'no-store',
      })
      console.log(res)
      if (res.ok) {
         const data: z.infer<typeof login_result_schema> = await res.json()
         data.status = res.status
         return data
      } else {
         const data: z.infer<typeof login_result_schema> = await res.json()
         data.status = res?.status
         return data
      }
   } catch (e) {
      console.log(e)
      const data: z.infer<typeof login_result_schema> = {
         success: false,
         msg: "vous n'etez pas connecté à internet",
      }
      return data
   }
}
export const getOBRToken = async () => {
   //get credential from data base
   const societe_id = await getSocieteId()
   if (societe_id) {
      try {
         const societe = await db.societe.findUnique({
            where: { id: societe_id },
         })
         if (societe) {
            return await login_credential_only(
               societe.identifiant_system,
               societe.mot_de_passe_system,
            )
         } else {
            const resultat: z.infer<typeof login_result_schema> = {
               success: false,
               msg: 'impossible de trouver la societe connecter. veuillez vous déconnecter puis vous reconnecter de nouveau!',
            }
            return resultat
         }
      } catch (e) {
         const resultat: z.infer<typeof login_result_schema> = {
            success: false,
            msg: "une erreur inattendu s'est produit lors de la connexion à la base de donnée. Réesayez!",
         }
         return resultat
      }
   } else {
      const resultat: z.infer<typeof login_result_schema> = {
         success: false,
         msg: "Vous n'etez pas connecter",
      }
      return resultat
   }
}
export const getOBRTokenBurundiClay = async () => {
   //get credential from data base
   const societe_id = await getSocieteId()
   if (societe_id) {
      try {
         const societe = await db.societe.findUnique({
            where: { id: societe_id },
         })
         if (societe) {
            return await login_credential_only(
               societe.identifiant_system,
               societe.mot_de_passe_system,
            )
         } else {
            const resultat: z.infer<typeof login_result_schema> = {
               success: false,
               msg: 'impossible de trouver la societe connecter. veuillez vous déconnecter puis vous reconnecter de nouveau!',
            }
            return resultat
         }
      } catch (e) {
         const resultat: z.infer<typeof login_result_schema> = {
            success: false,
            msg: "une erreur inattendu s'est produit lors de la connexion à la base de donnée. Réesayez!",
         }
         return resultat
      }
   } else {
      const resultat: z.infer<typeof login_result_schema> = {
         success: false,
         msg: "Vous n'etez pas connecter",
      }
      return resultat
   }
}
export const token = async () => {
   fetch(url + 'login', { method: 'post' })
}
