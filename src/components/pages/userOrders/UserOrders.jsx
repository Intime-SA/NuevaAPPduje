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
                display: "flex",
                alignItems: "center",
              }}
            >
              {order.items?.map((product) => (
                <Box
                  key={product.id}
                  sx={{ marginBottom: "1rem", width: "100%" }}
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    style={{
                      maxWidth: "100px",
                      marginBottom: "0.5rem",
                      maxHeight: "120px",
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Cantidad: {product.quantity}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Precio Unitario: ${product.unit_price.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Precio Total: $
                    {(product.unit_price * product.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "space-between",
                }}
              >
                <div>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      textAlign: "right",
                      fontWeight: 600,
                      marginBottom: "20%",
                    }}
                  >
                    Total de la Orden: ${order.total.toFixed(2)}
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
                    Código Postal: {order.cp}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      textAlign: "right",
                    }}
                  >
                    Teléfono: {order.phone}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      textAlign: "right",
                    }}
                  >
                    Dirección: {order.address}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      textAlign: "right",
                    }}
                  >
                    Ciudad: {order.city}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      textAlign: "right",
                    }}
                  >
                    Provincia: {order.province}
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
