import React, { useContext, useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";
import { db } from "../../../firebaseConfig";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const UserOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, "orders");
        const ordersFiltered = query(
          ordersCollection,
          where("email", "==", user.email)
        );
        const querySnapshot = await getDocs(ordersFiltered);
        const newArr = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMyOrders(newArr);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    fetchOrders();
  }, [user.email]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginLeft: "-5rem",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontFamily: "'Poppins', sans-serif", marginBottom: "2rem" }}
      >
        Mis Compras
      </Typography>
      {myOrders.map((order) => (
        <Card key={order.id} sx={{ width: "80%", marginBottom: "1rem" }}>
          <CardContent>
            <Box
              sx={{
                height: "100%",
                display: "flex",

                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {order.items?.map((product) => (
                <Box
                  key={product.id}
                  sx={{
                    marginBottom: "1rem",
                    width: "100%",
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                  }}
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    style={{
                      maxWidth: "100px",
                      marginBottom: "0.5rem",
                      maxHeight: "120px",
                      marginRight: "1rem",
                      marginBottom: "5rem",
                    }}
                  />
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      <strong>Producto:</strong> {product.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <strong>Cantidad:</strong> {product.quantity}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <strong>Precio Unitario:</strong> $
                      {product.unit_price.toFixed(2)}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <strong>Precio Total:</strong> $
                      {(product.unit_price * product.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "space-between",
                  justifyContent: "space-between",
                  marginTop: "1rem",
                }}
              >
                <div>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      textAlign: "right",
                      fontWeight: 200,
                      marginBottom: "5rem",
                      fontSize: "200%",
                    }}
                  >
                    Total de la Orden:
                    <strong style={{margin: "1rem"}}>${order.total.toFixed(2)}</strong>
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      textAlign: "right",
                    }}
                  >
                    <strong>Código Postal:</strong> {order.cp}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      textAlign: "right",
                    }}
                  >
                    <strong>Teléfono:</strong> {order.phone}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      textAlign: "right",
                    }}
                  >
                    <strong>Dirección:</strong> {order.address}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      textAlign: "right",
                    }}
                  >
                    <strong>Ciudad:</strong> {order.city}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      textAlign: "right",
                    }}
                  >
                    <strong>Provincia:</strong> {order.province}
                  </Typography>
                </div>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserOrders;
