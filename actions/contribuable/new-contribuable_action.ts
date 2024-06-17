'use server'
import db from '@/helpers/db'
import { contribuableConfCreationSchema } from '@/schemas'
import { z } from 'zod'
import { login_credential_only, login_result } from '../ebms/login'
export const NewContribuableAction = async (
   values: z.infer<typeof contribuableConfCreationSchema>,
) => {
   const validateField = contribuableConfCreationSchema.safeParse(values)
   if (!validateField.success) {
      return { error: 'Le formulaire est invalide. Veuillez réessayer!' }
   } else {
      const {
         nom,
         nif,
         rc,
         tva,
         tc,
         contact_bp,
         contact_email,
         contact_telephone,
         prelevement_forfetaire,
         direction_fiscale,
         forme_juridique,
         raison_social,
         adresse_province,
         adresse_commune,
         adresse_avenue,
         adresse_quartier,
         adresse_numero,
         identifiant_systeme,
         mot_de_passe_systeme,
      } = validateField.data
      try {
         const result: login_result = await login_credential_only(
            identifiant_systeme,
            mot_de_passe_systeme,
         )
         if (!result.success) {
            return { error: result.msg }
         } else {
            await db.societe.create({
               data: {
                  identifiant_system: identifiant_systeme,
                  mot_de_passe_system: mot_de_passe_systeme,
                  nom,
                  nif,
                  rc,
                  tva,
                  tc,
                  type_societe: validateField.data.type_contribuable.toString(),
                  forme_juridique,
                  prelevement_forfetaire,
                  direction_fiscale,
                  secteur_activite: raison_social,
                  telephone: contact_telephone,
                  email: contact_email,
                  bp: contact_bp,
                  adresse_province,
                  adresse_commune,
                  adresse_quartier,
                  adresse_avenue,
                  adresse_numero,
               },
            })
            return { success: 'Le contribuable a été enregistré  avec succès' }
         }
      } catch (e) {
         //todo
         return {
            error: "une erreur s'est produit lors de l'enregistrement dans la base de donnée! Réessayez",
         }
      }
   }
}
