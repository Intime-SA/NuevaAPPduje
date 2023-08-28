import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ShopIcon from "@mui/icons-material/Shop";
export const menuItems = [
  {
    id: "home",
    path: "/",
    title: "Inicio",
    Icon: HomeIcon,
  },
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
];
