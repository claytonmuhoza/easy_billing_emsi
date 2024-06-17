'use client'
import {
   CategoryScale,
   Chart as ChartJS,
   Legend,
   LineElement,
   LinearScale,
   PointElement,
   Title,
   Tooltip,
} from 'chart.js'
import Link from 'next/link'
import { IconType } from 'react-icons'
import { HiInbox } from 'react-icons/hi'

export default function HomePage() {
   ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend,
   )
   // const options = {
   //    responsive: true,
   //    plugins: {
   //       legend: {
   //          position: 'top',
   //       },
   //       title: {
   //          display: false,
   //          text: 'Chart.js Line Chart',
   //       },
   //    },
   // }
   // const labels = [
   //    'Janvier',
   //    'Fevrier',
   //    'Mars',
   //    'Avril',
   //    'Mai',
   //    'Juin',
   //    'Juillet',
   //    'Aout',
   //    'Septembre',
   //    'Octobre',
   //    'Novembre',
   //    'decembre',
   // ]
   // const data = {
   //    labels,
   //    datasets: [
   //       {
   //          label: 'CA TVA BIF',
   //          data: labels.map(() => Math.floor(Math.random() * 10000)),
   //          borderColor: 'rgb(255, 99, 132)',
   //          backgroundColor: 'rgba(255, 99, 132, 0.5)',
   //       },
   //       {
   //          label: 'TVA BIF',
   //          data: labels.map(() =>
   //             // faker.datatype.number({ min: -1000, max: 1000 }),
   //             Math.floor(Math.random() * 10000),
   //          ),
   //          borderColor: 'rgb(53, 162, 235)',
   //          backgroundColor: 'rgba(53, 162, 235, 0.5)',
   //       },
   //    ],
   // }
   return (
      <div className="flex w-full flex-col p-4">
         <div className="grid w-full grid-flow-row grid-cols-2 items-center justify-between gap-2 sm:grid-cols-3  sm:gap-4  md:grid-cols-4">
            <Box
               className="min-w-3/12"
               Icon={HiInbox}
               title={'Bienvenue'}
               to={''}
            />
            {/* <Box
               className="min-w-3/12"
               Icon={HiCurrencyDollar}
               title={'Ventes'}
               to={'vents'}
            />
            <Box
               className="min-w-3/12"
               Icon={HiClipboardList}
               title={'Factures'}
               to={'facturation'}
            />
            <Box
               className="min-w-3/12"
               Icon={HiUser}
               title={'Clients'}
               to={'clients'}
            /> */}
            {/* <Box
               className="min-w-3/12"
               Icon={Hi}
               title={'Users'}
               to={'users'}
            /> */}
            {/* <Box
               className="min-w-3/12"
               Icon={HiOfficeBuilding}
               title={'Venues'}
               to={'venues'}
            />
            <Box
               className="min-w-3/12"
               Icon={HiUser}
               title={'Users'}
               to={'users'}
            /> */}
            {/* <Box Icon={HiUser} title={'Users'} /> */}
         </div>
         {/* <div className="grid w-full grid-flow-row grid-cols-1 gap-2 py-2 sm:gap-4 sm:py-4 md:grid-cols-2 ">
            <div className="flex flex-row gap-4 rounded border border-gray-200 bg-white p-4 dark:border-none dark:bg-gray-800 ">
               <Line options={options} data={data} />
            </div>
            <div className="flex flex-row gap-4 rounded border border-gray-200 bg-white p-4 dark:border-none dark:bg-gray-800 ">
               <Line options={options} data={data} />
            </div>
         </div> */}
      </div>
   )
}
interface MyButtonProps {
   Icon: IconType
   title: string
   to: string
   className: string
}
function Box({ Icon, title, to, className }: MyButtonProps) {
   return (
      <Link
         href={'/' + to}
         className={
            className +
            'flex flex-col items-center justify-center rounded border bg-white p-4  text-gray-700 dark:border-none dark:bg-gray-800'
         }
      >
         <div className="flex w-full  flex-row items-center justify-between gap-2 dark:text-slate-200">
            <div className="items-left flex flex-col gap-2">
               <span className="font-semibold">{title}</span>
               <span className="text-6 font-bold"> Dans easy billing</span>
            </div>
            <Icon className=" rounded-full p-1 text-8 text-gray-700 dark:bg-slate-200 dark:text-dark-400 md:text-10" />
         </div>
         {/* <span>lorem ipsum</span> */}
      </Link>
   )
}
