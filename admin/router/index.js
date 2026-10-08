import { createRouter, createWebHashHistory } from 'vue-router';
import AdminLayout from '../layouts/AdminLayout.vue';
import RoomsView from '../views/RoomsView.vue';
import StudioView from '../views/StudioView.vue';

const routes = [
  {
    path: '/',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirect: '/rooms'
      },
      {
        path: 'rooms',
        name: 'Rooms',
        component: RoomsView,
        meta: { title: 'Quản Lý Phòng' }
      },
      {
        path: 'studio/:roomId?',
        name: 'Studio',
        component: StudioView,
        meta: { title: '3D Virtual Tour Studio' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta?.title) {
    document.title = `${to.meta.title} | Lumière Vue Admin`;
  }
  next();
});

export default router;
