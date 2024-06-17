export const calculMontantAPartirPourcentage = (
   montant: number,
   pourcentage: number,
) => {
   return Number((montant * (pourcentage / (100 + pourcentage))).toFixed(2))
}
export const afficherFloat = (nombre: number) => {
   return nombre.toFixed(2)
}
