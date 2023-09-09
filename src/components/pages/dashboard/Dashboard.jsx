import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { menuItems } from "../../../router/navigation";
import { logout } from "../../../firebaseConfig";
import { AuthContext } from "../../../context/AuthContext";
import { Button } from "@mui/material";
import ProductForm from "./ProductForm";
import { db } from "../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import ProductList from "./ProductList";
import ClientList from "./ClientList";
import VendedoresList from "./VendedoresList";
const drawerWidth = 200;

const Dashboard = (props) => {
  const [products, setProducts] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [verProductos, setVerProductos] = useState(false);
  const [verClientes, setVerClientes] = useState(false);
  const [verVendedores, setVerVendedores] = useState(false);

  useEffect(() => {
    let vendedoresCollection = collection(db, "users");
    getDocs(vendedoresCollection)
      .then((res) => {
        const nuevosVendedores = []; // Inicializa un arreglo para los nuevos vendedores
        res.docs.forEach((elemento) => {
          if (elemento.data().rol === "vendedor") {
            nuevosVendedores.push({ ...elemento.data(), id: elemento.id });
          }
        });
        setVendedores(nuevosVendedores); // Actualiza el estado una vez con todos los vendedores
      })
      .catch((error) => {
        console.error("Error al obtener vendedores:", error);
      });
  }, []);

  useEffect(() => {
    let clientesCollection = collection(db, "clientes");
    getDocs(clientesCollection).then((res) => {
      const newArray = res.docs.map((cliente) => {
        return {
          ...cliente.data(),
          id: cliente.id,
        };
      });
      setClientes(newArray);
    });
  }, []);

  useEffect(() => {
    setIsChange(false);
    let productsCollection = collection(db, "productos");
    getDocs(productsCollection).then((res) => {
      const newArray = res.docs.map((product) => {
        return {
          ...product.data(),
          id: product.id,
        };
      });
      setProducts(newArray);
    });
  }, [isChange]);

  console.log(products);

  const { handleLogoutContext, user } = useContext(AuthContext);
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const rolAdmin = import.meta.env.VITE_ADMIN;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const cerrarSesion = () => {
    logout();
    handleLogoutContext();
    navigate("/login");
  };

  const drawer = (
    <div style={{ color: "#89ca8f", backgroundColor: "#89ca8f" }}>
      <Toolbar />

      <List>
        {menuItems.map(({ id, path, title, Icon }) => {
          return (
            <Link key={id} to={path}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Icon sx={{ color: "whitesmoke" }} />
                  </ListItemIcon>
                  <ListItemText primary={title} sx={{ color: "whitesmoke" }} />
                </ListItemButton>
              </ListItem>
            </Link>
          );
        })}

        {user.rol === rolAdmin && (
          <Link to={"/dashboard"}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <DashboardIcon sx={{ color: "whitesmoke" }} />
                </ListItemIcon>
                <ListItemText
                  primary={"Administracion"}
                  sx={{ color: "whitesmoke" }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        )}

        <ListItem disablePadding>
          <ListItemButton onClick={cerrarSesion}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: "whitesmoke" }} />
            </ListItemIcon>
            <ListItemText
              primary={"Cerrar sesion"}
              sx={{ color: "whitesmoke" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          backgroundColor: "#89ca8f",
        }}
      >
        <Toolbar
          sx={{
            gap: "20px",
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#89ca8f",
          }}
        >
          <Link to="/" style={{ color: "whitesmoke" }}>
            Alimentos Naturales
          </Link>
          <IconButton
            color="#89ca8f"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon color="secondary.primary" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        aria-label="mailbox folders"
        style={{ backgroundColor: "#89ca8f" }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          anchor={"right"}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#1976d2",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          width: "100%",
          minHeight: "100vh",
          px: 2,
        }}
      >
        <Toolbar />
        <div
          style={{
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "column",
          }}
        >
          {verProductos ? (
            <Button
              style={{
                margin: "1rem",
                width: "300px",
              }}
              variant="contained"
              onClick={() => setVerProductos(!verProductos)}
            >
              Cerrar
            </Button>
          ) : (
            <Button
              style={{
                backgroundColor: "#89ca8f",
                margin: "1rem",
                width: "300px",
              }}
              variant="contained"
              onClick={() => setVerProductos(!verProductos)}
            >
              Productos
            </Button>
          )}

          {!verClientes ? (
            <Button
              style={{
                backgroundColor: "#89ca8f",
                margin: "1rem",
                width: "300px",
              }}
              variant="contained"
              onClick={() => setVerClientes(!verClientes)}
            >
              Clientes
            </Button>
          ) : (
            <Button
              style={{ margin: "1rem", width: "300px" }}
              variant="contained"
              onClick={() => setVerClientes(!verClientes)}
            >
              Cerrar
            </Button>
          )}

          {verVendedores ? (
            <Button
              style={{ margin: "1rem", width: "300px" }}
              variant="contained"
              onClick={() => setVerVendedores(!true)}
            >
              Cerrar
            </Button>
          ) : (
            <Button
              style={{
                backgroundColor: "#89ca8f",
                margin: "1rem",
                width: "300px",
              }}
              variant="contained"
              onClick={() => setVerVendedores(true)}
            >
              Vendedores
            </Button>
          )}
        </div>

        {verClientes && <ClientList clientes={clientes} />}
        {verProductos && (
          <ProductList products={products} setIsChange={setIsChange} />
        )}
        {verVendedores && <VendedoresList vendedores={vendedores} />}

        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
