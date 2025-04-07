import Category from '../pages/product/Category.vue';
import Products from '../pages/product/Products.vue';
import Supplier from '../pages/product/Supplier.vue';
import In from '../pages/stock/In.vue';
import Move from '../pages/stock/Move.vue';

const stockRoutes= [
   { path: 'stock/move', name: 'stock-move', component: Move },
   { path: 'stock/move/:way', name: 'stock-move-create', component: In },

   { path: 'stock/products', name: 'stock-produts', component: Products },
   { path: 'stock/products/categories', name: 'stock-categories', component: Category },
   { path: 'stock/products/categories/create', name: 'stock-category-create', component: Category },
   { path: 'stock/products/suppliers', name: 'stock-suppliers', component: Supplier },

];

export default stockRoutes;
