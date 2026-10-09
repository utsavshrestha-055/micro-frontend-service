import type {Metadata} from 'next';import './globals.css';import {StoreProvider} from '@/lib/context/store';import {Header,Footer} from '@/components/ui';
export const metadata:Metadata={title:'Form & Field — Thoughtful things for your home',description:'Considered design for a more thoughtful home.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body><StoreProvider><Header/><main>{children}</main><Footer/></StoreProvider></body></html>}
