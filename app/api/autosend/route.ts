import { auto_send_action } from '@/actions/auto_send'

export async function GET() {
   await auto_send_action()
   return Response.json('ok')
}
