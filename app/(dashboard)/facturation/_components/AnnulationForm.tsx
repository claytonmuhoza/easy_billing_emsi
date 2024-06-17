import { annulation_facture_action } from '@/actions/facture_action'
import { useFacturationContext } from '@/context/FacturationContext'
import { annulation_facture_schema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Label, TextInput } from 'flowbite-react'
import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
const AnnulationForm = () => {
   const { facture, closeModal } = useFacturationContext()
   const [isPending, startTransition] = useTransition()
   const [error, setError] = useState<undefined | string>(undefined)
   const form = useForm<z.infer<typeof annulation_facture_schema>>({
      resolver: zodResolver(annulation_facture_schema),
      defaultValues: { motif: '' },
   })
   const submitForm = (value: z.infer<typeof annulation_facture_schema>) => {
      setError(undefined)
      if (facture) {
         startTransition(() => {
            annulation_facture_action(facture.id, value.motif)
               .then((data) => {
                  if (data.success) {
                     closeModal()
                  } else {
                     setError(data.msg)
                  }
               })
               .catch(() => {
                  setError("Une erreur innatendu s'est produit. Réessayer")
               })
         })
      } else {
         setError("La facture n'est pas selectionner")
      }
   }
   return (
      <form onSubmit={form.handleSubmit(submitForm)}>
         {error ? <Alert color="failure">{error}</Alert> : <></>}
         <div>Annulation de la facture numéro {facture?.numero_facture}</div>
         <div>Client: {facture?.client.nom}</div>
         <Controller
            control={form.control}
            name="motif"
            render={({ field, fieldState: { invalid } }) => (
               <div className="mt-4">
                  <Label className="w-full" htmlFor="motif">
                     Motif d'annulation de la facture
                  </Label>
                  <TextInput
                     {...field}
                     className="w-full"
                     id="motif"
                     autoComplete="off"
                     color={invalid ? 'failure' : undefined}
                     disabled={isPending}
                     type="text"
                     placeholder={`Entrer le motif d'annulation`}
                     required
                  />
               </div>
            )}
         />
         <div className="aligns-center flex justify-center gap-5">
            <Button type="submit" disabled={isPending} className="my-4">
               Confirmer
            </Button>
            <Button
               color="failure"
               className="my-4"
               onClick={() => closeModal()}
            >
               Annuler
            </Button>
         </div>
      </form>
   )
}
export default AnnulationForm
