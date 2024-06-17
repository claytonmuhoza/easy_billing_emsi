'use client'

import { create_article_action } from '@/actions/article_action'
import { allCategorie } from '@/actions/categorie_action'
import { allUniteMesure } from '@/actions/unite_mesure_action'
import { ArticleSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Categorie, UniteMesure } from '@prisma/client'
import {
   Alert,
   Button,
   Checkbox,
   Label,
   Radio,
   Select,
   TextInput,
} from 'flowbite-react'
import { useEffect, useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const NewArticle = () => {
   const [categories, setCategorie] = useState<Categorie[]>([])
   const [loadingCategorie, setLoadingCategorie] = useState(true)
   const [loadingUniteMesure, setLoadiingUniteMesure] = useState(true)
   const [unitesMesure, setUnitesMesure] = useState<UniteMesure[]>([])
   useEffect(() => {
      allCategorie().then((data) => {
         setCategorie(data)
         setLoadingCategorie(false)
      })
      allUniteMesure().then((data) => {
         setUnitesMesure(data)
         setLoadiingUniteMesure(false)
      })
   }, [])
   // Transition
   const [errorAction, setError] = useState<string | undefined>(undefined)
   const [successAction, setSuccess] = useState<
      | {
           success: string
           is_service: boolean
        }
      | undefined
   >(undefined)
   const [pending, startTransition] = useTransition()

   const formSubmit = (values: z.infer<typeof ArticleSchema>) => {
      startTransition(() => {
         create_article_action(values).then((data) => {
            if (data.error) {
               setSuccess(undefined)
               setError(data.error)
            }
            if (data.sucess) {
               setError(undefined)
               setSuccess({ success: data.sucess, is_service: data.is_service })
               form.reset()
            }
         })
      })
   }
   const form = useForm<z.infer<typeof ArticleSchema>>({
      resolver: zodResolver(ArticleSchema),
      defaultValues: {
         nom: '',
         prix_revient: 0,
         stock_minimal_alert: 0,
         taux_tva: 0,
      },
   })

   return (
      <div className="m-5">
         {errorAction ? (
            <Alert color="failure" onDismiss={() => setError(undefined)}>
               <span className="font-medium">Erreur!</span> {errorAction}
            </Alert>
         ) : (
            ''
         )}
         {successAction ? (
            <Alert color="success" onDismiss={() => setSuccess(undefined)}>
               <span className="font-medium">bien!</span>{' '}
               {successAction.success}
            </Alert>
         ) : (
            ''
         )}
         <form
            onSubmit={form.handleSubmit(formSubmit)}
            className="flex flex-col gap-4"
         >
            <div>
               <h2 className="font-bold">Nouvelle article</h2>
            </div>

            <Controller
               control={form.control}
               name="nom"
               render={({ field, fieldState: { invalid, error } }) => (
                  <div>
                     <div className="mb-2 block">
                        <Label
                           htmlFor="nomProduit"
                           value="Nom du produit ou service"
                        />
                     </div>
                     <TextInput
                        color={invalid ? 'failure' : ''}
                        id="nomProduit"
                        {...field}
                        autoComplete="off"
                        type="text"
                        placeholder="Entrer le nom du produit"
                        disabled={pending}
                        required
                        helperText={
                           invalid && error ? (
                              <>
                                 <span className="font-medium">Oups!</span>{' '}
                                 {error.message}
                              </>
                           ) : (
                              ''
                           )
                        }
                     />
                  </div>
               )}
            />
            <div className="flex items-center gap-2">
               <Checkbox
                  id="stockable"
                  defaultChecked
                  {...form.register('stockable')}
               />
               <Label htmlFor="stockable" className="flex" defaultChecked>
                  produit stockable (ne pas cocher pour les services)
               </Label>
            </div>
            {form.getValues('stockable') ? (
               <>
                  <Controller
                     control={form.control}
                     name="stock_minimal_alert"
                     shouldUnregister
                     render={({ field, fieldState: { invalid, error } }) => (
                        <div>
                           <div className="mb-2 block">
                              <Label
                                 htmlFor="quantite_alert"
                                 value="Quantité minimum (en stock) d'alert"
                              />
                           </div>
                           <TextInput
                              id="quantite_alert"
                              min={0}
                              {...field}
                              color={invalid ? 'failure' : ''}
                              type="number"
                              disabled={pending}
                              helperText={
                                 invalid && error ? (
                                    <>
                                       <span className="font-medium">
                                          Oups!
                                       </span>{' '}
                                       {error.message}
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
                     name="prix_revient"
                     shouldUnregister
                     render={({ field, fieldState: { invalid, error } }) => (
                        <div>
                           <div className="mb-2 block">
                              <Label
                                 htmlFor="prix_revient"
                                 value="prix de revient(prix d'achat)"
                              />
                           </div>
                           <TextInput
                              id="prix_revient"
                              {...field}
                              color={invalid ? 'failure' : ''}
                              type="number"
                              min={0}
                              disabled={pending}
                              helperText={
                                 invalid && error ? (
                                    <>
                                       <span className="font-medium">
                                          Oups!
                                       </span>{' '}
                                       {error.message}
                                    </>
                                 ) : (
                                    ''
                                 )
                              }
                              required
                           />
                        </div>
                     )}
                  />{' '}
               </>
            ) : (
               <></>
            )}

            <fieldset className="flex max-w-md flex-col gap-4">
               <legend className="mb-4">
                  <Label>TVA</Label>
               </legend>
               <div className="flex items-center gap-2">
                  <Radio
                     id="zero_tva"
                     disabled={pending}
                     {...form.register('taux_tva')}
                     value="0"
                     defaultChecked
                  />
                  <Label htmlFor="zero_tva">0%</Label>
               </div>
               <div className="flex items-center gap-2">
                  <Radio
                     id="dix_tva"
                     disabled={pending}
                     {...form.register('taux_tva')}
                     value="10"
                  />
                  <Label htmlFor="dix_tva">10%</Label>
               </div>
               <div className="flex items-center gap-2">
                  <Radio
                     id="dix_huit_tva"
                     disabled={pending}
                     {...form.register('taux_tva')}
                     value="18"
                  />
                  <Label htmlFor="spain">18%</Label>
               </div>
            </fieldset>

            <div>
               {loadingCategorie ? (
                  <>
                     <div className="max-w-md">
                        <div className="mb-2 block">
                           <Label htmlFor="categorie" value="Categorie" />
                        </div>
                        <Select id="categorie" disabled={true}>
                           <option>chargement des categories</option>
                        </Select>
                     </div>
                  </>
               ) : (
                  <>
                     <Controller
                        control={form.control}
                        name="categorie_id"
                        render={({ field, fieldState: { invalid, error } }) => (
                           <div className="max-w-md">
                              <div className="mb-2 block">
                                 <Label htmlFor="categorie" value="Categorie" />
                              </div>
                              <Select
                                 id="categorie"
                                 {...field}
                                 color={invalid ? 'failure' : ''}
                                 disabled={pending}
                                 helperText={
                                    invalid && error ? (
                                       <>
                                          <span className="font-medium">
                                             Oups!
                                          </span>{' '}
                                          {error.message}
                                       </>
                                    ) : (
                                       ''
                                    )
                                 }
                                 required
                              >
                                 <option></option>
                                 {categories.length > 0 ? (
                                    categories.map((element) => (
                                       <option
                                          key={element.id}
                                          value={element.id}
                                       >
                                          {element.libelle}
                                       </option>
                                    ))
                                 ) : (
                                    <option>Pas encore de categorie</option>
                                 )}
                              </Select>
                           </div>
                        )}
                     />
                  </>
               )}
               {loadingUniteMesure ? (
                  <div>
                     <div className="max-w-md">
                        <div className="mb-2 block">
                           <Label htmlFor="unite_mesure" value="Unite mesure" />
                        </div>
                        <Select id="unite_mesure" disabled={true}>
                           <option>chargement des unites de mesure...</option>
                        </Select>
                     </div>
                  </div>
               ) : (
                  <div>
                     <Controller
                        control={form.control}
                        name="unite_mesure_id"
                        render={({ field, fieldState: { invalid, error } }) => (
                           <div className="max-w-md">
                              <div className="mb-2 block">
                                 <Label
                                    htmlFor="unite_mesure"
                                    value="Unite mesure"
                                 />
                              </div>
                              <Select
                                 id="unite_mesure"
                                 {...field}
                                 color={invalid ? 'failure' : ''}
                                 disabled={pending}
                                 helperText={
                                    invalid && error ? (
                                       <>
                                          <span className="font-medium">
                                             Oups!
                                          </span>{' '}
                                          {error.message}
                                       </>
                                    ) : (
                                       ''
                                    )
                                 }
                                 required
                              >
                                 <option></option>
                                 {unitesMesure.length > 0 ? (
                                    unitesMesure.map((element) => (
                                       <option
                                          key={element.id}
                                          value={element.id}
                                       >
                                          {element.libelle}
                                       </option>
                                    ))
                                 ) : (
                                    <option>
                                       Pas encore d'unités de mesure
                                    </option>
                                 )}
                              </Select>
                           </div>
                        )}
                     />
                  </div>
               )}
            </div>
            <div>
               <Button type="submit" disabled={pending}>
                  {pending
                     ? 'Enregistrement en cours ...'
                     : "Enregistrer l'article"}
               </Button>
            </div>
            <div>
               <h3>formulaire</h3>
               {JSON.stringify(form.watch())}
            </div>
         </form>
      </div>
   )
}
export default NewArticle
