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
        path: "basic",
        name: "Basic Profile",
        component: () => import("../views/BasicProfile.vue"),
      },
      {
        path: "listings",
        name: "My Listings",
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
        name: "Requested Properties",
        component: () => import("../views/ViewedProperties.vue"),
      },
      {
        path: "chats",
        name: "My Chats",
        component: () => import("../views/MyChats.vue"),
        children: [
          {
            path: ":conversationId",
            name: "Chat Window",
            component: () => import("../views/ChatWindow.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/property/add",
    name: "Add Property",
    component: () => import("../views/AddEditProperty.vue"),
  },
  {
    path: "/property/edit/:propertyId",
    name: "Edit Property",
    component: () => import("../views/AddEditProperty.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
