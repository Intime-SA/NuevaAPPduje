import Home from "../components/pages/home/Home";
import ItemListContainer from "../components/pages/itemList/ItemListContainer";
import ItemDetail from "../components/pages/itemDetail/ItemDetail";
import Cart from "../components/pages/card/Cart";
import CheckOut from "../components/pages/checkout/CheckOut";
import Dashboard from "../components/pages/dashboard/Dashboard";
import UserOrders from "../components/pages/userOrders/UserOrders";

export const routes = [
  {
    id: "home",
    path: "/",
    Element: Home,
  },
  {
    id: "shop",
    path: "/shop",
    Element: ItemListContainer,
  },
  {
    id: "detalle",
    path: "/itemDetail/:id",
    Element: ItemDetail,
  },
  {
    id: "cart",
    path: "/cart",
    Element: Cart,
  },
  {
    id: "checkout",
    path: "/checkout",
    Element: CheckOut,
  },
  {
    id: "userOrders",
    path: "/user-orders",
    Element: UserOrders,
  },
];
