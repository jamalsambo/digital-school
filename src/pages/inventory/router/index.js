import Category from '../pages/product/Category.vue';
import Products from '../pages/product/Products.vue';
import Supplier from '../pages/product/Supplier.vue';
import In from '../pages/stock/In.vue';
import Move from '../pages/stock/Move.vue';
import CreateCategory from '../pages/product/CreateCategory.vue';
import CreateSuppier from '../pages/product/CreateSuppier.vue';
import Create from '../pages/product/Create.vue';

const stockRoutes= [
   { path: 'stock/move', name: 'stock-move', component: Move },
   { path: 'stock/move/:way', name: 'stock-move-create', component: In },

   { path: 'stock/products', name: 'stock-produts', component: Products },
    { path: 'stock/product/create', name: 'stock-product-create', meta: {title: 'Create Product'}, component: Create },
   { path: 'stock/products/categories', name: 'stock-categories', component: Category },
   { path: 'stock/products/category/create', name: 'stock-categories-create', meta: {title: 'Create Product Category'}, component: CreateCategory },
   { path: 'stock/products/suppliers', name: 'stock-suppliers', component: Supplier },
   { path: 'stock/products/supplier/create', name: 'stock-supplier-create', meta: {title: 'Create Product Supplier'}, component: CreateSuppier },

];

export default stockRoutes;
