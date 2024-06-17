'use client'

import { NewContribuableAction } from '@/actions/contribuable/new-contribuable_action'
import { contribuableConfCreationSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import {
   Alert,
   Button,
   DarkThemeToggle,
   Label,
   Radio,
   Select,
   TextInput,
} from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { Controller, useForm } from 'react-hook-form'
import {
   HiLocationMarker,
   HiLockClosed,
   HiOfficeBuilding,
   HiPhone,
} from 'react-icons/hi'
import { z } from 'zod'
const NewSocietePage = () => {
   const router = useRouter()
   const [isPending, startTransition] = useTransition()
   const [errorMessage, setErrorMessage] = useState<string | undefined>()
   const onSubmit = (
      values: z.infer<typeof contribuableConfCreationSchema>,
   ) => {
      startTransition(() => {
         setErrorMessage(undefined)
         NewContribuableAction(values).then((data) => {
            console.log(JSON.stringify(data))
            setErrorMessage(data.error)
            if (data.success) {
               router.refresh()
            }
         })
      })
   }
   const form = useForm<z.infer<typeof contribuableConfCreationSchema>>({
      resolver: zodResolver(contribuableConfCreationSchema),
      defaultValues: {
         type_contribuable: '1',
         direction_fiscale: 'DPMC',
         nom: '',
         nif: '',
         forme_juridique: '',
         raison_social: '',
         tva: false,
         tc: false,
         prelevement_forfetaire: false,
         contact_telephone: '',
         contact_bp: '',
         contact_email: '',
         adresse_province: '',
         adresse_commune: '',
         adresse_quartier: '',
         adresse_avenue: '',
         adresse_numero: '',
         identifiant_systeme: '',
         mot_de_passe_systeme: '',
      },
   })
   return (
      <div
         // style={{
         //    backgroundImage: 'url(' + bg.src + ')',
         // }}
         className="md: flex h-full min-h-[100dvh] w-full flex-row gap-2 md:py-5"
      >
         <div className="flex h-full min-h-screen w-screen flex-row items-center justify-center">
            {errorMessage ? (
               <div className="absolute left-0 top-0 z-10  flex w-full flex-col items-center justify-center p-4">
                  <Alert
                     color="failure"
                     onDismiss={() => setErrorMessage(undefined)}
                     className=""
                  >
                     <span className="font-medium">Erreur!</span> {errorMessage}
                  </Alert>
               </div>
            ) : (
               ''
            )}
            <div className="borer-2 flex min-h-[80dvh] w-full flex-col items-center justify-center rounded-xl bg-opacity-70 bg-clip-padding text-gray-700 backdrop-blur-sm backdrop-filter dark:border-gray-400 dark:bg-dark md:flex-row-reverse md:justify-between md:p-6 lg:w-10/12 md-max:gap-4 ">
               <div className="flex w-full flex-col gap-4 rounded-md border border-gray-700 p-4 py-6 md:p-6 md:py-10">
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
                     <DarkThemeToggle />
                  </div>
                  <div className="flex items-center gap-4 border-b border-gray-700 pb-2 text-5 font-semibold dark:text-slate-200">
                     <span>Enregistrement du Contribuable</span>
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
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="justify-cenetr flex  w-full flex-col ">
                                 {' '}
                                 <div className="mb-2 block">
                                    <Label
                                       htmlFor="nom_entreprise"
                                       value="Nom"
                                       color={invalid ? 'failure' : undefined}
                                    />
                                 </div>
                                 <TextInput
                                    {...field}
                                    disabled={isPending}
                                    color={invalid ? 'failure' : undefined}
                                    id="nom_entreprise"
                                    type="text"
                                    autoComplete="off"
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
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="justify-cenetr flex  w-full flex-col ">
                                 <div className="mb-2 block">
                                    <Label
                                       htmlFor="nif"
                                       color={invalid ? 'failure' : undefined}
                                       value="NIF"
                                    />
                                 </div>
                                 <TextInput
                                    {...field}
                                    disabled={isPending}
                                    id="nif"
                                    autoComplete="off"
                                    type="text"
                                    color={invalid ? 'failure' : undefined}
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
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="justify-cenetr flex  w-full flex-col ">
                                 <div className="mb-2 block">
                                    <Label
                                       htmlFor="registre_commerce_entreprise"
                                       value="Registre de commerce"
                                       color={invalid ? 'failure' : undefined}
                                    />
                                 </div>
                                 <TextInput
                                    {...field}
                                    disabled={isPending}
                                    color={invalid ? 'failure' : undefined}
                                    autoComplete="off"
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
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="justify-cenetr flex  w-full flex-col ">
                                 <div className="mb-2 block">
                                    <Label
                                       htmlFor="direction_fiscal_entreprise"
                                       value="Direction fiscal"
                                       color={invalid ? 'failure' : undefined}
                                    />
                                 </div>
                                 <Select
                                    id="direction_fiscal_entreprise"
                                    {...field}
                                    color={invalid ? 'failure' : undefined}
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
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="justify-cenetr flex  w-full flex-col ">
                                 <div className="mb-2 block">
                                    <Label
                                       htmlFor="type_contribuable_entreprise"
                                       value="Type contribuable"
                                       color={invalid ? 'failure' : undefined}
                                    />
                                 </div>
                                 <Select
                                    {...field}
                                    disabled={isPending}
                                    color={invalid ? 'failure' : undefined}
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
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="justify-cenetr flex  w-full flex-col ">
                                 <div className="mb-2 block">
                                    <Label
                                       htmlFor="forme_juridique_entreprise"
                                       value="Forme juridique"
                                       color={invalid ? 'failure' : undefined}
                                    />
                                 </div>
                                 <TextInput
                                    {...field}
                                    disabled={isPending}
                                    id="forme_juridique_entreprise"
                                    type="text"
                                    autoComplete="off"
                                    color={invalid ? 'failure' : undefined}
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
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="justify-cenetr flex  w-full flex-col ">
                                 <div className="mb-2 block">
                                    <Label
                                       htmlFor="raison_social_entreprise"
                                       value="secteur d'activité"
                                       color={invalid ? 'failure' : undefined}
                                    />
                                 </div>
                                 <TextInput
                                    {...field}
                                    id="raison_social_entreprise"
                                    type="text"
                                    autoComplete="off"
                                    color={invalid ? 'failure' : undefined}
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
                                    <Label htmlFor="oui_tva_entreprise">
                                       Oui
                                    </Label>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <Radio
                                       id="non_tva_entreprise"
                                       disabled={isPending}
                                       onBlur={onBlur} // notify when input is touched
                                       onChange={() => onChange(false)} // send value to hook form
                                       checked={value === false}
                                    />
                                    <Label htmlFor="non_tva_entreprise">
                                       Non
                                    </Label>
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
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="justify-cenetr flex  w-full flex-col ">
                                 <div className="mb-2 block">
                                    <Label
                                       htmlFor="telephone_entreprise"
                                       value="Téléphone"
                                       color={invalid ? 'failure' : undefined}
                                    />
                                 </div>
                                 <TextInput
                                    {...field}
                                    disabled={isPending}
                                    id="telephone_entreprise"
                                    type="text"
                                    autoComplete="off"
                                    color={invalid ? 'failure' : undefined}
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
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="justify-cenetr flex  w-full flex-col ">
                                 <div className="mb-2 block">
                                    <Label
                                       htmlFor="boite_postale_entreprise"
                                       value="Boite postale(non obligatoire)"
                                       color={invalid ? 'failure' : undefined}
                                    />
                                 </div>
                                 <TextInput
                                    disabled={isPending}
                                    id="boite_postale_entreprise"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Entrer la boite postale"
                                    color={invalid ? 'failure' : undefined}
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
                                 <Label
                                    htmlFor="email_entreprise"
                                    value="Email"
                                    color={invalid ? 'failure' : undefined}
                                 />
                              </div>
                              <TextInput
                                 disabled={isPending}
                                 id="email_entreprise"
                                 type="email"
                                 autoComplete="off"
                                 placeholder="Entrer l'adresse email"
                                 color={invalid ? 'failure' : undefined}
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
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="justify-cenetr flex  w-full flex-col ">
                                 <div className="mb-2 block">
                                    <Label
                                       htmlFor="adresse_province_entreprise"
                                       value="Province"
                                       color={invalid ? 'failure' : undefined}
                                    />
                                 </div>
                                 <TextInput
                                    disabled={isPending}
                                    {...field}
                                    id="adresse_province_entreprise"
                                    type="text"
                                    color={invalid ? 'failure' : undefined}
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
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="justify-cenetr flex  w-full flex-col ">
                                 <div className="mb-2 block">
                                    <Label
                                       htmlFor="adresse_commune_entreprise"
                                       value="Commune"
                                       color={invalid ? 'failure' : undefined}
                                    />
                                 </div>
                                 <TextInput
                                    disabled={isPending}
                                    {...field}
                                    id="adresse_commune_entreprise"
                                    type="text"
                                    color={invalid ? 'failure' : undefined}
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
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="justify-cenetr flex  w-full flex-col ">
                                 <div className="mb-2 block">
                                    <Label
                                       htmlFor="adresse_quartier_entreprise"
                                       value="quartier"
                                       color={invalid ? 'failure' : undefined}
                                    />
                                 </div>
                                 <TextInput
                                    disabled={isPending}
                                    {...field}
                                    id="adresse_quartier_entreprise"
                                    type="text"
                                    placeholder="Entrer le quartier"
                                    color={invalid ? 'failure' : undefined}
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
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
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
                                    color={invalid ? 'failure' : undefined}
                                 />
                              </div>
                              <TextInput
                                 {...field}
                                 disabled={isPending}
                                 id="adresse_avenue_entreprise"
                                 color={invalid ? 'failure' : undefined}
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
                     <div className="flex items-center gap-4 border-b border-gray-700 pb-2 text-5 font-semibold dark:text-slate-200">
                        <span>Identifiant système</span>
                        <HiLockClosed />
                     </div>
                     <div className="flex w-full flex-col items-center justify-between md:flex-row md:gap-4">
                        <Controller
                           control={form.control}
                           name="identifiant_systeme"
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="justify-cenetr flex  w-full flex-col ">
                                 <div className="mb-2 block">
                                    <Label
                                       htmlFor="identifiant_systeme"
                                       value="Nom utilisateur"
                                       color={invalid ? 'failure' : undefined}
                                    />
                                 </div>
                                 <TextInput
                                    {...field}
                                    disabled={isPending}
                                    id="identifiant_systeme"
                                    type="text"
                                    color={invalid ? 'failure' : undefined}
                                    placeholder="Entrer l'identifiant système"
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
                        <Controller
                           control={form.control}
                           name="mot_de_passe_systeme"
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="justify-cenetr flex  w-full flex-col ">
                                 <div className="mb-2 block">
                                    <Label
                                       htmlFor="mot_de_passe_systeme"
                                       value="Mot de passe système"
                                       color={invalid ? 'failure' : undefined}
                                    />
                                 </div>
                                 <TextInput
                                    {...field}
                                    disabled={isPending}
                                    color={invalid ? 'failure' : undefined}
                                    id="mot_de_passe_systeme"
                                    type="text"
                                    placeholder="Entrer le mot de passe système"
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
                     {errorMessage ? (
                        <Alert
                           color="failure"
                           onDismiss={() => setErrorMessage(undefined)}
                        >
                           <span className="font-medium">Erreur!</span>{' '}
                           {errorMessage}
                        </Alert>
                     ) : (
                        ''
                     )}
                     <Button disabled={isPending} type="submit">
                        {isPending ? 'Enregistrement en cours' : 'Enregister'}
                     </Button>
                  </form>
               </div>
            </div>
         </div>
      </div>
   )
}
export default NewSocietePage
