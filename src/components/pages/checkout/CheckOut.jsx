import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { Button, TextField, Typography, Box } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { useLocation } from "react-router";
import { db } from "../../../firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  serverTimestamp,
  runTransaction,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { createTheme, useTheme } from "@mui/material/styles";
import { DrawerContext } from "../../../context/DrawerContext";

function CheckOut() {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  initMercadoPago(import.meta.env.VITE_PUBLICMP, {
    locale: "es-AR",
  });
  const [preferenceId, setPreferenceId] = useState(null);
  const [userData, setUserData] = useState({});
  const [orderId, setOrderId] = useState(null);
  const [order, setOrder] = useState(null);
  const [numberOrder, setNumberOrder] = useState();

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const paramsValue = queryParams.get("status");

  useEffect(() => {
    const traerId = async () => {
      try {
        const refContador = doc(db, "contador", "contador");

        await runTransaction(db, async (transaction) => {
          const docContador = await transaction.get(refContador);
          const nuevoValor = docContador.data().autoincremental + 1;

          transaction.update(refContador, { autoincremental: nuevoValor });
          setNumberOrder(nuevoValor);
        });
      } catch (error) {
        console.error("Error al obtener el nuevo ID:", error);
      }
    };

    traerId();
  }, []);

  console.log(numberOrder);

  const { setOpenDrawer, openDrawer } = React.useContext(DrawerContext);
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMiddleMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [drawerWidth, setDrawerWidth] = React.useState(
    isMiddleMobile ? 75 : 240
  );

  const [clienteRef, setClienteRef] = useState();

  useEffect(() => {
    let orderFromStorage = JSON.parse(localStorage.getItem("order"));
    setOrder(orderFromStorage);

    if (paramsValue === "approved" && clienteRef) {
      let ordersCollection = collection(db, "userOrders");
      addDoc(ordersCollection, {
        ...orderFromStorage,
        date: serverTimestamp(),
        status: "pagoRecibido",
        payStatus: "approvedMercadoPago",
        client: clienteRef,
      }).then((res) => {
        setOrderId(res.id);
      });

      orderFromStorage.orderItems.forEach((element) => {
        updateDoc(doc(db, "products", element.id), {
          stock: element.stock - element.quantity,
        });
      });

      localStorage.removeItem("order");
      clearCart();
    }
  }, [clienteRef]);

  let total = getTotalPrice();

  const createPreference = async () => {
    const newArray = cart.map((product) => {
      return {
        title: product.title,
        unit_price: product.unit_price,
        quantity: product.quantity,
      };
    });
    try {
      let res = await axios.post(
        "https://mp-pied.vercel.app/create_preference",

        {
          items: newArray,
          shipment_cost: 10,
        }
      );

      const { id } = res.data;
      return id;
    } catch (error) {
      console.log(error);
    }
  };

  const createCheckoutGoCuotas = async (token) => {
    // Convertir 'total' a centavos y asegurar que sea un entero
    const amountInCents = Math.round(total * 100);

    console.log("Total (en centavos):", amountInCents);
    console.log("Email:", user.email);
    console.log("Order Number:", numberOrder);
    console.log("Token:", token);

    try {
      let res = await axios.post(
        "https://mp-pied.vercel.app/create-checkout",
        {
          amount_in_cents: amountInCents, // Usa 'amountInCents' en lugar de 'total'
          email: user.email,
          order_reference_id: numberOrder,
          phone_number: "1168702318",
          url_failure: "https://mp.atlantics.dev/checkout-failure",
          url_success: `https://mp.atlantics.dev/checkout-success/${numberOrder}/approvedcuotas`,
          webhook_url: `https://mp-pied.vercel.app/webhook`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
      const url = res.data;
      return url;
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un estado que no está en el rango de 2xx
        console.log("Error Response:", error.response.data);
        console.log("Error Status:", error.response.status);
        console.log("Error Headers:", error.response.headers);
      } else if (error.request) {
        // La solicitud se realizó pero no se recibió respuesta
        console.log("Error Request:", error.request);
      } else {
        // Algo pasó al configurar la solicitud que lanzó un error
        console.log("Error Message:", error.message);
      }
      console.log("Error Config:", error.config);
    }
  };
  // Función para autenticar y obtener el token
  const email = "ecomerce@altantics.dev";
  const password = "asd123";

  const goCuotas = async () => {
    try {
      // Realizar la petición POST al endpoint de autenticación de GoCuotas
      const response = await axios.post(
        "https://mp-pied.vercel.app/authenticate", // Asegúrate de usar la URL correcta de autenticación
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.token;
    } catch (error) {
      // Manejar errores de la petición
      console.error(
        "Error authenticating:",
        error.response ? error.response.data : error.message
      );
      throw new Error(
        error.response ? error.response.data.message : "Error authenticating"
      );
    }
  };

  const [linkGoCuotas, setLinkGoCuotas] = useState("");

  const handleBuy = async () => {
    let orderFromStorage = JSON.parse(localStorage.getItem("order"));
    setOrder(orderFromStorage);

    try {
      const token = await goCuotas();
      if (!token) {
        throw new Error("Authentication failed");
      }

      const checkoutUrl = await createCheckoutGoCuotas(token);
      console.log(checkoutUrl);
      if (!checkoutUrl) {
        throw new Error("Checkout creation failed");
      }

      setLinkGoCuotas(checkoutUrl);

      if (token && checkoutUrl) {
        await handleCreatePreferenceAndOrder();
      }

      return checkoutUrl;
    } catch (error) {
      console.error("Error during handleBuy:", error);
    }
  };

  const [clienteId, setClienteId] = useState();
  const [dataCliente, setDataCliente] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userOrdersCollection = collection(db, "users");
        const snapShotOrders = await getDocs(userOrdersCollection);
        snapShotOrders.forEach(async (userArray) => {
          const userDataFromOrder = userArray.data();

          // Verificar si user existe antes de acceder a user.email
          if (user && userDataFromOrder.email === user.email) {
            console.log(userArray.id);
            // Crear DocumentReference
            const clienteRef = doc(db, "users", userArray.id);
            const docSnapshot = await getDoc(clienteRef);
            if (docSnapshot) {
              const data = docSnapshot.data();
              setDataCliente(data);
            }

            const obtenerRutaCliente = (idCliente) => {
              return `users/${idCliente}`;
            };

            const client = doc(db, obtenerRutaCliente(docSnapshot.id));
            console.log(clienteRef);

            // Obtener data del cliente

            // Setear el clienteId y clienteRef
            setClienteId(userArray.id);
            setClienteRef(client);
            console.log(userArray.id);
            console.log(client);
          }
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUser();
  }, [paramsValue]);

  console.log(dataCliente);

  const handleCreatePreferenceAndOrder = async () => {
    try {
      const id = await createPreference();
      if (!id) {
        throw new Error("Preference creation failed");
      }

      const order = {
        canalVenta: "WEB",
        client: clienteRef,
        clienteId: clienteId,
        date: serverTimestamp(),
        infoEntrega: {
          calle: userData.address,
          ciudad: userData.city,
          codigoPostal: userData.cp.codigoPostal,
          estado: "Buenos Aires",
          numero: "",
          pais: "Argentina",
          pisoDpto: "",
        },
        note: "",
        numberOrder: numberOrder,
        orderItems: cart,
        status: "nueva",
        total: total,
        serviceShipping: [],
        agencyShipping: [],
        direccionSeleccionada: "Av Callao 852 1 A Lunes a Viernes de 11 a 18hs",
      };

      localStorage.setItem("order", JSON.stringify(order));
      setPreferenceId(id);
    } catch (error) {
      console.error("Error during handleCreatePreferenceAndOrder:", error);
    }
  };

  const [orderCompleta, setOrderCompleta] = useState(false);

  useEffect(() => {
    setOrderCompleta(true);
  }, [preferenceId]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    console.log(userData);
  };

  useEffect(() => {
    // Desplazarse a la parte superior de la página
    window.scrollTo(0, 0);
  }, []);

  const styles = {
    container: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      paddingTop: "0rem",
    },
    title: {
      marginBottom: "1rem",
      fontFamily: '"Poppins", sans-serif',
      fontWeight: "700",
    },
    text: {
      fontFamily: '"Poppins", sans-serif',
      marginBottom: "0.5rem",
    },
    bold: {
      fontWeight: "600",
    },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        fontFamily: '"Poppins", sans-serif',
        padding: "2rem",
        flexDirection: isMobile ? "column-reverse" : "row",
        marginTop: isMobile ? "0rem" : "5rem",
        marginLeft: isMobile ? "0rem" : "-50px",
        zoom: 0.9,
      }}
    >
      {!orderId && orderCompleta ? (
        <div>
          <div
            style={{
              marginTop:
                isMobile && orderCompleta && orderId ? "50rem" : "0rem",
            }}
          >
            <Typography
              style={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: "900",
              }}
              variant="h4"
              sx={{ marginBottom: "1rem" }}
            >
              Checkout
            </Typography>
            <TextField
              onChange={handleChange}
              name="cp"
              variant="outlined"
              label="Código Postal"
              sx={{ marginBottom: "1rem", width: "100%" }}
              InputLabelProps={{
                sx: {
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: "400",
                },
              }}
            />
            <TextField
              onChange={handleChange}
              name="telefono"
              variant="outlined"
              label="Teléfono"
              sx={{ marginBottom: "1rem", width: "100%" }}
              InputLabelProps={{
                sx: {
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: "400",
                },
              }}
            />
            <TextField
              onChange={handleChange}
              name="calle"
              variant="outlined"
              label="Dirección"
              sx={{ marginBottom: "1rem", width: "100%" }}
              InputLabelProps={{
                sx: {
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: "400",
                },
              }}
            />
            <TextField
              onChange={handleChange}
              name="city"
              variant="outlined"
              label="Ciudad"
              sx={{ marginBottom: "1rem", width: "100%" }}
              InputLabelProps={{
                sx: {
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: "400",
                },
              }}
            />
            <TextField
              onChange={handleChange}
              name="province"
              variant="outlined"
              label="Provincia"
              sx={{ marginBottom: "1rem", width: "100%" }}
              InputLabelProps={{
                sx: {
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: "400",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={() => handleBuy()}
              sx={{
                marginBottom: "1rem",
                width: "100%",
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              Confirmar Datos
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Typography
            variant="h4"
            sx={{
              marginBottom: "1rem",
              fontFamily: '"Poppins", sans-serif',
              fontWeight: "900",
            }}
          >
            Pago realizado con éxito
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginBottom: "1rem", fontFamily: '"Poppins", sans-serif' }}
          >
            Orden de compra: {orderId}
          </Typography>
          <Link to="/shop">
            <Button
              style={{ fontFamily: '"Poppins", sans-serif' }}
              variant="contained"
              sx={{ width: "100%" }}
            >
              Volver a la tienda
            </Button>
          </Link>
        </div>
      )}
      {orderCompleta && preferenceId && (
        <Box
          sx={{
            marginTop: isMobile ? "1" : "5rem",
            width: "100%",
            padding: isMobile ? 0 : "5rem",
            paddingTop: "0rem",
            display: "flex",
            flexDirection: "column",
            zoom: isMobile ? 1 : 0.8,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginBottom: "1rem",
              fontFamily: '"Poppins", sans-serif',
              fontWeight: "700",
            }}
          >
            Datos del Usuario
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: '"Poppins", sans-serif',
              marginBottom: "0.5rem",
            }}
          >
            <strong style={{ fontWeight: "600" }}>Cliente: </strong>{" "}
            {dataCliente.name + " " + dataCliente.apellido}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: '"Poppins", sans-serif',
              marginBottom: "0.5rem",
            }}
          >
            <strong style={{ fontWeight: "600" }}>Direccion: </strong>{" "}
            {userData.calle}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: '"Poppins", sans-serif',
              marginBottom: "0.5rem",
            }}
          >
            <strong style={{ fontWeight: "600" }}>Ciudad: </strong>{" "}
            {userData.city}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: '"Poppins", sans-serif',
              marginBottom: "0.5rem",
            }}
          >
            <strong style={{ fontWeight: "600" }}>Provincia:</strong> Buenos
            Aires
          </Typography>

          <Typography
            variant="h6"
            sx={{
              marginTop: "2rem",
              marginBottom: "1rem",
              fontFamily: '"Poppins", sans-serif',
              fontWeight: "700",
            }}
          >
            Detalles de los Productos
          </Typography>
          {order?.orderItems.map((item, index) => (
            <Box key={index} sx={{ marginBottom: "1rem" }}>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  marginBottom: "0.5rem",
                }}
              >
                <strong style={{ fontWeight: "600" }}>Producto:</strong>{" "}
                {item.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  marginBottom: "0.5rem",
                }}
              >
                <strong style={{ fontWeight: "600" }}>Cantidad:</strong>{" "}
                {item.quantity}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Poppins", sans-serif',
                  marginBottom: "0.5rem",
                }}
              >
                <strong style={{ fontWeight: "600" }}>Precio Unitario:</strong>{" "}
                {item.unit_price}
              </Typography>
            </Box>
          ))}

          <div style={{ width: "200px" }}>
            <Wallet initialization={{ preferenceId, redirectMode: "self" }} />
          </div>
          <div
            style={{
              width: "300px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Link
              to={linkGoCuotas}
              style={{
                border: "1px solid grey",
                borderRadius: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "1rem",
                padding: "0.5rem",
                width: "100%",
              }}
            >
              <img
                src="https://tuquejasuma.com/media/cache/12/da/12da800997e20a64eac1fd613e7342c9.png"
                alt=""
                srcset=""
                style={{ width: "100px" }}
              />
            </Link>
            <div>
              <h6>Cuotas Sin Interes con DEBITO</h6>
            </div>
          </div>
        </Box>
      )}
    </div>
  );
}

export default CheckOut;
