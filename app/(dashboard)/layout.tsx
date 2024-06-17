import { BanqueProvider } from '@/context/BanqueContext'
import { CategorieProvider } from '@/context/CategorieContext'
import { ClientProvider } from '@/context/ClientContext'
import { FacturationProvider } from '@/context/FacturationContext'
import { ProductProvider } from '@/context/ProductContext'
import { SessionProvider } from '@/context/SessionContext'
import { SidebarProvider } from '@/context/SidebarContext'
import { UniteMesureProvider } from '@/context/UniteMesureContext'
import { Metadata } from 'next'
import type { FC, PropsWithChildren } from 'react'
import DashboardLayoutContent from './DashboardNavBar'
export const metadata: Metadata = {
   title: 'Easy billing system',
   description: 'Easy billing system to simplifie your billing operation',
}
const DashboardLayout: FC<PropsWithChildren> = function ({ children }) {
   return (
      <SidebarProvider>
         <SessionProvider>
            <FacturationProvider>
               <ProductProvider>
                  <ClientProvider>
                     <CategorieProvider>
                        <BanqueProvider>
                           <UniteMesureProvider>
                              <DashboardLayoutContent>
                                 {children}
                              </DashboardLayoutContent>
                           </UniteMesureProvider>
                        </BanqueProvider>
                     </CategorieProvider>
                  </ClientProvider>
               </ProductProvider>
            </FacturationProvider>
         </SessionProvider>
      </SidebarProvider>
   )
}

export default DashboardLayout
