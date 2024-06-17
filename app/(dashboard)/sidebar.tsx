'use client'
import { logOut } from '@/actions/logout_action'
import { useSidebarContext } from '@/context/SidebarContext'
import { Sidebar } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import type { FC } from 'react'
import { CiBank, CiRuler } from 'react-icons/ci'
import {
   HiChartPie,
   HiClipboardList,
   HiDatabase,
   HiInbox,
   HiOfficeBuilding,
   HiOutlineViewList,
   HiPaperClip,
   HiUser,
   HiViewList,
} from 'react-icons/hi'
import { IoSettings } from 'react-icons/io5'

export const DashboardSidebar: FC = function () {
   const { isCollapsed, setCollapsed } = useSidebarContext()

   const router = useRouter()

   // const router = useRouter()
   const to = (link: string) => {
      router.push(link)
      setCollapsed(isCollapsed)
   }

   return (
      <Sidebar
         aria-label="Sidebar with multi-level dropdown example"
         // collapsed={isCollapsed}
         collapseBehavior={isCollapsed ? 'collapse' : undefined}
         id="sidebar"
         className={`fixed inset-y-0 left-0 z-20 mt-16 flex h-full shrink-0 flex-col border-r border-gray-200 pb-14 duration-75 dark:border-gray-700 lg:flex
            ${isCollapsed ? 'collapse w-0 text-4' : ''}`}
      >
         <Sidebar.Items>
            <Sidebar.ItemGroup>
               <Sidebar.Item onClick={() => to('/home')} icon={HiChartPie}>
                  <span className="cursor-pointer">Dashboard</span>
               </Sidebar.Item>
               <Sidebar.Collapse
                  // onClick={() => setCollapsed(!isCollapsed)}\
                  className="cursor-pointer"
                  icon={HiClipboardList}
                  label="Facturation"
               >
                  <div className="cursor-pointer">
                     <Sidebar.Item
                        // href="/facturation"
                        onClick={() => to('/facturation')}
                     >
                        <span className="cursor-pointer">
                           Facturation Normale
                        </span>
                     </Sidebar.Item>
                     <Sidebar.Item
                        // href="/facturation"
                        onClick={() => to('/facturation/verification')}
                     >
                        <span className="cursor-pointer">verification</span>
                     </Sidebar.Item>
                     {/* <Sidebar.Item onClick={() => to('/facturation-annuler')}>
                        <span className="cursor-pointer">Facture annulée</span>
                     </Sidebar.Item> */}
                  </div>
               </Sidebar.Collapse>
               <Sidebar.Item onClick={() => to('/clients')} icon={HiUser}>
                  <span className="cursor-pointer">Clients</span>
               </Sidebar.Item>
               <Sidebar.Item onClick={() => to('/produits')} icon={HiPaperClip}>
                  <span className="cursor-pointer">Articles</span>
               </Sidebar.Item>
               <Sidebar.Collapse icon={HiInbox} label="Stock">
                  <Sidebar.Item onClick={() => to('/entree')}>
                     <span className="cursor-pointer">Entrées</span>
                  </Sidebar.Item>
                  <Sidebar.Item onClick={() => to('/sortie')}>
                     <span className="cursor-pointer">Sorties</span>
                  </Sidebar.Item>
                  <Sidebar.Item onClick={() => to('/inventaire')}>
                     <span className="cursor-pointer">Inventaire</span>
                  </Sidebar.Item>
               </Sidebar.Collapse>
               <Sidebar.Collapse icon={HiOutlineViewList} label="Rapports">
                  <Sidebar.Item onClick={() => to('/rapport-stock')}>
                     <span className="cursor-pointer">Rapports de stock</span>
                  </Sidebar.Item>
                  <Sidebar.Item onClick={() => to('/rapport-vente')}>
                     <span className="cursor-pointer">Rapports de vente</span>
                  </Sidebar.Item>
               </Sidebar.Collapse>

               <Sidebar.Item
                  icon={HiUser}
                  onClick={() => {
                     logOut()
                  }}
               >
                  <span className="cursor-pointer">Se deconnecter</span>
               </Sidebar.Item>
            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup>
               <Sidebar.Collapse icon={IoSettings} label="Configurations">
                  <Sidebar.Item icon={CiBank} onClick={() => to('/banques')}>
                     <span className="cursor-pointer">Banques</span>
                  </Sidebar.Item>
                  {/*<Sidebar.Item
                     icon={PiSignatureBold}
                     onClick={() => to('/signataires')}
                  >
                     <span className="cursor-pointer">Signataires</span>
                  </Sidebar.Item> */}
                  <Sidebar.Item
                     icon={HiDatabase}
                     onClick={() => to('/categorie')}
                  >
                     <span className="cursor-pointer">Categories</span>
                  </Sidebar.Item>
                  <Sidebar.Item icon={CiRuler} onClick={() => to('/unite')}>
                     <span className="cursor-pointer">Unites Mesure</span>
                  </Sidebar.Item>
                  <Sidebar.Item
                     icon={HiViewList}
                     onClick={() => to('/log_obr')}
                  >
                     <span className="cursor-pointer">OBR Log</span>s
                  </Sidebar.Item>
                  {/* <Sidebar.Item
                     icon={HiLockClosed}
                     onClick={() => to('/change-password')}
                  >
                     <span className="cursor-pointer">
                        Modifier mot de passe
                     </span>
                     
                  </Sidebar.Item> */}
                  <Sidebar.Item
                     icon={HiOfficeBuilding}
                     onClick={() => to('/info-contribuable')}
                  >
                     <span className="cursor-pointer">Info Contribuable</span>
                  </Sidebar.Item>
               </Sidebar.Collapse>
               {/* <Sidebar.Item  icon={HiUser}>
                  Profile
               </Sidebar.Item> */}
            </Sidebar.ItemGroup>
         </Sidebar.Items>
      </Sidebar>
   )
}
