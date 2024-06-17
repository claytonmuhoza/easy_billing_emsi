'use client'

import { Button, Label, TextInput } from 'flowbite-react'

const ChangePassWordPage = () => {
   return (
      <div className="p-4">
         <form>
            <div className="justify-cent flex w-full flex-col items-center gap-1">
               <Label className="w-full" htmlFor="password">
                  Mot de passe actuel
               </Label>
               <TextInput
                  className="w-full"
                  id="password"
                  type="password"
                  placeholder={`Entrer le mot de passe actuel`}
                  required
                  //   helperText={
                  //      invalid ? (
                  //         <>
                  //            <span className="font-medium text-red-500">
                  //               Oops!
                  //            </span>{' '}
                  //            le nom est obligatoire!
                  //         </>
                  //      ) : (
                  //         <></>
                  //      )
                  //   }
               />
            </div>
            <div className="justify-cent flex w-full flex-col items-center gap-1">
               <Label className="w-full" htmlFor="password">
                  Nouveau mot de passe
               </Label>
               <TextInput
                  className="w-full"
                  id="password"
                  type="password"
                  placeholder={`Entrer le nouveau mot de passe`}
                  required
                  //   helperText={
                  //      invalid ? (
                  //         <>
                  //            <span className="font-medium text-red-500">
                  //               Oops!
                  //            </span>{' '}
                  //            le nom est obligatoire!
                  //         </>
                  //      ) : (
                  //         <></>
                  //      )
                  //   }
               />
            </div>
            <div className="justify-cent flex w-full flex-col items-center gap-1">
               <Label className="w-full" htmlFor="password">
                  Repeter le mot de passe
               </Label>
               <TextInput
                  className="w-full"
                  id="password"
                  type="password"
                  placeholder={`Entrer de nouveau le mot de passe`}
                  required
                  //   helperText={
                  //      invalid ? (
                  //         <>
                  //            <span className="font-medium text-red-500">
                  //               Oops!
                  //            </span>{' '}
                  //            le nom est obligatoire!
                  //         </>
                  //      ) : (
                  //         <></>
                  //      )
                  //   }
               />
            </div>
            <div className="mt-2">
               <Button>Changer le mot de passe</Button>
            </div>
         </form>
      </div>
   )
}
export default ChangePassWordPage
