export const arrondir_fbu = (montant: number) => {
   return Number(montant.toFixed(0))
}
export const arrondir_devise = (montant: number) => {
   return Number(montant.toFixed(2))
}
export const get_prix_hors_tva = (montant: number, taux_tva: number) => {
   return montant - get_tva_from_prix_vente(montant, taux_tva)
}
export const get_tva_from_prix_vente = (montant: number, taux_tva: number) => {
   return Number((montant * (taux_tva / (100 + taux_tva))).toFixed(0))
}
export const tout_taxe_comprise_prix = false
