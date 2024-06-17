import { Flowbite, ThemeModeScript } from 'flowbite-react'
import { Inter } from 'next/font/google'
import { type FC, type PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'
import './globals.css'
import { flowbiteTheme } from './theme'

const inter = Inter({ subsets: ['latin'] })

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
   return (
      <html lang="en">
         <head>
            <ThemeModeScript />
         </head>
         <body
            className={twMerge(
               'bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-slate-200 ',
               inter.className,
            )}
         >
            <Flowbite theme={{ theme: flowbiteTheme }}>{children}</Flowbite>
         </body>
      </html>
   )
}

export default RootLayout
