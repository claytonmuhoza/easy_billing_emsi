'use client'

import { NewUserAction } from '@/actions/new-user_action'
import { getAllSociete } from '@/data/contribuable'
import { NewUserSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Societe } from '@prisma/client'
import {
   Alert,
   Button,
   DarkThemeToggle,
   Label,
   Select,
   TextInput,
} from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { HiUser } from 'react-icons/hi'
import { z } from 'zod'
function NewUserForm() {
   const [societes, setSocietes] = useState<Societe[] | undefined>()
   const [isPending, startTransition] = useTransition()
   const [errorMessage, setErrorMessage] = useState<string | undefined>()
   const router = useRouter()
   useEffect(() => {
      getAllSociete().then((data) => setSocietes(data))
   }, [])
   const form = useForm<z.infer<typeof NewUserSchema>>({
      resolver: zodResolver(NewUserSchema),
      defaultValues: {
         name: '',
         email: '',
         password: '',
      },
   })
   const onSubmit = (values: z.infer<typeof NewUserSchema>) => {
      setErrorMessage(undefined)
      startTransition(() =>
         startTransition(() => {
            NewUserAction(values).then((data) => {
               setErrorMessage(data.error)
               if (data.success) {
                  router.refresh()
               }
            })
         }),
      )
   }
   return (
      <div
         // style={{
         //    backgroundImage: 'url(' + bg.src + ')',
         // }}
         className="flex h-full min-h-[100dvh] w-full flex-row gap-2"
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
            <div className="borer-2 flex min-h-[80dvh] w-full flex-col items-center justify-center rounded-xl border-gray-400 bg-opacity-70 bg-clip-padding backdrop-blur-sm backdrop-filter dark:bg-dark md:flex-row-reverse md:justify-between md:p-4 md:p-6 lg:w-10/12 md-max:gap-4 ">
               <div className="flex w-full flex-col gap-4 rounded-md border border-gray-700 p-4 py-6 md:p-6 md:py-10">
                  <div className="flex flex-row items-center justify-between">
                     <div className="flex w-full flex-row items-center justify-start gap-4 ">
                        <span className="text-6 font-bold text-primary sm:text-8">
                           Easy
                        </span>
                        <span className="text-6 font-bold text-dark dark:text-slate-200  sm:text-8">
                           {' '}
                           | BILLING
                        </span>
                     </div>
                     <DarkThemeToggle />
                  </div>
                  <div className="flex items-center gap-4 text-6 font-semibold">
                     <span>Enregistrement de l'Administrateur</span>
                     <HiUser />
                  </div>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="w-full"
                  >
                     <div className="flex w-full flex-col items-center justify-between md:flex-row md:gap-4">
                        <Controller
                           control={form.control}
                           name="name"
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="flex w-full flex-col justify-center gap-2">
                                 <div className="block">
                                    <Label
                                       htmlFor="username"
                                       className=""
                                       value="Nom et prénom"
                                       color={invalid ? 'failure' : undefined}
                                    />
                                 </div>
                                 <TextInput
                                    id="username"
                                    {...field}
                                    type="text"
                                    placeholder="Entrer le nom et prénom"
                                    disabled={isPending}
                                    className="text-dark"
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
                                    color={invalid ? 'failure' : undefined}
                                    required
                                 />
                              </div>
                           )}
                        />
                        <Controller
                           control={form.control}
                           name="email"
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="flex w-full flex-col justify-center gap-2">
                                 <div className="block">
                                    <Label
                                       htmlFor="username"
                                       className=""
                                       value="Nom utilisateur (sans espace)"
                                       color={invalid ? 'failure' : undefined}
                                    />
                                 </div>
                                 <TextInput
                                    {...field}
                                    id="username"
                                    type="text"
                                    placeholder="Entrer le nom d'utilisateur"
                                    disabled={isPending}
                                    className="text-dark"
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
                                    color={invalid ? 'failure' : undefined}
                                    required
                                 />
                              </div>
                           )}
                        />
                     </div>
                     <div className="flex w-full flex-col items-center justify-between md:flex-row md:gap-4">
                        <Controller
                           control={form.control}
                           name="password"
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="flex w-full flex-col justify-center gap-2">
                                 <div className="block">
                                    <Label
                                       htmlFor="password"
                                       className=""
                                       value="Mot de passe"
                                       color={invalid ? 'failure' : undefined}
                                    />
                                 </div>
                                 <TextInput
                                    {...field}
                                    id="password1"
                                    type="password"
                                    className="text-dark"
                                    placeholder="Entrer le mot de passe"
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
                                    color={invalid ? 'failure' : undefined}
                                    required
                                 />
                              </div>
                           )}
                        />
                        <Controller
                           control={form.control}
                           name="confirmPassword"
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="flex w-full flex-col justify-center gap-2">
                                 <div className="block">
                                    <Label
                                       htmlFor="password2"
                                       className=""
                                       value="Entrer de nouveau le Mot de passe"
                                       color={invalid ? 'failure' : undefined}
                                    />
                                 </div>
                                 <TextInput
                                    {...field}
                                    disabled={isPending}
                                    id="password2"
                                    type="password"
                                    className="text-dark"
                                    placeholder="Entrer de nouveau le  mot de passe"
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
                     </div>
                     {societes ? (
                        <Controller
                           control={form.control}
                           name="societe_id"
                           render={({
                              field,
                              fieldState: { invalid, error },
                           }) => (
                              <div className="">
                                 <div className="block">
                                    <Label
                                       htmlFor="societe"
                                       className=""
                                       value="Selectionner la société"
                                       color={invalid ? 'failure' : undefined}
                                    />
                                 </div>
                                 <Select
                                    id="societe"
                                    {...field}
                                    disabled={isPending}
                                    color={invalid ? 'failure' : undefined}
                                    className="w-full text-dark"
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
                                    <option disabled selected>
                                       selectionner une societe
                                    </option>
                                    {societes.map((societe) => (
                                       <option
                                          className="text-dark"
                                          key={societe.id}
                                          value={societe.id}
                                       >
                                          {societe.nom}
                                       </option>
                                    ))}
                                 </Select>
                              </div>
                           )}
                        />
                     ) : (
                        <div>chargement des sociétés...</div>
                     )}
                     <Button
                        className="mt-2 w-full"
                        type="submit"
                        disabled={isPending}
                     >
                        {isPending
                           ? 'Enregistrement en cours...'
                           : 'Enregistrer'}
                     </Button>
                  </form>
               </div>
            </div>
         </div>
      </div>
   )
}
// const OptionsSociete = () => {
//    getAllSociete()
//       .then((societes) => {
//          return (
//             <>
//                {societes.map((societe) => (
//                   <option key={societe.id} value={societe.id}>
//                      {societe.nom}
//                   </option>
//                ))}
//             </>
//          )
//       })
//       .catch(() => {
//          return <option>pas de societe</option>
//       })
//    return <></>
// }
export default NewUserForm
