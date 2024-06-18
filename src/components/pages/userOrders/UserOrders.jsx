import React, { useContext, useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";
import { db } from "../../../firebaseConfig";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const UserOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        marginTop: isMobile ? "0" : "5rem",
        marginLeft: isMobile ? "0" : "-5rem",
        padding: isMobile ? "0 1rem" : "0",
        zoom: "0.8",
      }}
    >
      {myOrders.map((order) => (
        <Card
          key={order.id}
          sx={{ width: isMobile ? "100%" : "80%", marginBottom: "1rem" }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {order.items?.map((product) => (
                <Box
                  key={product.id}
                  sx={{
                    marginBottom: "1rem",
                    width: isMobile ? "100%" : "auto",
                    display: "flex",
                    flexDirection: isMobile ? "row" : "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                  }}
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    style={{
                      maxWidth: isMobile ? "50px" : "100px",
                      marginBottom: isMobile ? "0" : "0.5rem",
                      maxHeight: isMobile ? "60px" : "120px",
                      marginRight: isMobile ? "1rem" : "0",
                    }}
                  />
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        fontSize: isMobile ? "1rem" : "1.25rem",
                        width: "250px",
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: isMobile ? "0.875rem" : "1rem",
                      }}
                    >
                      <strong> {product.quantity}</strong>
                    </Typography>
                    {!isMobile && (
                      <>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: isMobile ? "0.875rem" : "1rem",
                          }}
                        >
                          <strong>Precio Unitario:</strong> $
                          {product.unit_price.toFixed(2)}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: isMobile ? "0.875rem" : "1rem",
                          }}
                        >
                          <strong>Precio Total:</strong> $
                          {(product.unit_price * product.quantity).toFixed(2)}
                        </Typography>
                      </>
                    )}
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
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      textAlign: isMobile ? "left" : "right",
                      fontSize: isMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    <strong>Código Postal:</strong> {order.cp}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      textAlign: isMobile ? "left" : "right",
                      fontSize: isMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    <strong>Teléfono:</strong> {order.phone}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      textAlign: isMobile ? "left" : "right",
                      fontSize: isMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    <strong>Dirección:</strong> {order.address}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      textAlign: isMobile ? "left" : "right",
                      fontSize: isMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    <strong>Ciudad:</strong> {order.city}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      textAlign: isMobile ? "left" : "right",
                      fontSize: isMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    <strong>Provincia:</strong> {order.province}
                  </Typography>
                </div>
              </Box>
            </Box>
            <div>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  textAlign: isMobile ? "left" : "right",
                  fontWeight: 200,
                  marginBottom: isMobile ? "1rem" : "5rem",
                  fontSize: isMobile ? "1rem" : "2rem",
                  marginTop: "2rem",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                Total de la Orden:
                <br />
                <strong>${order.total.toFixed(2)}</strong>
              </Typography>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserOrders;
