import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ShopIcon from "@mui/icons-material/Shop";
import ListAltIcon from "@mui/icons-material/ListAlt";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";

export const menuItems = [
  /*   {
    id: "home",
    path: "/",
    title: "Inicio",
    Icon: HomeIcon,
  }, */
  {
    id: "products",
    path: "/shop",
    title: "Tienda",
    Icon: StoreIcon,
  },
  {
    id: "cart",
    path: "/cart",
    title: "Carrito",
    Icon: ShoppingCartCheckoutIcon,
  },
  {
    id: "userOrders",
    path: "/user-orders",
    title: "Mis compras",
    Icon: ShopIcon,
  },
  {
    id: "demoHome",
    path: "/demoHome",
    title: "Demo",
    Icon: OndemandVideoIcon,
  },
  /*   {
    id: "pedidos",
    path: "/pedidos",
    title: "Pedidos",
    Icon: ListAltIcon,
  }, */
];
