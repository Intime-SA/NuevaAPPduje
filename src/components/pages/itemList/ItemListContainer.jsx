import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import { Link } from "react-router-dom";

function ItemListContainer() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let refCollection = collection(db, "products");
    getDocs(refCollection)
      .then((res) => {
        let newArray = res.docs.map((product) => {
          return { ...product.data(), id: product.id };
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
          <div key={product.id} style={{ width: "500px" }}>
            <img src={product.image} alt="asd" />
            <h1>{product.title}</h1>
            <Link to={`/itemDetail/${product.id}`}>Ver Detalle</Link>
          </div>
        );
      })}
    </div>
  );
}

export default ItemListContainer;
