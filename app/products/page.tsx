import {Suspense} from 'react';
import {ProductsContent} from './ProductsContent';
export default function ProductsPage(){return <Suspense fallback={<div className="wrap empty-state">Loading the collection…</div>}><ProductsContent/></Suspense>}
