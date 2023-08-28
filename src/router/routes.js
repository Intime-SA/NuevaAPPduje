import Home from "../components/pages/home/Home";
import ItemListContainer from "../components/pages/itemList/ItemListContainer";
import ItemDetail from "../components/pages/itemDetail/ItemDetail";
import Cart from "../components/pages/card/Cart";

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
];
