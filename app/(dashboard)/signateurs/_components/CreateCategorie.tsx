'use facture?.client'

import { newCategorieAction } from '@/actions/categorie_action'
import { CategorieSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Label, TextInput } from 'flowbite-react'
import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'

import * as z from 'zod'
import FormAlert from '../../_components/FormAlert'
export default function CreateCategorie() {
   const [isPending, startTransition] = useTransition()
   const [actionError, setActionError] = useState<string | undefined>()
   const [actionSuccess, setActionSuccess] = useState<string | undefined>()
   const form = useForm<z.infer<typeof CategorieSchema>>({
      resolver: zodResolver(CategorieSchema),
      defaultValues: {
         nom: '',
      },
   })
   const onSubmit = (values: z.infer<typeof CategorieSchema>) => {
      startTransition(() => {
         setActionSuccess(undefined)
         setActionError(undefined)
         newCategorieAction(values).then((data) => {
            setActionError(data.error)
            setActionSuccess(data.success)
            if (data.success) {
               form.reset()
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
                        Libellé de la Catégorie
                     </Label>
                     <TextInput
                        {...field}
                        className="w-full"
                        id="nif"
                        type="text"
                        placeholder={`Entrez le Libellé de la Catégorie`}
                        required
                        helperText={
                           invalid ? (
                              <>
                                 <span className="font-medium text-red-500">
                                    Oops!
                                 </span>{' '}
                                 le nom est obligatoire!
                              </>
                           ) : (
                              <></>
                           )
                        }
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
