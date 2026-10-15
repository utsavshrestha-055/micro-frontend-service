'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { categoryService, productService } from '@/lib/services';
import { ProductCard, SectionTitle } from '@/components/ui';
import type { Category, Product } from '@/types';

export default function Home() {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([productService.list(), categoryService.list()])
      .then(([products, groups]) => { setItems(products.data); setCategories(groups.data); })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Could not load the collection.'));
  }, []);

  return <>
    <section className="hero"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=90" alt="Sunlit living room with warm, natural materials"/><div className="hero-shade"/><div className="hero-content"><span className="eyebrow light">THE ART OF EVERYDAY LIVING</span><h1>A home that<br/>feels like <em>you.</em></h1><p>Thoughtfully chosen pieces for all the little moments that make a life.</p><Link className="button button-light" href="/categories">Discover the collection <span>↗</span></Link></div><div className="hero-index">01 / 03 <span>———</span> A slower kind of living</div></section>
    {error && <div className="wrap empty-state" role="alert">{error}</div>}
    <section className="wrap section categories-section"><SectionTitle eyebrow="FIND YOUR FEELING" title="Shop by category" link="Explore all" href="/categories"/><div className="category-grid">{categories.map((item, index) => <Link className="category-card" href={`/products?category=${encodeURIComponent(item.id)}`} key={item.id}>{item.image && <img src={item.image} alt=""/>}<div className="category-overlay"/><div><span>{String(index + 1).padStart(2, '0')} / {String(categories.length).padStart(2, '0')}</span><h3>{item.name}</h3><p>{item.description}</p></div><b>↗</b></Link>)}</div></section>
    <section className="wrap section"><SectionTitle eyebrow="THE ONES YOU LOVE" title="The considered edit" link="Shop all pieces" href="/products"/><div className="product-grid">{items.slice(0, 4).map(item => <ProductCard product={item} key={item.id}/>)}</div></section>
    <section className="editorial"><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=85" alt="Thoughtful objects in a calm, neutral home"/><div><span className="eyebrow">A LITTLE MORE MEANING</span><h2>Keep what<br/>makes you <em>feel.</em></h2><p>Our pieces are made to become part of your story. Natural materials, considered forms, and the kind of quality that gets better with time.</p><Link className="text-link" href="/products">A note on how we choose ↗</Link></div></section>
    <section className="wrap section"><SectionTitle eyebrow="JUST ARRIVED" title="New to the collection" link="See what’s new" href="/products"/><div className="product-grid">{items.filter(item => item.isNew).slice(0, 4).map(item => <ProductCard product={item} key={item.id}/>)}</div></section>
    <section className="newsletter"><span className="eyebrow">LETTERS FROM HOME</span><h2>A little inspiration, occasionally.</h2><p>New finds, considered ideas, and moments worth keeping.</p><form action="#"><input type="email" required placeholder="Your email address" aria-label="Your email address"/><button aria-label="Subscribe">↗</button></form></section>
  </>;
}
