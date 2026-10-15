import type { Address, ApiResponse, Category, Customer, Order, Product } from '@/types';
import { apiRequest, clearAccessToken, setAccessToken } from '@/lib/api';
export { API_BASE_URL, getAccessToken } from '@/lib/api';
export { clearAccessToken };
type Json = Record<string, any>;

function product(raw: Json): Product {
  const p = raw.product || raw;
  const details = raw.details || {};
  const images = (raw.images || []).map((image: Json) => image.url).filter(Boolean);
  const category = raw.category_parent_path?.at(-1);
  return {
    id: p.id, name: p.name, category: category?.name || p.category_id || 'Collection',
    price: Number(p.price_minor || 0) / 100, image: images[0] || '', images,
    description: details.long_description || p.short_description || '', rating: 0, reviewCount: 0,
    stock: Number(p.stock_quantity || 0), colors: [],
  };
}
function category(raw: Json): Category {
  return { id: raw.id, name: raw.name, description: raw.description || '', image: '' };
}
function order(raw: Json): Order {
  const addressData = (() => { try { return JSON.parse(raw.shipping_address_json || '{}'); } catch { return {}; } })();
  const statuses: Record<string, Order['status']> = { PENDING: 'Processing', CONFIRMED: 'Processing', PAID: 'Processing', SHIPPED: 'Shipped', DELIVERED: 'Delivered', CANCELLED: 'Processing', REFUNDED: 'Processing' };
  return {
    id: raw.id, date: raw.created_at, items: (raw.items || []).map((item: Json) => ({
      product: { id: item.product_id, name: item.product_name, category: '', price: Number(item.unit_price_minor || 0) / 100, image: '', images: [], description: '', rating: 0, reviewCount: 0, stock: 0, colors: [] },
      quantity: Number(item.quantity),
    })), total: Number(raw.total_minor || 0) / 100, paymentStatus: raw.status === 'PAID' ? 'Paid' : 'Pending',
    status: statuses[raw.status] || 'Processing', address: {
      id: '', label: 'Shipping', name: addressData.name || '', line1: addressData.line1 || '', city: [addressData.city, addressData.region].filter(Boolean).join(', '), postalCode: addressData.postal_code || '', country: addressData.country_code || '',
    },
  };
}

export const authService = {
  async login(email: string, password: string) {
    const result = await apiRequest<Json>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }, false);
    setAccessToken(result.access_token);
    return result;
  },
  async logout() { try { await apiRequest('/auth/logout', { method: 'POST' }); } finally { clearAccessToken(); } },
};
export const productService = {
  async list(): Promise<ApiResponse<Product[]>> { const r = await apiRequest<Json>('/products?page_size=100'); return { data: (r.products || []).map(product) }; },
  async getById(id: string): Promise<ApiResponse<Product | undefined>> { return { data: product(await apiRequest<Json>(`/products/${encodeURIComponent(id)}`)) }; },
  async search(query: string, categoryId?: string, sort = 'featured'): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams({ page_size: '100' });
    if (query) params.set('name_search', query);
    if (categoryId) params.set('category_id', categoryId);
    const r = await apiRequest<Json>(`/products?${params}`);
    const data = (r.products || []).map(product);
    if (sort === 'price-low') data.sort((a: Product, b: Product) => a.price - b.price);
    if (sort === 'price-high') data.sort((a: Product, b: Product) => b.price - a.price);
    return { data };
  },
};
export const categoryService = { async list(): Promise<ApiResponse<Category[]>> { const r = await apiRequest<Json>('/categories?page_size=100'); return { data: (r.categories || []).map(category) }; } };
export const orderService = {
  async list(): Promise<ApiResponse<Order[]>> { const r = await apiRequest<Json>('/orders?page_size=100'); return { data: (r.orders || []).map(order) }; },
  async getById(id: string): Promise<ApiResponse<Order | undefined>> { const r = await apiRequest<Json>(`/orders/${encodeURIComponent(id)}`); return { data: r.order ? order(r.order) : undefined }; },
  async checkout(items: { product: Product; quantity: number }[], shipping: Address): Promise<ApiResponse<Order>> {
    const r = await apiRequest<Json>('/orders', { method: 'POST', headers: { 'Idempotency-Key': crypto.randomUUID() }, body: JSON.stringify({
      items: items.map(({ product: p, quantity }) => ({ product_id: p.id, quantity })),
      shipping_address: { name: shipping.name, line1: shipping.line1, line2: '', city: shipping.city, region: '', postal_code: shipping.postalCode, country_code: shipping.countryCode || shipping.country.slice(0, 2).toUpperCase() }, currency: 'USD',
    }) });
    return { data: order(r.order || r) };
  },
};
// The gateway does not expose customer profile, address, or cart persistence routes.
export const customerService = {
  async getProfile(): Promise<ApiResponse<Customer>> { throw new Error('Profile details are not available from the API yet.'); },
  async updateProfile(): Promise<ApiResponse<Customer>> { throw new Error('Profile updates are not available from the API yet.'); },
  async saveAddress(input: Address): Promise<ApiResponse<Address>> { throw new Error('Address book is not available from the API yet.'); },
};
