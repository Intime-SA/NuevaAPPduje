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
import "./Navbar.css";
import { useContext, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { menuItems } from "../../../router/navigation";
import { logout } from "../../../firebaseConfig";
import { AuthContext } from "../../../context/AuthContext";
import DrawerMenu from "../drawer/Drawer";
import { Divider, Icon, Tooltip, useMediaQuery } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { DrawerContext } from "../../../context/DrawerContext";
const drawerWidth = 200;

function Navbar(props) {
  const { handleLogoutContext, user } = useContext(AuthContext);
  const { openDrawer } = useContext(DrawerContext);
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const rolAdmin = import.meta.env.VITE_ADMIN;

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 800, // Define md como 800px
        lg: 1200,
        xl: 1536,
      },
    },
  });
  const isMiddleMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const isNarrowScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const cerrarSesion = () => {
    logout();
    handleLogoutContext();
    navigate("/login");
  };

  const MenuItem = ({ path, title, Icon, openDrawer }) => (
    <ListItem style={{ color: "white" }} disablePadding>
      <ListItemButton component={Link} to={path}>
        {!openDrawer && (
          <Tooltip title={title}>
            <ListItemIcon>
              <Icon sx={{ color: "white" }} />
            </ListItemIcon>
          </Tooltip>
        )}
        <h4 style={{ fontFamily: '"Kanit", sans-serif' }}>{title}</h4>
      </ListItemButton>
    </ListItem>
  );

  const LogoutItem = ({ openDrawer }) => (
    <ListItem style={{ color: "white" }} disablePadding>
      <ListItemButton onClick={() => cerrarSesion()}>
        {!openDrawer && (
          <Tooltip title="Cerrar sesión">
            <ListItemIcon>
              <span
                style={{ color: "white" }}
                className="material-symbols-outlined"
              >
                logout
              </span>
            </ListItemIcon>
          </Tooltip>
        )}
        <h4 style={{ fontFamily: '"Kanit", sans-serif' }}>Cerrar sesión</h4>
      </ListItemButton>
    </ListItem>
  );

  const drawer = (
    <div style={{ color: "#89ca8f", backgroundColor: "#121620" }}>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map(({ id, path, title, Icon }) => (
          <MenuItem
            key={id}
            path={path}
            title={title}
            Icon={Icon}
            openDrawer={openDrawer}
          />
        ))}
        <Divider />
        <LogoutItem openDrawer={openDrawer} />
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
          backgroundColor: "#121620",
        }}
      >
        <Toolbar
          sx={{
            gap: "20px",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#121621",
          }}
        >
          <div>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/00000altanticdev-removebg-preview.png?alt=media&token=933ef3e7-fc96-48ac-bd20-8a43858dceabnpm"
              alt=""
              style={{ width: "40px", margin: "0.5rem" }}
            />
          </div>

          <Link
            style={{
              fontFamily: '"Poppins", sans-serif',
              color: "white",
              marginRight: "1rem",
            }}
            to="/"
          >
            Payment Service
            <p style={{ fontWeight: 100, fontSize: "50%" }}>
              Ambiente de testing para clientes
            </p>
          </Link>
          <IconButton
            color="white"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon style={{ color: "white" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="nav" aria-label="mailbox folders">
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
              backgroundColor: "#121620",
            },
          }}
        >
          {drawer}
        </Drawer>
        {!isNarrowScreen && <DrawerMenu />}
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

        <Outlet />
      </Box>
    </Box>
  );
}

export default Navbar;
