import { z } from 'zod'
const taxePayer = z.object({
   tp_name: z.string(),
})
export const nif_check_schema = z.discriminatedUnion('success', [
   z.object({
      status: z.number().optional(),
      success: z.literal(false),
      msg: z.string(),
   }),
   z.object({
      status: z.number().optional(),
      success: z.literal(true),
      msg: z.string(),
      result: z.object({
         taxpayer: z.array(taxePayer),
      }),
   }),
])

export const login_result_schema = z.discriminatedUnion('success', [
   z.object({
      status: z.number().optional(),
      success: z.literal(false),
      msg: z.string(),
   }),
   z.object({
      status: z.number().optional(),
      success: z.literal(true),
      msg: z.string(),
      result: z.object({ token: z.string() }),
   }),
])
export const invoice_items_schema = z.object({
   item_designation: z.string(),
   item_quantity: z.number(),
   item_price: z.number(),
   item_ct: z.number(),
   item_tl: z.number(),
   item_ott_tax: z.number(),
   item_tsce_tax: z.number(),
   item_price_nvat: z.number(),
   vat: z.number(),
   item_price_wvat: z.number(),
   item_total_amount: z.number(),
})
export const invoice_get_invoice_schema = z.object({
   invoice_number: z.string(),
   invoice_date: z.string(),
   invoice_type: z.string(),
   tp_type: z.enum(['1', '2']),
   tp_name: z.string(),
   tp_TIN: z.string(),
   cancelled_invoice: z.string(),
   tp_trade_number: z.string(),
   tp_postal_number: z.string(),
   tp_phone_number: z.string(),
   tp_adress_province: z.string(),
   tp_adress_commune: z.string(),
   tp_adress_quartier: z.string(),
   tp_adress_rue: z.string(),
   tp_adress_number: z.string(),
   vat_taxpayer: z.enum(['0', '1']),
   tl_taxpayer: z.enum(['0', '1']),
   tp_fiscal_center: z.string(),
   tp_activity_sector: z.string(),
   tp_legal_form: z.string(),
   payment_type: z.enum(['1', '2', '3', '4']),
   invoice_currency: z.string(),
   customer_name: z.string(),
   customent_TIN: z.string(),
   customer_adress: z.string(),
   vat_customer_payer: z.enum(['0', '1']),
   cancelled_invoice_ref: z.string(),
   invoice_ref: z.string(),
   cn_motif: z.string(),
   invoice_identifier: z.string(),
   invoice_items: z.array(invoice_items_schema),
})
export const get_invoice_result = z.discriminatedUnion('success', [
   z.object({
      status: z.number().optional(),
      success: z.literal(true),
      msg: z.string(),
      result: z.object({ invoices: z.array(invoice_get_invoice_schema) }),
   }),
   z.object({
      status: z.number().optional(),
      success: z.literal(false),
      msg: z.string(),
   }),
])
export const ebms_mouvement_stock_schema = z.object({
   mouvement_id: z.number(),
   system_or_device_id: z.string(),
   item_code: z.number(),
   item_designation: z.string(),
   item_quantity: z.number(),
   item_measurement_unit: z.string(),
   item_cost_price: z.string(),
   item_cost_price_currency: z.string(),
   item_movement_type: z.string(),
   item_movement_invoice_ref: z.string(),
   item_movement_description: z.string(),
   item_movement_date: z.string(),
})
export const ebms_movement_result_schema = z.object({
   success: z.boolean(),
   msg: z.string(),
   result: z.string().optional(),
})
export const calculMontantAPartirPourcentage = (
   montant: number,
   pourcentage: number,
) => {
   return Number((montant * (pourcentage / (100 + pourcentage))).toFixed(2))
}
export const ebms_add_facture_result = z.object({
   success: z.boolean(),
   msg: z.string(),
   result: z.string().optional(),
   electronic_signature: z.string().optional(),
})
export const ebms_annuler_facture_schema = z.object({
   invoice_identifier: z.string(),
   cn_motif: z.string(),
})
export const ebms_annuler_facture_result_schema = z.object({
   success: z.boolean(),
   msg: z.string(),
})
