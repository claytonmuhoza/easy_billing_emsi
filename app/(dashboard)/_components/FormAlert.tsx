import { Alert } from 'flowbite-react'
import { useEffect } from 'react'

export default function FormAlert({
   success,
   setSuccess,
   error,
   setError,
}: {
   success?: string | undefined
   setSuccess?: (val: undefined) => void
   error?: string | undefined
   setError?: (val: undefined) => void
}) {
   useEffect(() => {
      const clearOut = () => {
         setSuccess && setSuccess(undefined)
      }

      setTimeout(clearOut, 3000)
   }, [success])

   return (
      <div className="fixed left-0 top-0 flex  w-screen items-start justify-center p-5">
         {success && (
            <Alert
               color="success"
               onDismiss={() => setSuccess && setSuccess(undefined)}
            >
               <span className="font-medium">Succès!</span> {success}
            </Alert>
         )}
         {error && (
            <Alert
               color="failure"
               onDismiss={() => setError && setError(undefined)}
            >
               <span className="font-medium">Erreur!</span> {error}
            </Alert>
         )}
      </div>
   )
}
