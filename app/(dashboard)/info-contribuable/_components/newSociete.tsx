'use client'

import { update_contribuable_action } from '@/actions/contribuable/update-contribuable_action'
import { contribuable_update_schema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Societe } from '@prisma/client'
import { Alert, Button, Label, Radio, Select, TextInput } from 'flowbite-react'
import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HiLocationMarker, HiOfficeBuilding, HiPhone } from 'react-icons/hi'
import { z } from 'zod'
const NewSocietePage = ({ contribuable }: { contribuable: Societe }) => {
   const [isPending, startTransition] = useTransition()
   const [errorMessage, setErrorMessage] = useState<string | undefined>()
   const [successMessage, setSuccessMessage] = useState<string | undefined>()
   const onSubmit = (values: z.infer<typeof contribuable_update_schema>) => {
      if (contribuable.id) {
         startTransition(() => {
            setSuccessMessage(undefined)
            setErrorMessage(undefined)
            update_contribuable_action(values, contribuable.id).then((data) => {
               if (data.error) {
                  setErrorMessage(data.error)
               }
               if (data.success) {
                  setSuccessMessage(data.success)
               }
            })
         })
      } else {
         setSuccessMessage('undefined')
         setErrorMessage(
            "Une erreur s'est produit lors de la recuperation de l'id de la société réactualiser la page",
         )
      }
   }

   const form = useForm<z.infer<typeof contribuable_update_schema>>({
      resolver: zodResolver(contribuable_update_schema),
      defaultValues: {
         type_contribuable: contribuable?.type_societe
            ? contribuable.type_societe === '1'
               ? '1'
               : contribuable.type_societe === '2'
                 ? '2'
                 : undefined
            : '1',
         direction_fiscale: contribuable?.direction_fiscale
            ? contribuable.direction_fiscale === 'DGC'
               ? 'DGC'
               : contribuable.direction_fiscale === 'DMC'
                 ? 'DMC'
                 : contribuable.direction_fiscale == 'DPMC'
                   ? 'DPMC'
                   : undefined
            : 'DPMC',
         nom: contribuable?.nom,
         nif: contribuable?.nif,
         tva: contribuable?.tva ? contribuable.tva : false,
         tc: contribuable?.tc ? contribuable?.tc : false,
         prelevement_forfetaire: contribuable?.prelevement_forfetaire
            ? contribuable.prelevement_forfetaire
            : false,
         rc: contribuable.rc ? contribuable.rc : '',
         contact_telephone: contribuable?.telephone
            ? contribuable.telephone
            : '',
         forme_juridique: contribuable.forme_juridique
            ? contribuable.forme_juridique
            : '',

         contact_bp: contribuable?.bp ? contribuable.bp : '',
         raison_social: contribuable.secteur_activite
            ? contribuable.secteur_activite
            : '',
         contact_email: contribuable?.email ? contribuable.email : '',
         adresse_province: contribuable?.adresse_province
            ? contribuable.adresse_province
            : '',
         adresse_commune: contribuable?.adresse_commune
            ? contribuable.adresse_commune
            : '',
         adresse_quartier: contribuable?.adresse_quartier
            ? contribuable.adresse_quartier
            : '',
         adresse_avenue: contribuable?.adresse_avenue
            ? contribuable.adresse_avenue
            : '',
         adresse_numero: contribuable?.adresse_numero
            ? contribuable.adresse_numero
            : '',
      },
   })
   return (
      <div className="flex h-full w-full  flex-row items-center justify-center p-4">
         <div className="borer-2 flex  w-full flex-col items-center justify-center rounded-xl bg-opacity-70 bg-clip-padding text-gray-700 backdrop-blur-sm backdrop-filter dark:border-gray-400 dark:bg-dark md:flex-row-reverse md:justify-between md:p-6 lg:w-10/12 md-max:gap-4 ">
            <div className="flex w-full flex-col gap-4 rounded-md border border-gray-700 p-4 py-6 md:p-6">
               <div className="flex flex-row items-center justify-between">
                  <div className="flex w-full flex-row items-center justify-start gap-4 ">
                     <span className="text-6 font-bold text-primary sm:text-8">
                        Easy
                     </span>
                     <span className="text-6 font-bold text-dark  dark:text-slate-200 sm:text-8">
                        {' '}
                        | BILLING
                     </span>
                  </div>
               </div>
               <div className="flex items-center gap-4 border-b border-gray-700 pb-2 text-5 font-semibold dark:text-slate-200">
                  <span>Informations sur le Contribuable</span>
                  <HiOfficeBuilding />
               </div>
               <form
                  className="w-md flex flex-col gap-4 text-gray-700 dark:text-slate-200"
                  onSubmit={form.handleSubmit(onSubmit)}
               >
                  <div className="flex w-full flex-col items-center justify-between md:flex-row md:gap-4">
                     <Controller
                        control={form.control}
                        name="nom"
                        render={({ field, fieldState: { invalid, error } }) => (
                           <div className="justify-cenetr flex  w-full flex-col ">
                              {' '}
                              <div className="mb-2 block">
                                 <Label
                                    htmlFor="nom_entreprise"
                                    value="Nom"
                                    color={invalid ? 'failure' : ''}
                                 />
                              </div>
                              <TextInput
                                 {...field}
                                 disabled={true}
                                 color={invalid ? 'failure' : ''}
                                 id="nom_entreprise"
                                 type="text"
                                 autoComplete="false"
                                 placeholder="Entrer le nom de l'entreprise ou de la personne physique"
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
                                 required
                              />
                           </div>
                        )}
                     />
                     <Controller
                        control={form.control}
                        name="nif"
                        render={({ field, fieldState: { invalid, error } }) => (
                           <div className="justify-cenetr flex  w-full flex-col ">
                              <div className="mb-2 block">
                                 <Label
                                    htmlFor="nif"
                                    value="NIF"
                                    color={invalid ? 'failure' : ''}
                                 />
                              </div>
                              <TextInput
                                 {...field}
                                 disabled={true}
                                 id="nif"
                                 type="text"
                                 placeholder="Entrer le NIF de l'entreprise ou de la personne physique"
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
                                 required
                              />
                           </div>
                        )}
                     />
                  </div>
                  <div className="flex w-full flex-col items-center justify-between md:flex-row md:gap-4">
                     <Controller
                        control={form.control}
                        name="rc"
                        render={({ field, fieldState: { invalid, error } }) => (
                           <div className="justify-cenetr flex  w-full flex-col ">
                              <div className="mb-2 block">
                                 <Label
                                    htmlFor="registre_commerce_entreprise"
                                    value="Registre de commerce"
                                    color={invalid ? 'failure' : ''}
                                 />
                              </div>
                              <TextInput
                                 {...field}
                                 disabled={isPending}
                                 autoComplete="false"
                                 id="registre_commerce_entreprise"
                                 type="text"
                                 placeholder="Entrer le nom de l'entreprise ou de la personne physique"
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
                                 required
                              />
                           </div>
                        )}
                     />
                     <Controller
                        control={form.control}
                        name="direction_fiscale"
                        render={({ field, fieldState: { invalid, error } }) => (
                           <div className="justify-cenetr flex  w-full flex-col ">
                              <div className="mb-2 block">
                                 <Label
                                    htmlFor="direction_fiscal_entreprise"
                                    value="Direction fiscal"
                                    color={invalid ? 'failure' : ''}
                                 />
                              </div>
                              <Select
                                 id="direction_fiscal_entreprise"
                                 {...field}
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
                                 required
                              >
                                 <option value="DPMC">DPMC</option>
                                 <option value="DMC">DMC</option>
                                 <option value="DGC">DGC</option>
                              </Select>
                           </div>
                        )}
                     />
                  </div>
                  <div className="flex w-full flex-col items-center justify-between md:flex-row md:gap-4">
                     <Controller
                        control={form.control}
                        name="type_contribuable"
                        render={({ field, fieldState: { invalid, error } }) => (
                           <div className="justify-cenetr flex  w-full flex-col ">
                              <div className="mb-2 block">
                                 <Label
                                    htmlFor="type_contribuable_entreprise"
                                    value="Type contribuable"
                                    color={invalid ? 'failure' : ''}
                                 />
                              </div>
                              <Select
                                 {...field}
                                 disabled={isPending}
                                 id="type_contribuable_entreprise"
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
                                 required
                              >
                                 <option value="2">Personne Morale</option>
                                 <option value="1">Personne physique</option>
                              </Select>
                           </div>
                        )}
                     />
                     <Controller
                        control={form.control}
                        name="forme_juridique"
                        render={({ field, fieldState: { invalid, error } }) => (
                           <div className="justify-cenetr flex  w-full flex-col ">
                              <div className="mb-2 block">
                                 <Label
                                    htmlFor="forme_juridique_entreprise"
                                    value="Forme juridique"
                                    color={invalid ? 'failure' : ''}
                                 />
                              </div>
                              <TextInput
                                 {...field}
                                 disabled={isPending}
                                 id="forme_juridique_entreprise"
                                 type="text"
                                 placeholder="Entrer la forme juridique du contribuable"
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
                                 required
                              />
                           </div>
                        )}
                     />
                  </div>
                  <div className="flex w-full flex-col items-center justify-between md:flex-row md:gap-4">
                     <Controller
                        control={form.control}
                        name="raison_social"
                        disabled={isPending}
                        render={({ field, fieldState: { invalid, error } }) => (
                           <div className="justify-cenetr flex  w-full flex-col ">
                              <div className="mb-2 block">
                                 <Label
                                    htmlFor="raison_social_entreprise"
                                    value="secteur d'activité"
                                    color={invalid ? 'failure' : ''}
                                 />
                              </div>
                              <TextInput
                                 {...field}
                                 id="raison_social_entreprise"
                                 type="text"
                                 placeholder="Entrer la raison sociel de l'entreprise"
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
                                 required
                              />
                           </div>
                        )}
                     />
                  </div>
                  <div className="flex w-full flex-col items-start justify-between md:flex-row md:items-center md:gap-4">
                     <Controller
                        control={form.control}
                        name="tva"
                        render={({ field: { onBlur, onChange, value } }) => (
                           <fieldset className="flex max-w-md flex-col gap-4">
                              <legend className="mb-4">
                                 Assujettit à la TVA
                              </legend>
                              <div className="flex items-center gap-2">
                                 <Radio
                                    id="oui_tva_entreprise"
                                    disabled={isPending}
                                    onBlur={onBlur} // notify when input is touched
                                    onChange={() => onChange(true)} // send value to hook form
                                    checked={value === true}
                                 />
                                 <Label htmlFor="oui_tva_entreprise">Oui</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                 <Radio
                                    id="non_tva_entreprise"
                                    disabled={isPending}
                                    onBlur={onBlur} // notify when input is touched
                                    onChange={() => onChange(false)} // send value to hook form
                                    checked={value === false}
                                 />
                                 <Label htmlFor="non_tva_entreprise">Non</Label>
                              </div>
                           </fieldset>
                        )}
                     />
                     <Controller
                        control={form.control}
                        name="tc"
                        render={({ field: { onBlur, onChange, value } }) => (
                           <fieldset className="flex max-w-md flex-col gap-4">
                              <legend className="mb-4">
                                 Assujettit à la Taxe de consommation
                              </legend>
                              <div className="flex items-center gap-2">
                                 <Radio
                                    id="oui_taxe_consomation_entreprise"
                                    disabled={isPending}
                                    onBlur={onBlur} // notify when input is touched
                                    onChange={() => onChange(true)} // send value to hook form
                                    checked={value === true}
                                 />
                                 <Label htmlFor="oui_taxe_consomation_entreprise">
                                    Oui
                                 </Label>
                              </div>
                              <div className="flex items-center gap-2">
                                 <Radio
                                    id="non_taxe_consomation_entreprise"
                                    disabled={isPending}
                                    onBlur={onBlur} // notify when input is touched
                                    onChange={() => onChange(false)} // send value to hook form
                                    checked={value === false}
                                 />
                                 <Label htmlFor="non_taxe_consomation_entreprise">
                                    Non
                                 </Label>
                              </div>
                           </fieldset>
                        )}
                     />
                     <Controller
                        control={form.control}
                        name="prelevement_forfetaire"
                        render={({ field: { onBlur, onChange, value } }) => (
                           <fieldset className="flex max-w-md flex-col gap-4">
                              <legend className="mb-4">
                                 Assujettit au prelevement forfetaire
                              </legend>
                              <div className="flex items-center gap-2">
                                 <Radio
                                    id="oui_prelevement_forfetaire_entreprise"
                                    disabled={isPending}
                                    onBlur={onBlur} // notify when input is touched
                                    onChange={() => onChange(true)} // send value to hook form
                                    checked={value === true}
                                 />
                                 <Label htmlFor="oui_prelevement_forfetaire_entreprise">
                                    Oui
                                 </Label>
                              </div>
                              <div className="flex items-center gap-2">
                                 <Radio
                                    id="non_prelevement_forfetaire_entreprise"
                                    disabled={isPending}
                                    onBlur={onBlur} // notify when input is touched
                                    onChange={() => onChange(false)} // send value to hook form
                                    checked={value === false}
                                 />
                                 <Label htmlFor="non_prelevement_forfetaire_entreprise">
                                    Non
                                 </Label>
                              </div>
                           </fieldset>
                        )}
                     />
                  </div>
                  <div className="flex items-center gap-4 border-b border-gray-700 pb-2 text-5 font-semibold dark:text-slate-200">
                     <span>Contacts</span>
                     <HiPhone />
                  </div>
                  <div className="flex w-full flex-col items-center justify-between md:flex-row md:gap-4">
                     <Controller
                        control={form.control}
                        name="contact_telephone"
                        render={({ field, fieldState: { invalid, error } }) => (
                           <div className="justify-cenetr flex  w-full flex-col ">
                              <div className="mb-2 block">
                                 <Label
                                    htmlFor="telephone_entreprise"
                                    value="Téléphone"
                                 />
                              </div>
                              <TextInput
                                 {...field}
                                 disabled={isPending}
                                 id="telephone_entreprise"
                                 type="text"
                                 placeholder="Entrer le numéro de téléphone"
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
                                 required
                              />
                           </div>
                        )}
                     />
                     <Controller
                        control={form.control}
                        name="contact_bp"
                        render={({ field, fieldState: { invalid, error } }) => (
                           <div className="justify-cenetr flex  w-full flex-col ">
                              <div className="mb-2 block">
                                 <Label
                                    htmlFor="boite_postale_entreprise"
                                    value="Boite postale(non obligatoire)"
                                    color={invalid ? 'failure' : ''}
                                 />
                              </div>
                              <TextInput
                                 disabled={isPending}
                                 id="boite_postale_entreprise"
                                 type="text"
                                 placeholder="Entrer la boite postale"
                                 {...field}
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
                              />
                           </div>
                        )}
                     />
                  </div>

                  <Controller
                     control={form.control}
                     name="contact_email"
                     render={({ field, fieldState: { invalid, error } }) => (
                        <div>
                           <div className="mb-2 block">
                              <Label htmlFor="email_entreprise" value="Email" />
                           </div>
                           <TextInput
                              disabled={isPending}
                              id="email_entreprise"
                              type="email"
                              placeholder="Entrer l'adresse email"
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
                              {...field}
                           />
                        </div>
                     )}
                  />
                  <div className="flex items-center gap-4 border-b border-b border-gray-700 pb-2 pb-2 text-5 font-semibold dark:text-slate-200">
                     <span>Adresse de l'entreprise</span>
                     <HiLocationMarker />
                  </div>
                  <div className="flex w-full flex-col items-center justify-between md:flex-row md:gap-4">
                     <Controller
                        control={form.control}
                        name="adresse_province"
                        render={({ field, fieldState: { invalid, error } }) => (
                           <div className="justify-cenetr flex  w-full flex-col ">
                              <div className="mb-2 block">
                                 <Label
                                    htmlFor="adresse_province_entreprise"
                                    value="Province"
                                 />
                              </div>
                              <TextInput
                                 disabled={isPending}
                                 {...field}
                                 id="adresse_province_entreprise"
                                 type="text"
                                 placeholder="Entrer la province"
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
                                 required
                              />
                           </div>
                        )}
                     />
                     <Controller
                        control={form.control}
                        name="adresse_commune"
                        render={({ field, fieldState: { invalid, error } }) => (
                           <div className="justify-cenetr flex  w-full flex-col ">
                              <div className="mb-2 block">
                                 <Label
                                    htmlFor="adresse_commune_entreprise"
                                    value="Commune"
                                 />
                              </div>
                              <TextInput
                                 disabled={isPending}
                                 {...field}
                                 id="adresse_commune_entreprise"
                                 type="text"
                                 placeholder="Entrer la commune"
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
                                 required
                              />
                           </div>
                        )}
                     />
                  </div>
                  <div className="flex w-full flex-col items-center justify-between md:flex-row md:gap-4">
                     <Controller
                        control={form.control}
                        name="adresse_quartier"
                        render={({ field, fieldState: { invalid, error } }) => (
                           <div className="justify-cenetr flex  w-full flex-col ">
                              <div className="mb-2 block">
                                 <Label
                                    htmlFor="adresse_quartier_entreprise"
                                    value="quartier"
                                 />
                              </div>
                              <TextInput
                                 disabled={isPending}
                                 {...field}
                                 id="adresse_quartier_entreprise"
                                 type="text"
                                 placeholder="Entrer le quartier"
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
                                 required
                              />
                           </div>
                        )}
                     />
                     <Controller
                        control={form.control}
                        name="adresse_avenue"
                        render={({ field, fieldState: { invalid, error } }) => (
                           <div className="justify-cenetr flex  w-full flex-col ">
                              <div className="mb-2 block">
                                 <Label
                                    htmlFor="adresse_avenue_entreprise"
                                    value="Avenue"
                                 />
                              </div>
                              <TextInput
                                 {...field}
                                 disabled={isPending}
                                 id="adresse_avenue_entreprise"
                                 type="text"
                                 placeholder="Entrer l'avenue"
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
                                 required
                              />
                           </div>
                        )}
                     />
                  </div>

                  <Controller
                     control={form.control}
                     name="adresse_numero"
                     render={({ field, fieldState: { invalid, error } }) => (
                        <div>
                           <div className="mb-2 block">
                              <Label
                                 htmlFor="adresse_avenue_entreprise"
                                 value="Numéro parcelle"
                              />
                           </div>
                           <TextInput
                              {...field}
                              disabled={isPending}
                              id="adresse_avenue_entreprise"
                              type="text"
                              placeholder="Entrer le numero de la parcelle"
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
                           />
                        </div>
                     )}
                  />

                  {errorMessage ? (
                     <Alert
                        color="failure"
                        onDismiss={() => setErrorMessage(undefined)}
                     >
                        <span className="font-medium">Erreur!</span>{' '}
                        {errorMessage}
                     </Alert>
                  ) : successMessage ? (
                     <Alert
                        color="success"
                        onDismiss={() => setSuccessMessage(undefined)}
                     >
                        <span className="font-medium">ok!</span>{' '}
                        {successMessage}
                     </Alert>
                  ) : (
                     ''
                  )}

                  <Button disabled={isPending} type="submit">
                     Enregister
                  </Button>
               </form>
            </div>
         </div>
      </div>
   )
}
export default NewSocietePage
