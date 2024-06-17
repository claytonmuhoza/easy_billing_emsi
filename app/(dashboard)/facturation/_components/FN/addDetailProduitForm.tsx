'use facture?.client'

import { add_details_facture } from '@/actions/facture_action'
import { useFacturationContext } from '@/context/FacturationContext'
import { detail_facture_form_schema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Produit } from '@prisma/client'
import { Alert, Button, Label, TextInput } from 'flowbite-react'
import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { BtnBack } from '../content'
interface NewFactureProps {
   product: Produit
   setSelectProduit: (produit: Produit | undefined) => void
   setShowDetailFacture: (b: boolean) => void
}

export default function AddDetailProduitForm({
   product,
   setSelectProduit,
   setShowDetailFacture,
}: NewFactureProps) {
   const [isPending, startTransition] = useTransition()
   const { facture, openModal } = useFacturationContext()

   const form = useForm<z.infer<typeof detail_facture_form_schema>>({
      resolver: zodResolver(detail_facture_form_schema),
      defaultValues: {
         facture_id: facture?.id,
         produit_id: product.id,
         stockable: product.stockable,
         stock_actuel: product.stock_actuel,
         quantite: 0,
         prix_vente_ttc: product.prix_unitaire_vente_TTC,
      },
   })
   const [error, setError] = useState<string | undefined>(undefined)
   const [success, setSuccess] = useState<string | undefined>(undefined)
   const formSubmit = (values: z.infer<typeof detail_facture_form_schema>) => {
      setError(undefined),
         setSuccess(undefined),
         startTransition(() => {
            add_details_facture(values)
               .then((data) => {
                  form.reset()
                  if (data.success) {
                     if (data.result) {
                        openModal('details', data.result)
                        setShowDetailFacture(false)
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
            <BtnBack handler={() => setSelectProduit(undefined)} />
         </div>
         {error ? <Alert color="failure">{error}</Alert> : <></>}
         {success ? <Alert color="success">{success}</Alert> : <></>}

         <div className="flex w-full flex-col gap-2 ">
            <div className="flex flex-col">
               <span>
                  Ajouter <span className="font-bold">{product.nom}</span> à la
                  facture{' '}
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
                        type="number"
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
                        autoComplete="off"
                        color={invalid ? 'failure' : undefined}
                        required
                     />
                  </div>
               )}
            />
            {product.stockable ? (
               <div>Quantité disponible en stock: {product.stock_actuel}</div>
            ) : (
               <></>
            )}

            <Button type="submit">
               {isPending ? 'Ajout en cours...' : 'Ajouter'}
            </Button>
         </form>
      </div>
   )
}
