'use client'
import { useProductContext } from '@/context/ProductContext'
import { Button } from 'flowbite-react'
import MouvementComponent from './MouvementComponent'

export default function ShowProduct({
   setAction,
}: {
   setAction: (arg0: string) => void
}) {
   const { produit } = useProductContext()
   return (
      <div>
         {produit ? (
            <div className={produit.stockable ? 'mb-3 border-b pb-3' : ''}>
               <h1 className="font-bold">Nom du produit: {produit.nom}</h1>
               <div>
                  Prix unitaire de vente: {produit.prix_unitaire_vente_TTC} BIF
               </div>
               <div>Stockable: {produit.stockable ? 'Oui' : 'Non'}</div>
               {produit.stockable ? (
                  <div>
                     Stock actuel: {produit.stock_actuel}{' '}
                     {produit.unite_mesure.libelle}
                  </div>
               ) : (
                  <></>
               )}
            </div>
         ) : (
            <></>
         )}
         {produit ? (
            produit.stockable ? (
               <div className="my-4 flex justify-center gap-4">
                  <Button onClick={() => setAction('entrer')}>
                     Nouvelle entrer
                  </Button>
                  <Button onClick={() => setAction('sortie')}>
                     Nouvelle sortie
                  </Button>
                  <Button onClick={() => setAction('inventaire')}>
                     Nouveau inventaire
                  </Button>
               </div>
            ) : (
               <></>
            )
         ) : (
            <></>
         )}
         {produit?.stockable ? (
            <div>
               <h2 className="text-center font-bold">Mouvement de stock</h2>
               <div>{produit && <MouvementComponent produit={produit} />}</div>
            </div>
         ) : (
            <></>
         )}
      </div>
   )
}
