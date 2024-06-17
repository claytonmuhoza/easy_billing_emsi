export const url = 'https://ebms.obr.gov.bi:9443/ebms_api/'

export function convertDateformat(curr_dt: Date) {
   const add_zero = () => {
      if (curr_dt.getMonth() < 9) {
         return '0'
      } else {
         return ''
      }
   }
   const form_dt =
      curr_dt.getFullYear() +
      '-' +
      add_zero +
      (curr_dt.getMonth() + 1) +
      '-' +
      curr_dt.getDate() +
      ' ' +
      curr_dt.getHours() +
      ':' +
      curr_dt.getMinutes() +
      ':' +
      curr_dt.getSeconds()

   return form_dt
}

export function afficherDateHeure(curr_dt: Date) {
   curr_dt.setTime(curr_dt.getTime() - 2 * 60 * 60 * 1000)
   const form_dt =
      curr_dt.getDate() +
      '/' +
      +(curr_dt.getMonth() + 1) +
      '/' +
      curr_dt.getFullYear() +
      ' à ' +
      curr_dt.getHours() +
      'h ' +
      curr_dt.getMinutes() +
      'min'

   return form_dt
}
