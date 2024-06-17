'use client'

import { TextInput, Tooltip } from 'flowbite-react'
import { FC, useRef } from 'react'
import { HiArrowLeft, HiPlus, HiSearch } from 'react-icons/hi'
import { IoMdRefresh } from 'react-icons/io' // import { apiLink } from '../../utilis/ApiContext'
// import { ScanModalContext } from '../../utilis/Context'
// import { usePost } from '../../utilis/CustomHooks'

// export function SponsoredTag({ state, link, id, openPopUp }) {
//    const [insternState, setState] = useState(Number(state))
//    const [response, error, isLoading, setPost] = usePost(
//       apiLink + `/api/${link}/change_status`,
//    )

//    const handlePost = (newState) => {
//       setPost({
//          id: id,
//          is_sponsored: newState,
//       })
//       setState(newState)
//    }

//    useEffect(() => {
//       if (response) {
//       }
//       if (error) {
//          openPopUp({
//             title: 'Network Error',
//             content: 'Please check your internet connexion!',
//             decline: {
//                title: 'Try Again',
//             },
//          })
//          setState(Number(state))
//       }
//    }, [response, error])

//    return (
//       // <div className="p-2 rounded-md">
//       isLoading ? (
//          <Spinner />
//       ) : insternState === 1 ? (
//          <span
//             onClick={() => handlePost(0)}
//             className="cursor-pointer rounded-md bg-green-500 p-2 text-slate-100"
//          >
//             Sponsored
//          </span>
//       ) : (
//          <span
//             onClick={() => handlePost(1)}
//             className="cursor-pointer rounded-md bg-red-500 p-2 text-slate-100"
//          >
//             Not Sponsored
//          </span>
//       )
//       // </div>
//    )
// }
// export function ActiveTag({ state, link, id, openPopUp }) {
//    const [insternState, setState] = useState(Number(state))
//    const [response, error, isLoading, setPost] = usePost(
//       apiLink + `/api/${link}/change_status`,
//    )

//    const handlePost = (newState) => {
//       setPost({
//          id: id,
//          is_active: newState,
//       })
//       setState(newState)
//    }

//    useEffect(() => {
//       if (response) {
//       }
//       if (error) {
//          openPopUp({
//             title: 'Network Error',
//             content: 'Please check your internet connexion!',
//             decline: {
//                title: 'Try Again',
//             },
//          })
//          setState(Number(state))
//       }
//    }, [response, error])
//    return isLoading ? (
//       <Spinner />
//    ) : insternState === 1 ? (
//       <span
//          onClick={() => handlePost(0)}
//          className="cursor-pointer rounded-md bg-green-500 p-2 text-slate-100"
//       >
//          Actived
//       </span>
//    ) : (
//       <span
//          onClick={() => handlePost(1)}
//          className="cursor-pointer rounded-md bg-red-500 p-2 text-slate-100"
//       >
//          Not Actived
//       </span>
//    )
// }

export function SearchBar({
   handdleSearch,
   title,
   className,
}: {
   title?: string
   className?: string
   handdleSearch: (e: React.FormEvent<HTMLInputElement>) => void
}) {
   // const [search, setSearch] = useState([])

   return (
      // <div className=" flex flex-col gap-2 h-240">
      <TextInput
         className={'w-6/12 rounded-full ' + className}
         id="search"
         type="search"
         icon={HiSearch}
         autoComplete="off"
         onChange={(e) => handdleSearch(e)}
         // rightIcon={HiMail}
         placeholder={'Rechercher ' + title}
         required
      />
   )
}

export const BtnCreate = function ({
   name,
   noTitle,
   onClick,
}: {
   name: string
   noTitle?: boolean
   onClick?: () => void
}) {
   return (
      <Tooltip content={name && name} style="auto">
         <div
            onClick={() => onClick && onClick()}
            aria-hidden="true"
            className="flex cursor-pointer items-center rounded-lg bg-primary p-2  text-slate-200"
         >
            {/* <span className="material-icons-round  cursor-pointer ">add</span>{' '} */}
            <HiPlus />
            <span className="hidden md:inline">
               {!noTitle && (name ? name : 'Create')}
            </span>
         </div>
      </Tooltip>
   )
}
export function BtnRefresh({ onClick }: { onClick?: () => void }) {
   const ref = useRef<HTMLDivElement>(null)

   function spin() {
      ref.current?.classList.remove('animate-spin')

      // const intervalId =

      // console.log(intervalId)
      return clearTimeout(
         setTimeout(() => {
            console.log(ref.current?.classList)
            ref.current?.classList.remove('animate-spin')
         }),
      )
   }

   return (
      <Tooltip content="Refresh" style="auto">
         <div
            onClick={() => {
               spin()
               onClick && onClick()
            }}
            aria-hidden="true"
            className="flex cursor-pointer items-center rounded-lg bg-gray-700 p-2 text-slate-200"
         >
            <span ref={ref} className="">
               <IoMdRefresh className="material-icons-round cursor-pointer" />
            </span>
         </div>
      </Tooltip>
   )
}

interface BtnBackProps {
   handler?: () => void
}

export const BtnBack: FC<BtnBackProps> = function ({
   handler = () => window.history.back(),
}) {
   return (
      <Tooltip content="Back" style="auto">
         <div
            //  onClick={() => console.log(11)}
            onClick={() => handler()}
            aria-hidden="true"
            className="flex cursor-pointer items-center rounded-lg bg-gray-700 p-2  text-slate-200"
         >
            <span className="material-icons-round  cursor-pointer ">
               <HiArrowLeft />
            </span>{' '}
            {/* Create */}
         </div>
      </Tooltip>
   )
}
// export function BtnScan() {
//    return (
//       <ScanModalContext.Consumer>
//          {({ openModal }) => (
//             <div
//                //  onClick={() => console.log(11)}
//                onClick={() => {
//                   openModal()
//                }}
//                className="flex cursor-pointer items-center rounded-lg bg-gray-700 p-2  text-slate-200"
//             >
//                <span className="material-icons-round  cursor-pointer ">
//                   <HiOutlineQrcode />
//                </span>{' '}
//                {/* Create */}
//             </div>
//          )}
//       </ScanModalContext.Consumer>
//    )
// }
