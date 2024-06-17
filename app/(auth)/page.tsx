import db from '@/helpers/db'
import NewUserForm from './_component/NewUserForm'
import SignIn from './_component/login'
import NewSocietePage from './_component/newSociete'
const authenticationPage = async () => {
   const isSocieteExist = await db.societe.aggregate({ _count: { id: true } })
   const isExistUser = await db.user.aggregate({ _count: { id: true } })
   if (isSocieteExist._count.id === 0) {
      return (
         <>
            <NewSocietePage />
         </>
      )
   }
   if (isExistUser._count.id === 0) {
      return <NewUserForm />
   }
   return <SignIn />
}
export default authenticationPage
