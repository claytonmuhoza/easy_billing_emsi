'use facture?.client'

import { Button, Label, TextInput } from 'flowbite-react'

import { editUnitAction } from '@/actions/unite_mesure_action'
import { useUniteMesureContext } from '@/context/UniteMesureContext'
import { UniteMesureSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { UniteMesure } from '@prisma/client'
import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import FormAlert from '../../_components/FormAlert'
export default function EditUniteMesure({
   uniteMesure,
}: {
   uniteMesure: UniteMesure
}) {
   const [isPending, startTransition] = useTransition()
   const [actionError, setActionError] = useState<string | undefined>()
   const [actionSuccess, setActionSuccess] = useState<string | undefined>()
   const { closeModal } = useUniteMesureContext()
   const form = useForm<z.infer<typeof UniteMesureSchema>>({
      resolver: zodResolver(UniteMesureSchema),
      defaultValues: {
         nom: uniteMesure.libelle,
      },
   })
   const onSubmit = (values: z.infer<typeof UniteMesureSchema>) => {
      startTransition(() => {
         setActionSuccess(undefined)
         setActionError(undefined)
         editUnitAction(values, uniteMesure.id).then((data) => {
            setActionError(data.error)
            setActionSuccess(data.success)
            if (data.success) {
               form.reset()
               closeModal()
            }
         })
      })
   }
   return (
      <div className="flex w-full flex-col items-center justify-center gap-2 p-4 sm:gap-3">
         <FormAlert
            success={actionSuccess}
            setSuccess={setActionSuccess}
            error={actionError}
            setError={setActionError}
         />
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center justify-center gap-2 p-4 sm:gap-3"
         >
            {/* <HiUser className="material-icons-round text-24 font-medium text-dark dark:text-primary md:text-24" /> */}
            <Controller
               control={form.control}
               name="nom"
               render={({ field, fieldState: { invalid } }) => (
                  <div className="justify-cent flex w-full flex-col items-center gap-1">
                     <Label className="w-full" htmlFor="remember">
                        Nom de l'Unté de Mésure
                     </Label>
                     <TextInput
                        {...field}
                        color={invalid ? 'failure' : ''}
                        className="w-full text-dark"
                        id="nif"
                        type="text"
                        placeholder={`Entrez le Libellé de l'Unté de Mésure`}
                        required
                     />
                  </div>
               )}
            />

            <div className="flex w-full flex-col items-center justify-center gap-1">
               <Button
                  isProcessing={isPending}
                  type="submit"
                  className="w-full hover:bg-dark"
               >
                  Enregistrer
               </Button>
            </div>
         </form>
      </div>
   )
}
