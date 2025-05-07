import List from '../pages/List.vue';
import ListMove from '../pages/moviment/List.vue';
import MoveCreate from '../pages/moviment/Create.vue';
import Create from '../pages/Create.vue';
import ListCategories from '../pages/category/List.vue';
import CategoryCreate from '../pages/category/Create.vue';
import ListLocations from '../pages/location/List.vue';
import CreateLocation from '../pages/location/Create.vue';


const assetsRoutes= [
   { path: 'assets', name: 'assets', component: List },
   { path: 'asset/create', name: 'asset-create', component: Create,  meta: {
    title: "Asset create"
  }},

   { path: 'assets/move', name: 'assets-move', component: ListMove,  meta: {
    title: "Move assets"
  } },
   { path: 'asset/:assetId/move', name: 'move create', component: MoveCreate, meta: {
    title: "Move create"
  } },

   { path: 'assets/categories', name: 'assets-categories', component: ListCategories },
   { path: 'assets/category/create', name: 'assets-category-create', component: CategoryCreate },


   { path: 'assets/locations', name: 'assets-locations', component: ListLocations },
   { path: 'assets/location/create', name: 'assets-location-create', component: CreateLocation },
];

export default assetsRoutes;
