import {Suspense} from 'react';
import {ProductDetailsContent} from './ProductDetails';
export default function ProductDetails(){return <Suspense fallback={<div className="wrap empty-state">Loading piece…</div>}><ProductDetailsContent/></Suspense>}
