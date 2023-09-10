import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import { getDoc, collection, doc } from "firebase/firestore";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@mui/material";
import { count } from "console";
import { CartContext } from "../../../context/CartContext";

const ItemDetail = () => {
  const { id } = useParams();
  const { user, addToCart, getQuantityById } = useContext(CartContext);
  let quantity = getQuantityById(id);
  const [product, setProduct] = useState(null);
  const [counter, setCounter] = useState(quantity || 0);

  useEffect(() => {
    let usuario = JSON.parse(localStorage.getItem("userInfo"));
    let refCollection = collection(db, "productos");
    let refDoc = doc(refCollection, id);
    getDoc(refDoc)
      .then((res) => setProduct({ ...res.data(), id: res.id }))
      .catch((err) => console.log(err));
  }, [id]);

  // SUMAR

  console.log(user);

  const addOne = () => {
    if (counter < product.stock) {
      setCounter(counter + 1);
    } else {
      alert("stock completo");
    }
  };

  const subOne = () => {
    if (counter > 1) {
      setCounter(counter - 1);
    }
  };

  //RESTAR
  //AGREGAR

  const add = () => {
    let objeto = {
      ...product,
      quantity: counter,
    };
    console.log(objeto);
    addToCart(objeto);
  };

  console.log(product);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {product && (
        <Card
          sx={{
            flexWrap: "nowrap",
            width: 250,
            margin: 5,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CardActionArea>
            <CardMedia
              component="img"
              height="250"
              image={product.img}
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {product.name}
              </Typography>
              <div>
                <Typography
                  style={{ display: "flex", justifyContent: "space-between" }}
                  variant="body3"
                  color="text.secondary"
                >
                  <p>Precio Unitario </p> <p>{product.unit_price}</p>
                </Typography>
                <Typography
                  style={{ display: "flex", justifyContent: "space-between" }}
                  variant="body3"
                  color="text.secondary"
                >
                  <p>Peso</p>
                  <p>
                    {product.peso}
                    {product.medida}
                  </p>
                </Typography>
              </div>
              <div style={{ marginTop: "1rem" }}>
                <Typography
                  style={{ display: "flex", justifyContent: "space-between" }}
                  variant="body2"
                  color="text.secondary"
                >
                  <h6>Unidades Bulto</h6> <h6>{product.unidades}</h6>
                </Typography>
                <Typography
                  style={{ display: "flex", justifyContent: "space-between" }}
                  variant="body2"
                  color="text.secondary"
                >
                  <h6>Precio Bulto ${product.precioBulto}</h6>
                </Typography>
              </div>
            </CardContent>
            <div
              style={{
                padding: "20px",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Button variant="contained" onClick={addOne}>
                +
              </Button>
              <Button>{counter}</Button>
              <Button variant="contained" onClick={subOne}>
                -
              </Button>
            </div>
            <Button onClick={add}>Agregar al carrito</Button>
          </CardActionArea>
        </Card>
      )}
    </div>
  );
};

export default ItemDetail;
