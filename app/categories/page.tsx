'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { categoryService } from '@/lib/services';
import type { Category } from '@/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    categoryService.list()
      .then(({ data }) => setCategories(data))
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : 'Could not load categories.');
      })
      .finally(() => setLoading(false));
  }, []);

  return <div className="wrap listing-page">
    <div className="page-heading"><span className="eyebrow">FIND YOUR FEELING</span><h1>Shop by category.</h1><p>Explore the collection by the way you live.</p></div>
    {loading ? <div className="empty-state">Loading categories…</div>
      : error ? <div className="empty-state" role="alert">{error}</div>
      : categories.length ? <div className="category-grid category-list-grid">{categories.map((item, index) => <Link className="category-card" href={`/products?category=${encodeURIComponent(item.id)}`} key={item.id}>
        {item.image ? <img src={item.image} alt=""/> : <span className="category-placeholder"/>}
        <div className="category-overlay"/><div><span>{String(index + 1).padStart(2, '0')} / {String(categories.length).padStart(2, '0')}</span><h3>{item.name}</h3><p>{item.description || 'Explore this part of the collection.'}</p></div><b>↗</b>
      </Link>)}</div>
      : <div className="empty-state">There are no categories to show yet.</div>}
  </div>;
}
