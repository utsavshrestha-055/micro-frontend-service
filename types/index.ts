export interface Category { id:string; name:string; image:string; description:string }
export interface Product { id:string; name:string; category:string; price:number; originalPrice?:number; image:string; images:string[]; description:string; rating:number; reviewCount:number; stock:number; isNew?:boolean; tag?:string; colors:string[] }
export interface Customer { id:string; name:string; email:string; phone:string; addresses:Address[] }
export interface Address { id:string; label:string; name:string; line1:string; city:string; postalCode:string; country:string }
export interface CartItem { product:Product; quantity:number }
export interface Order { id:string; date:string; items:CartItem[]; total:number; paymentStatus:'Paid'|'Pending'; status:'Delivered'|'Shipped'|'Processing'; address:Address }
export interface ApiResponse<T> { data:T; message?:string }
