import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import { Link } from "react-router-dom";
import axios from "axios";

function ItemListContainer() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/productos")
      .then((res) => {
        let newArray = res.data.map((product) => {
          return { ...product, id: product.id };
        });
        setProducts(newArray);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(products);

  return (
    <div>
      {products.map((product) => {
        return (
          <div key={product.id} style={{ width: "90%" }}>
            <img src={product.img} alt="asd" style={{ width: "200px" }} />
            <h1>{product.name}</h1>
            <Link to={`/itemDetail/${product.id}`}>Ver Detalle</Link>
          </div>
        );
      })}
    </div>
  );
}

export default ItemListContainer;
