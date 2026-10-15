'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { categoryService, productService } from '@/lib/services';
import type { Category, Product } from '@/types';
import { ProductCard } from '@/components/ui';

export function ProductsContent() {
  const params = useSearchParams();
  const [all, setAll] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(params.get('category') || '');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    categoryService.list().then(({ data }) => setCategories(data)).catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : 'Could not load categories.');
    });
  }, []);

  useEffect(() => {
    productService.search(query, category || undefined, sort).then(({ data }) => {
      setAll(data);
      setError('');
    }).catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : 'Could not load products.');
    });
  }, [query, category, sort]);

  const rows = all.slice((page - 1) * 6, page * 6);
  return <div className="wrap listing-page">
    <div className="page-heading"><span className="eyebrow">THE COLLECTION</span><h1>Pieces to live with.</h1><p>Objects with a point of view, and a place in your everyday.</p></div>
    <div className="listing-tools">
      <label className="search-box">⌕ <input placeholder="Search the collection" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }}/></label>
      <div className="filter-row">
        <select aria-label="Filter by category" value={category} onChange={event => { setCategory(event.target.value); setPage(1); }}>
          <option value="">All categories</option>{categories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <select aria-label="Sort products" value={sort} onChange={event => { setSort(event.target.value); setPage(1); }}>
          <option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option>
        </select><span>{all.length} pieces</span>
      </div>
    </div>
    {error && <div className="empty-state" role="alert">{error}</div>}
    <div className="product-grid">{rows.map(item => <ProductCard key={item.id} product={item}/>)}</div>
    {!all.length && !error && <div className="empty-state">No pieces found. Try another search.</div>}
    <div className="pagination"><button disabled={page === 1} onClick={() => setPage(page - 1)}>← Previous</button><span>{page} / {Math.max(1, Math.ceil(all.length / 6))}</span><button disabled={page >= Math.ceil(all.length / 6)} onClick={() => setPage(page + 1)}>Next →</button></div>
  </div>;
}
