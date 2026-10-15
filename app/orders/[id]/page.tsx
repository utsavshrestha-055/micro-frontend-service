import { Suspense } from 'react';
import OrderDetailContent from './OrderDetailContent';

export default function OrderDetailPage() {
  return <Suspense fallback={<div className="wrap empty-state">Loading order…</div>}>
    <OrderDetailContent />
  </Suspense>;
}
