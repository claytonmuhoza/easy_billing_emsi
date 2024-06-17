'use client'
import { modifier_client_action } from '@/actions/client_action'
import { useClientContext } from '@/context/ClientContext'
import { ClientShema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Client } from '@prisma/client'
import { Alert, Button, Label, Radio, Select, TextInput } from 'flowbite-react'
import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
export default function EditClient({ client }: { client: Client }) {
   const { closeModal } = useClientContext()
   const [isPending, startTransition] = useTransition()
   const [error, setError] = useState<string | undefined>()
   const [success, setSuccess] = useState<string | undefined>()
   const form = useForm<z.infer<typeof ClientShema>>({
      resolver: zodResolver(ClientShema),
      defaultValues: {
         nif_entreprise_client: client.NIF ? client.NIF : '',
         secteur_activite_client: client.secteur_activite,
         type_client: client.type_personne === 'morale' ? 'morale' : 'physique',
         nom_entreprise_client: client.nom,
         numero_telephone_client: client.client_telephone,
         boite_postal_client: client.client_boite_postal,
         adresse_mail_client: client.client_mail,
         adresse_client: client.adresse,
         personne_contact_client: client.personne_contact_telephone,
         contact_personne_contact_client: client.personne_contact_nom,
         localisation_client: client.isLocalClient ? 'local' : 'etranger',
         assujetti_tva_client: client.assujetti_tva,
      },
   })
   const submit = (values: z.infer<typeof ClientShema>) => {
      setError(undefined)
      setSuccess(undefined)
      startTransition(() => {
         modifier_client_action(values, client.id).then((data) => {
            if (data.success === false) {
               setError(data.msg)
            } else {
               form.reset()
               setSuccess('Le client a été modifier avec succès')
               closeModal()
            }
         })
      })
   }
   return (
      <form
         onSubmit={form.handleSubmit(submit)}
         className="flex flex-col items-center justify-center gap-2 p-4 sm:gap-3"
      >
         {error ? <Alert color="failure">{error}</Alert> : <></>}
         {success ? <Alert color="success">{success}</Alert> : <></>}
         {/* <HiUser className="material-icons-round text-24 font-medium text-dark dark:text-primary md:text-24" /> */}
         <div className="flex w-full flex-col gap-2 sm:gap-3">
            <div className="items-cen flex flex-col gap-4 md:flex-row">
               <Controller
                  control={form.control}
                  name="nif_entreprise_client"
                  render={({ field, fieldState: { invalid, error } }) => (
                     <div className="justify-cent flex w-full flex-col items-center gap-1">
                        <Label className="w-full" htmlFor="remember">
                           NIF du Client
                        </Label>
                        <TextInput
                           disabled={isPending}
                           className="w-full"
                           {...field}
                           color={invalid ? 'failure' : undefined}
                           id="nif"
                           type="text"
                           helperText={
                              invalid ? (
                                 <>
                                    <span className="font-medium">Erreur!</span>{' '}
                                    {error?.message}
                                 </>
                              ) : (
                                 ''
                              )
                           }
                           autoComplete="off"
                           placeholder="NIF du Client"
                        />
                     </div>
                  )}
               />
               <Controller
                  control={form.control}
                  name="type_client"
                  render={({ field, fieldState: { invalid, error } }) => (
                     <div className="justify-cent flex w-full flex-col items-center gap-1">
                        <Label className="w-full">Type de Client</Label>
                        <Select
                           {...field}
                           disabled={isPending}
                           color={invalid ? 'failure' : undefined}
                           helperText={
                              invalid ? (
                                 <>
                                    <span className="font-medium">Erreur!</span>{' '}
                                    {error?.message}
                                 </>
                              ) : (
                                 ''
                              )
                           }
                           className="w-full"
                        >
                           <option selected disabled>
                              Select Client Type
                           </option>
                           <option
                              value="physique"
                              selected={form.watch().type_client === 'physique'}
                           >
                              Personne physique
                           </option>
                           <option
                              value="morale"
                              selected={form.watch().type_client === 'morale'}
                           >
                              Personne morale
                           </option>
                        </Select>
                     </div>
                  )}
               />
            </div>

            <div className="items-cen flex flex-col gap-4 md:flex-row">
               <Controller
                  control={form.control}
                  name="nom_entreprise_client"
                  render={({ field, fieldState: { invalid, error } }) => (
                     <div className="justify-cent flex w-full flex-col items-center gap-1">
                        <Label className="w-full" htmlFor="remember">
                           Nom de l'entreprise ou de la personne physique
                        </Label>
                        <TextInput
                           disabled={isPending}
                           className="w-full"
                           {...field}
                           color={invalid ? 'failure' : undefined}
                           id="nif"
                           type="text"
                           placeholder="nom du client"
                           helperText={
                              invalid ? (
                                 <>
                                    <span className="font-medium">Erreur!</span>{' '}
                                    {error?.message}
                                 </>
                              ) : (
                                 ''
                              )
                           }
                           required
                        />
                     </div>
                  )}
               />
               <Controller
                  control={form.control}
                  name="secteur_activite_client"
                  render={({ field, fieldState: { invalid, error } }) => (
                     <div className="justify-cent flex w-full flex-col items-center gap-1">
                        <Label className="w-full" htmlFor="remember">
                           Secteur d'Activité
                        </Label>
                        <TextInput
                           disabled={isPending}
                           className="w-full"
                           {...field}
                           color={invalid ? 'failure' : undefined}
                           helperText={
                              invalid ? (
                                 <>
                                    <span className="font-medium">Erreur!</span>{' '}
                                    {error?.message}
                                 </>
                              ) : (
                                 ''
                              )
                           }
                           id="nif"
                           type="text"
                           placeholder="Secteur d'Activité"
                        />
                     </div>
                  )}
               />
            </div>
            <div className="items-cen flex w-full flex-col gap-4 md:flex-row">
               <fieldset className="flex w-full flex-col gap-2">
                  <div className="flex items-center gap-2">
                     <Radio
                        disabled={isPending}
                        id="united-state"
                        {...form.register('localisation_client')}
                        checked={form.watch().localisation_client === 'local'}
                        value="local"
                        defaultChecked
                     />
                     <Label htmlFor="united-state">Client Local</Label>
                  </div>
                  <div className="flex items-center gap-2">
                     <Radio
                        disabled={isPending}
                        id="germany"
                        checked={
                           form.watch().localisation_client === 'etranger'
                        }
                        {...form.register('localisation_client')}
                        value="etranger"
                     />
                     <Label htmlFor="germany">Client Etranger</Label>
                  </div>
               </fieldset>
               <Controller
                  control={form.control}
                  name="assujetti_tva_client"
                  render={({ field: { onChange, onBlur, value } }) => (
                     <fieldset className="flex w-full flex-col gap-2">
                        {/* <Label className="w-full">Type de Client</Label> */}
                        <div className="flex items-center gap-2">
                           <Radio
                              disabled={isPending}
                              id="united-state"
                              onBlur={onBlur} // notify when input is touched
                              onChange={() => onChange(true)} // send value to hook form
                              checked={value === true}
                           />
                           <Label htmlFor="united-state">
                              Assujetti à la TVA
                           </Label>
                        </div>
                        <div className="flex w-full items-center gap-2">
                           <Radio
                              disabled={isPending}
                              id="germany"
                              onBlur={onBlur} // notify when input is touched
                              onChange={() => onChange(false)} // send value to hook form
                              checked={value === false}
                           />
                           <Label htmlFor="germany">
                              Non Assujetti à la TVA
                           </Label>
                        </div>
                     </fieldset>
                  )}
               />
            </div>
            <div className="items-cen flex flex-col gap-4 md:flex-row">
               <Controller
                  control={form.control}
                  name="numero_telephone_client"
                  render={({ field, fieldState: { invalid, error } }) => (
                     <div className="justify-cent flex w-full flex-col items-center gap-1">
                        <Label className="w-full" htmlFor="remember">
                           Numero de Telepehone
                        </Label>
                        <TextInput
                           disabled={isPending}
                           className="w-full"
                           {...field}
                           id="nif"
                           color={invalid ? 'failure' : undefined}
                           helperText={
                              invalid ? (
                                 <>
                                    <span className="font-medium">Erreur!</span>{' '}
                                    {error?.message}
                                 </>
                              ) : (
                                 ''
                              )
                           }
                           type="text"
                           placeholder="Numero de Telepehone"
                        />
                     </div>
                  )}
               />
               <Controller
                  control={form.control}
                  name="boite_postal_client"
                  render={({ field, fieldState: { invalid, error } }) => (
                     <div className="justify-cent flex w-full flex-col items-center gap-1">
                        <Label className="w-full" htmlFor="remember">
                           Boite Postale
                        </Label>
                        <TextInput
                           disabled={isPending}
                           className="w-full"
                           {...field}
                           helperText={
                              invalid ? (
                                 <>
                                    <span className="font-medium">Erreur!</span>{' '}
                                    {error?.message}
                                 </>
                              ) : (
                                 ''
                              )
                           }
                           color={invalid ? 'failure' : undefined}
                           id="nif"
                           type="text"
                           placeholder="Boite Postale"
                        />
                     </div>
                  )}
               />
            </div>
            <div className="items-cen flex flex-col gap-4 md:flex-row">
               <Controller
                  control={form.control}
                  name="adresse_mail_client"
                  render={({ field, fieldState: { invalid, error } }) => (
                     <div className="justify-cent flex w-full flex-col items-center gap-1">
                        <Label className="w-full" htmlFor="remember">
                           Adresse Mail
                        </Label>
                        <TextInput
                           disabled={isPending}
                           className="w-full"
                           {...field}
                           helperText={
                              invalid ? (
                                 <>
                                    <span className="font-medium">Erreur!</span>{' '}
                                    {error?.message}
                                 </>
                              ) : (
                                 ''
                              )
                           }
                           color={invalid ? 'failure' : undefined}
                           id="nif"
                           type="text"
                           placeholder="Adresse Mail"
                        />
                     </div>
                  )}
               />
               <Controller
                  control={form.control}
                  name="adresse_client"
                  render={({ field, fieldState: { invalid, error } }) => (
                     <div className="justify-cent flex w-full flex-col items-center gap-1">
                        <Label className="w-full" htmlFor="remember">
                           Adresse
                        </Label>
                        <TextInput
                           disabled={isPending}
                           className="w-full"
                           {...field}
                           helperText={
                              invalid ? (
                                 <>
                                    <span className="font-medium">Erreur!</span>{' '}
                                    {error?.message}
                                 </>
                              ) : (
                                 ''
                              )
                           }
                           color={invalid ? 'failure' : undefined}
                           id="nif"
                           type="text"
                           placeholder="Adresse"
                        />
                     </div>
                  )}
               />
            </div>
            <div className="items-cen flex flex-col gap-4 md:flex-row">
               <Controller
                  control={form.control}
                  name="personne_contact_client"
                  render={({ field, fieldState: { invalid, error } }) => (
                     <div className="justify-cent flex w-full flex-col items-center gap-1">
                        <Label className="w-full" htmlFor="remember">
                           Personne de Contact
                        </Label>
                        <TextInput
                           disabled={isPending}
                           className="w-full"
                           id="nif"
                           {...field}
                           color={invalid ? 'failure' : undefined}
                           helperText={
                              invalid ? (
                                 <>
                                    <span className="font-medium">Erreur!</span>{' '}
                                    {error?.message}
                                 </>
                              ) : (
                                 ''
                              )
                           }
                           type="text"
                           placeholder="Personne de Contact"
                        />
                     </div>
                  )}
               />
               <Controller
                  control={form.control}
                  name="contact_personne_contact_client"
                  render={({ field, fieldState: { invalid, error } }) => (
                     <div className="justify-cent flex w-full flex-col items-center gap-1">
                        <Label className="w-full" htmlFor="remember">
                           Contact de la Personne
                        </Label>
                        <TextInput
                           disabled={isPending}
                           className="w-full"
                           id="nif"
                           {...field}
                           color={invalid ? 'failure' : undefined}
                           helperText={
                              invalid ? (
                                 <>
                                    <span className="font-medium">Erreur!</span>{' '}
                                    {error?.message}
                                 </>
                              ) : (
                                 ''
                              )
                           }
                           type="text"
                           placeholder="Contact de la Personne"
                        />
                     </div>
                  )}
               />
            </div>
         </div>
         <div className="flex w-full flex-col items-center justify-center gap-1">
            <Button
               disabled={isPending}
               className="w-full hover:bg-dark"
               type="submit"
            >
               {isPending ? 'Modification en cours ...' : 'Modifier'}
            </Button>
         </div>
      </form>
   )
}
