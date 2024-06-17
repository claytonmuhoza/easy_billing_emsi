import { MouvementStock } from '@prisma/client'
export const sumTotalSortie = (mouvementStock: MouvementStock[]) => {
   let count = 0
   mouvementStock.map((element) => {
      if (element.type_mouvement.toString()[0] === 'S') {
         count = count + element.quantite
      }
   })
   return count
}
export const sumTotalEntree = (mouvementStock: MouvementStock[]) => {
   let count = 0
   mouvementStock.map((element) => {
      if (
         element.type_mouvement.toString()[0] === 'E' &&
         element.type_mouvement !== 'EI'
      ) {
         count = count + element.quantite
      }
   })
   return count
}
export const sumTotalSN = (mouvementStock: MouvementStock[]) => {
   let count = 0
   mouvementStock.map((element) => {
      if (element.type_mouvement === 'SN') {
         count = count + element.quantite
      }
   })
   return count
}
export const sumTotalSAJ = (mouvementStock: MouvementStock[]) => {
   let count = 0
   mouvementStock.map((element) => {
      if (element.type_mouvement === 'SAJ') {
         count = count + element.quantite
      }
   })
   return count
}
export const sumTotalSC = (mouvementStock: MouvementStock[]) => {
   let count = 0
   mouvementStock.map((element) => {
      if (element.type_mouvement === 'SC') {
         count = count + element.quantite
      }
   })
   return count
}
export const sumTotalSD = (mouvementStock: MouvementStock[]) => {
   let count = 0
   mouvementStock.map((element) => {
      if (element.type_mouvement === 'SD') {
         count = count + element.quantite
      }
   })
   return count
}
export const sumTotalSAU = (mouvementStock: MouvementStock[]) => {
   let count = 0
   mouvementStock.map((element) => {
      if (element.type_mouvement === 'SAU') {
         count = count + element.quantite
      }
   })
   return count
}
export const sumTotalSP = (mouvementStock: MouvementStock[]) => {
   let count = 0
   mouvementStock.map((element) => {
      if (element.type_mouvement === 'SP') {
         count = count + element.quantite
      }
   })
   return count
}
export const sumTotalST = (mouvementStock: MouvementStock[]) => {
   let count = 0
   mouvementStock.map((element) => {
      if (element.type_mouvement === 'ST') {
         count = count + element.quantite
      }
   })
   return count
}
export const sumTotalSV = (mouvementStock: MouvementStock[]) => {
   let count = 0
   mouvementStock.map((element) => {
      if (element.type_mouvement === 'SV') {
         count = count + element.quantite
      }
   })
   return count
}
export const sumTotalEN = (mouvementStock: MouvementStock[]) => {
   let count = 0
   mouvementStock.map((element) => {
      if (element.type_mouvement === 'EN') {
         count = count + element.quantite
      }
   })
   return count
}
export const sumTotalEAJ = (mouvementStock: MouvementStock[]) => {
   let count = 0
   mouvementStock.map((element) => {
      if (element.type_mouvement === 'EAJ') {
         count = count + element.quantite
      }
   })
   return count
}
export const sumTotalEAU = (mouvementStock: MouvementStock[]) => {
   let count = 0
   mouvementStock.map((element) => {
      if (element.type_mouvement === 'EAU') {
         count = count + element.quantite
      }
   })
   return count
}
export const sumTotalEI = (mouvementStock: MouvementStock[]) => {
   let count = 0
   mouvementStock.map((element) => {
      if (element.type_mouvement === 'EI') {
         count = count + element.quantite
      }
   })
   return count
}
export const sumTotalER = (mouvementStock: MouvementStock[]) => {
   let count = 0
   mouvementStock.map((element) => {
      if (element.type_mouvement === 'ER') {
         count = count + element.quantite
      }
   })
   return count
}
export const sumTotalET = (mouvementStock: MouvementStock[]) => {
   let count = 0
   mouvementStock.map((element) => {
      if (element.type_mouvement === 'ET') {
         count = count + element.quantite
      }
   })
   return count
}
