'use client';

import Link from 'next/link';
import { useStore } from '@/lib/context/store';

export default function Cart() {
  const { cart, remove, qty } = useStore();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 150 || subtotal === 0 ? 0 : 12;

  return <div className="wrap account-page">
    <span className="eyebrow">YOUR SELECTION</span>
    <h1>Your bag<span className="count"> ({count})</span></h1>
    {!cart.length ? <div className="empty-state"><h2>Nothing here just yet.</h2><p>The best things take time to find.</p><Link className="button button-dark" href="/categories">Explore categories</Link></div>
      : <div className="cart-layout">
        <div className="cart-items">{cart.map(({ product, quantity }) => <div className="cart-row" key={product.id}>
          <Link href={`/products/${product.id}`}>{product.image ? <img src={product.image} alt={product.name}/> : <span className="cart-image-placeholder" aria-label={product.name}/>}</Link>
          <div className="cart-name"><Link href={`/products/${product.id}`}>{product.name}</Link><span>{product.category}</span><button onClick={() => remove(product.id)}>Remove</button></div>
          <div className="quantity"><button aria-label={`Decrease ${product.name} quantity`} onClick={() => qty(product.id, quantity - 1)}>−</button><span>{quantity}</span><button aria-label={`Increase ${product.name} quantity`} onClick={() => qty(product.id, quantity + 1)}>＋</button></div>
          <b>${(product.price * quantity).toFixed(2)}</b>
        </div>)}</div>
        <aside className="summary"><h2>Order summary</h2><p><span>Subtotal</span><b>${subtotal.toFixed(2)}</b></p><p><span>Shipping</span><b>{shipping ? `$${shipping.toFixed(2)}` : 'Complimentary'}</b></p><hr/><p className="total"><span>Total</span><b>${(subtotal + shipping).toFixed(2)}</b></p><Link className="button button-dark full" href="/checkout">Continue to checkout ↗</Link><small>Taxes calculated at checkout</small></aside>
      </div>}
  </div>;
}
