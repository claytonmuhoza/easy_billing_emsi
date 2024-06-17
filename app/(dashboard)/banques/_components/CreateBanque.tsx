'use facture?.client'

import { banqueSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Label, TextInput } from 'flowbite-react'
import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { create_banque_action } from '@/actions/banque_action'
import { useBanqueContext } from '@/context/BanqueContext'
import * as z from 'zod'
import FormAlert from '../../_components/FormAlert'
export default function CreateBanque() {
   const { closeModal } = useBanqueContext()
   const [isPending, startTransition] = useTransition()
   const [actionError, setActionError] = useState<string | undefined>()
   const [actionSuccess, setActionSuccess] = useState<string | undefined>()
   const form = useForm<z.infer<typeof banqueSchema>>({
      resolver: zodResolver(banqueSchema),
      defaultValues: {
         nom_banque: '',
         numero_compte_banque: '',
      },
   })
   const onSubmit = (values: z.infer<typeof banqueSchema>) => {
      startTransition(() => {
         setActionSuccess(undefined)
         setActionError(undefined)
         create_banque_action(values).then((data) => {
            if (data.success) {
               setActionSuccess(data.msg)
               form.reset()
               closeModal()
            } else {
               setActionError(data.msg)
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
               name="nom_banque"
               render={({ field, fieldState: { invalid, error } }) => (
                  <div className="justify-cent flex w-full flex-col items-center gap-1">
                     <Label className="w-full" htmlFor="nom_banque">
                        Nom de la banque
                     </Label>
                     <TextInput
                        {...field}
                        className="w-full"
                        id="nom_banque"
                        autoComplete="off"
                        type="text"
                        placeholder={`Entrez le Libellé de la Catégorie`}
                        required
                        helperText={
                           invalid ? (
                              <>
                                 <span className="font-medium text-red-500">
                                    Oops!
                                    {error?.message}
                                 </span>
                              </>
                           ) : (
                              <></>
                           )
                        }
                     />
                  </div>
               )}
            />
            <Controller
               control={form.control}
               name="numero_compte_banque"
               render={({ field, fieldState: { invalid, error } }) => (
                  <div className="justify-cent flex w-full flex-col items-center gap-1">
                     <Label className="w-full" htmlFor="numero_compte_banque">
                        Numéro de compte
                     </Label>
                     <TextInput
                        {...field}
                        className="w-full"
                        id="numero_compte_banque"
                        type="text"
                        placeholder={`Entrez le numéro de compte`}
                        required
                        helperText={
                           invalid ? (
                              <>
                                 <span className="font-medium text-red-500">
                                    Oops!
                                 </span>{' '}
                                 {error?.message}
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
