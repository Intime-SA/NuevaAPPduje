import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import { getDoc, collection, doc } from "firebase/firestore";
import { Button } from "@mui/material";
import { count } from "console";
import { CartContext } from "../../../context/CartContext";

const ItemDetail = () => {
  const { id } = useParams();
  const { addToCart, getQuantityById } = useContext(CartContext);
  let quantity = getQuantityById(id);
  const [product, setProduct] = useState(null);
  const [counter, setCounter] = useState(quantity || 1);

  useEffect(() => {
    let refCollection = collection(db, "products");
    let refDoc = doc(refCollection, id);
    getDoc(refDoc)
      .then((res) => setProduct({ ...res.data(), id: res.id }))
      .catch((err) => console.log(err));
  }, [id]);

  // SUMAR

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
    <div>
      <h1>Entre al detalle</h1>
      {product && (
        <div
          style={{
            border: "solid black 1px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1>{product.title}</h1>
          <Button variant="contained" onClick={addOne}>
            +
          </Button>
          <Button>{counter}</Button>
          <Button variant="contained" onClick={subOne}>
            -
          </Button>
          <Button onClick={add}>Agregar al carrito</Button>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
