'use facture?.client'

import { get_all_banque_action } from '@/actions/banque_action'
import { create_facture_normale } from '@/actions/facture_action'
import { useFacturationContext } from '@/context/FacturationContext'
import { etape_1_facture_form_schema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Banque, Client } from '@prisma/client'
import { Button, Label, Select, TextInput } from 'flowbite-react'
import {
   Dispatch,
   SetStateAction,
   useEffect,
   useState,
   useTransition,
} from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { BtnBack } from './content'
interface NewFactureProps {
   client: Client
   setClient: Dispatch<SetStateAction<Client | undefined>>
}

export default function NewFacture({ client, setClient }: NewFactureProps) {
   const [banks, setBanque] = useState<Banque[]>([])
   const [loading_Banque, setLoadingBanque] = useState(true)
   const { openModal } = useFacturationContext()
   const form = useForm<z.infer<typeof etape_1_facture_form_schema>>({
      resolver: zodResolver(etape_1_facture_form_schema),
      defaultValues: {
         devise: 'BIF',
         client_id: client.id,
         type_paiement: '1',
      },
   })
   const [isPending, startTransition] = useTransition()
   const formSubmit = (values: z.infer<typeof etape_1_facture_form_schema>) => {
      startTransition(() => {
         create_facture_normale(values).then((data) => {
            openModal('details', data.facture)
         })
      })
   }
   useEffect(() => {
      setLoadingBanque(true)
      get_all_banque_action('').then((data) => {
         setBanque(data)
         setLoadingBanque(false)
      })
   }, [])
   return (
      <div className="flex w-full flex-col items-center justify-center gap-2 p-4 sm:gap-3">
         <div className="flex w-full flex-row justify-start px-4">
            <BtnBack handler={() => setClient(undefined)} />
         </div>
         <div className="flex w-full flex-col gap-2 px-4">
            <div className="flex flex-col">
               <span>FACTURE DU CLIENT </span>
               <span>{client.nom}</span>
            </div>
         </div>
         <form
            onSubmit={form.handleSubmit(formSubmit)}
            className="flex w-full flex-col items-center justify-center gap-2 p-4 sm:gap-3"
         >
            {/* <HiUser className="material-icons-round text-24 font-medium text-dark dark:text-primary md:text-24" /> */}
            <div className="flex w-full flex-col gap-2 sm:gap-3">
               <div className="items-cen flex flex-col gap-4 md:flex-row">
                  <Controller
                     control={form.control}
                     name="devise"
                     render={({ field, fieldState: { invalid } }) => (
                        <div className="justify-cent flex w-full flex-col items-center gap-1">
                           <Label
                              color={invalid ? 'failure' : undefined}
                              className="w-full"
                           >
                              Type de Monnaie
                           </Label>
                           <Select
                              className="w-full"
                              {...field}
                              disabled={isPending}
                              color={invalid ? 'failure' : undefined}
                           >
                              <option selected defaultValue="BIF">
                                 BIF
                              </option>
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                           </Select>
                        </div>
                     )}
                  />
                  {form.watch().devise !== 'BIF' && (
                     <div className="justify-cent flex w-full flex-col items-center gap-1">
                        <Label className="w-full" htmlFor="remember">
                           Taux en BIF
                        </Label>
                        <TextInput
                           disabled={isPending}
                           className="w-full"
                           id="nif"
                           type="number"
                           placeholder={`Taux de change du ${
                              form.watch().devise
                           } en BIF`}
                           required
                        />
                     </div>
                  )}
               </div>
               <div className="items-cen flex flex-col gap-4 md:flex-row">
                  <Controller
                     control={form.control}
                     name="type_paiement"
                     render={({ field, fieldState: { invalid } }) => (
                        <div className="justify-cent flex w-full flex-col items-center gap-1">
                           <Label
                              color={invalid ? 'failure' : undefined}
                              className="w-full"
                           >
                              Type de Paiement
                           </Label>
                           <Select
                              disabled={isPending}
                              {...field}
                              color={invalid ? 'failure' : undefined}
                              className="w-full"
                           >
                              <option selected value="1">
                                 ESPECE
                              </option>
                              <option value="2">BANQUE</option>
                              <option value="3">CREDIT</option>
                              <option value="4">AUTRE</option>
                           </Select>
                        </div>
                     )}
                  />
                  {form.watch().type_paiement === '2' && (
                     <Controller
                        control={form.control}
                        name="banque_id"
                        shouldUnregister
                        render={({ field, fieldState: { invalid, error } }) => (
                           <div className="justify-cent flex w-full flex-col items-center gap-1">
                              <Label className="w-full">BANQUE</Label>
                              <Select
                                 color={invalid ? 'failure' : undefined}
                                 {...field}
                                 className="w-full"
                                 disabled={isPending}
                                 helperText={
                                    invalid ? (
                                       <>
                                          <span className="font-medium">
                                             Oops!
                                          </span>{' '}
                                          {error ? error?.message : ''}
                                       </>
                                    ) : (
                                       <></>
                                    )
                                 }
                              >
                                 {loading_Banque ? (
                                    <option disabled selected>
                                       chargement des banques
                                    </option>
                                 ) : (
                                    <>
                                       <option selected disabled>
                                          Selectionner une Banque
                                       </option>
                                       {banks?.map(
                                          ({ id, nom_bank, numero_compte }) => (
                                             <option
                                                value={id}
                                                key={numero_compte + ' banks'}
                                             >
                                                {nom_bank + ' ' + numero_compte}
                                             </option>
                                          ),
                                       )}
                                    </>
                                 )}
                              </Select>
                           </div>
                        )}
                     />
                  )}
               </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-1">
               <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full hover:bg-dark"
               >
                  {isPending ? 'Enregistrement en cours...' : 'Enregistrer'}
               </Button>
            </div>
         </form>
      </div>
   )
}
