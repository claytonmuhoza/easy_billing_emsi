import { useSidebarContext } from '@/context/SidebarContext'
import { isSmallScreen } from '@/helpers/is-small-screen'
// import { currentUser } from '@clerk/nextjs'
import { DarkThemeToggle, Navbar } from 'flowbite-react'
// import Image from "next/image";
import { type FC } from 'react'
import { HiMenuAlt1, HiX } from 'react-icons/hi'

export const DashboardNavbar: FC<Record<string, never>> = function () {
   const {
      isCollapsed: isSidebarCollapsed,
      setCollapsed: setSidebarCollapsed,
   } = useSidebarContext()

   // const { user } = useSessionContext()

   // const logOut = () => {
   //    signOut()
   //       .then(() => console.log('loggedOut'))
   //       .catch((err) => console.log(err))
   // }

   // useEffect(() => {
   //    console.log(user)
   // }, [user])
   return (
      <header>
         <Navbar
            fluid
            className="fixed top-0 z-30 w-full border-b border-gray-200 bg-white p-0 dark:border-gray-700 dark:bg-gray-800 sm:p-0"
         >
            <div className="w-full p-3 pr-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center">
                     <button
                        aria-controls="sidebar"
                        aria-expanded
                        className="mr-2 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700"
                        onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                     >
                        {isSidebarCollapsed || !isSmallScreen() ? (
                           <HiMenuAlt1 className="h-6 w-6" />
                        ) : (
                           <HiX className="h-6 w-6" />
                        )}
                     </button>
                     <Navbar.Brand href="/home">
                        {/* <Image
                  alt="Flowbite logo"
                  height="24"
                  src="/favicon.png"
                  width="24"
                /> */}
                        <span className="self-center whitespace-nowrap px-3 text-xl font-semibold dark:text-white">
                           Easy Billing
                        </span>
                     </Navbar.Brand>
                  </div>
                  <div className="flex gap-4 md:order-2">
                     <DarkThemeToggle />
                     {/* <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                           <Avatar
                              alt="User settings"
                              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                              rounded
                           />
                        }
                     >
                        <Dropdown.Header>
                           <span className="block text-sm">
                              {/* {loggedUser && loadUser.email} ok 
                           </span>
                           <span className="block truncate text-sm font-medium">
                              name@flowbite.com
                           </span>
                        </Dropdown.Header>
                        <Dropdown.Item icon={HiUser}>Profil</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={logOut} icon={HiLogout}>
                           Sign out
                        </Dropdown.Item>
                     </Dropdown> */}
                     {/* <Navbar.Toggle /> */}
                  </div>
               </div>
            </div>
         </Navbar>
      </header>
   )
}
