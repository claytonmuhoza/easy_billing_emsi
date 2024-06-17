'use server'

import { auto_send_mouvement } from './ebms/stock_mouvement'
import {
   auto_send_facture_annuler,
   auto_send_facture_obr,
} from './facture_action'

export const auto_send_action = async () => {
   await auto_send_facture_obr()
   await auto_send_mouvement()
   await auto_send_facture_annuler()
}
