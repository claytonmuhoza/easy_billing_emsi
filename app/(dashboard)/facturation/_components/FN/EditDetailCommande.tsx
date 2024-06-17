'use facture?.client'

import { modifier_details_facture } from '@/actions/facture_action'
import { tout_taxe_comprise_prix } from '@/app/(dashboard)/_components/util_javascript'
import { useFacturationContext } from '@/context/FacturationContext'
import { detail_facture_form_schema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Prisma } from '@prisma/client'
import { Alert, Button, Label, TextInput } from 'flowbite-react'
import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { BtnBack } from '../content'
interface NewFactureProps {
   detailFacture: DetailsFacture
   setDetailFacture: (detailFacture: DetailsFacture | undefined) => void
}
const detailsIncludes = Prisma.validator<Prisma.DetailFactureDefaultArgs>()({
   include: {
      facture: true,
      produit: true,
   },
})
type DetailsFacture = Prisma.DetailFactureGetPayload<typeof detailsIncludes>
export default function EditDetailFacture({
   detailFacture,
   setDetailFacture,
}: NewFactureProps) {
   const [isPending, startTransition] = useTransition()
   const { openModal } = useFacturationContext()

   const form = useForm<z.infer<typeof detail_facture_form_schema>>({
      resolver: zodResolver(detail_facture_form_schema),
      defaultValues: {
         facture_id: detailFacture.facture.id,
         produit_id: detailFacture.produit.id,
         stockable: detailFacture.produit.stockable,
         stock_actuel: detailFacture.produit.stock_actuel,
         quantite: detailFacture.quantite,
         prix_vente_ttc: tout_taxe_comprise_prix
            ? detailFacture.prix_vente_unitaire
            : detailFacture.prix_unitaire_vente_hors_tva,
      },
   })
   const [error, setError] = useState<string | undefined>(undefined)
   const [success, setSuccess] = useState<string | undefined>(undefined)
   const formSubmit = (values: z.infer<typeof detail_facture_form_schema>) => {
      setError(undefined),
         setSuccess(undefined),
         startTransition(() => {
            modifier_details_facture(values, detailFacture.id)
               .then((data) => {
                  if (data.success) {
                     form.reset()
                     if (data.result) {
                        openModal('details', data.result)
                        setDetailFacture(undefined)
                     }

                     setSuccess(data.msg)
                  } else {
                     setError(data.msg)
                  }
               })
               .catch(() => {
                  setError(
                     "une erreur s'est produit lors de l'ajout du produit",
                  )
               })
         })
   }

   return (
      <div className="flex w-full flex-col items-center justify-center gap-2 p-4 sm:gap-3">
         <div className="flex w-full flex-row justify-start px-4">
            <BtnBack handler={() => setDetailFacture(undefined)} />
         </div>
         {error ? <Alert color="failure">{error}</Alert> : <></>}
         {success ? <Alert color="success">{success}</Alert> : <></>}

         <div className="flex w-full flex-col gap-2 ">
            <div className="flex flex-col">
               <span>
                  Modifier{' '}
                  <span className="font-bold">{detailFacture.produit.nom}</span>{' '}
               </span>
            </div>
         </div>
         <form
            onSubmit={form.handleSubmit(formSubmit)}
            className="flex w-full flex-col gap-4"
         >
            <Controller
               control={form.control}
               name="prix_vente_ttc"
               render={({ field, fieldState: { invalid, error } }) => (
                  <div>
                     <div className="mb-2 block">
                        <Label
                           htmlFor="prix_vente_t_t"
                           value="Prix de vente tous taxe comprise"
                        />
                     </div>
                     <TextInput
                        id="prix_vente_t_t"
                        {...field}
                        disabled={isPending}
                        color={invalid ? 'failure' : undefined}
                        autoComplete="off"
                        type="text"
                        helperText={
                           invalid ? (
                              <>
                                 <span className="font-medium">Oops!</span>{' '}
                                 {error ? error?.message : ''}
                              </>
                           ) : (
                              <></>
                           )
                        }
                        placeholder="Prix de vente tous taxe comprise"
                        required
                     />
                  </div>
               )}
            />

            <Controller
               control={form.control}
               name="quantite"
               render={({ field, fieldState: { invalid, error } }) => (
                  <div>
                     <div className="mb-2 block">
                        <Label
                           color={invalid ? 'failure' : undefined}
                           htmlFor="quantite"
                           value="Quantité"
                        />
                     </div>
                     <TextInput
                        id="quantite"
                        {...field}
                        disabled={isPending}
                        autoComplete="off"
                        helperText={
                           invalid ? (
                              <>
                                 <span className="font-medium">Oops!</span>{' '}
                                 {error ? error?.message : ''}
                              </>
                           ) : (
                              <></>
                           )
                        }
                        color={invalid ? 'failure' : undefined}
                        required
                     />
                  </div>
               )}
            />

            <Button type="submit">
               {isPending ? 'Modification en cours...' : 'Modifier'}
            </Button>
         </form>
      </div>
   )
}
