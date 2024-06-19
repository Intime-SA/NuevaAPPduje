import Home from "../components/pages/home/Home";
import ItemListContainer from "../components/pages/itemList/ItemListContainer";
import ItemDetail from "../components/pages/itemDetail/ItemDetail";
import Cart from "../components/pages/card/Cart";
import CheckOut from "../components/pages/checkout/CheckOut";
import Dashboard from "../components/pages/dashboard/Dashboard";
import UserOrders from "../components/pages/userOrders/UserOrders";
import Pedidos from "../components/pages/pedidos/Pedidos";
import DemoHome from "../components/pages/demo/DemoHome";
import CheckOutFailure from "../components/pages/checkout/CheckOutFailure";
import CheckOutSuccess from "../components/pages/checkout/CheckOutSuccess";

export const routes = [
  /*   {
    id: "home",
    path: "/",
    Element: Home,
  }, */
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
  {
    id: "pedidos",
    path: "/pedidos",
    Element: Pedidos,
  },
  {
    id: "demoHome",
    path: "/",
    Element: DemoHome,
  },
  {
    id: "checkout-failure",
    path: "/checkout-failure",
    Element: CheckOutFailure,
  },
  {
    id: "checkout-success",
    path: "/checkout-success/:numberOrder/status=:status",
    Element: CheckOutSuccess,
  },
];
