import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/property",
    name: "Property",
    component: () => import("../views/ExploreProperties.vue"),
  },
  {
    path: "/property/:propertyId",
    name: "PropertyDetails",
    component: () => import("../views/PropertyDetails.vue"),
  },
  {
    path: "/profile",
    component: () => import("../views/Profile.vue"),
    children: [
      {
        path: "",
        name: "BasicProfile",
        component: () => import("../views/BasicProfile.vue"),
      },
      {
        path: "listings",
        name: "MyListings",
        component: () => import("../views/MyListings.vue"),
      },
      {
        path: "listings",
        component: () => import("../views/ListedProperty.vue"),
        children: [
          {
            path: ":propertyId",
            name: "ListedPropertyDetails",
            component: () => import("../views/ListedPropetyDetails.vue"),
          },
          {
            path: "users/:propertyId",
            name: "PropertyViewedUsers",
            component: () => import("../views/RequestedUsers.vue"),
          },
          {
            path: "analytics/:propertyId",
            name: "Analytics",
            component: () => import("../views/Analytics.vue"),
          },
        ],
      },
      {
        path: "properties",
        name: "ViewedProperties",
        component: () => import("../views/ViewedProperties.vue"),
      },
      {
        path: "",
        name: "MyChats",
        component: () => import("../views/MyChats.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
