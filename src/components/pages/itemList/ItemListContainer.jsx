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
          <div
            key={product.id}
            style={{
              display: "flex",
              margin: "1rem",
              width: "90%",
              border: "1px grey solid",
              borderRadius: "5px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>
                <img src={product.img} alt="asd" style={{ width: "200px" }} />
                <h2 style={{ margin: "1rem" }}>{product.name}</h2>
              </div>
              <div>
                <Link to={`/itemDetail/${product.id}`}>
                  <span
                    style={{ margin: "1rem" }}
                    class="material-symbols-outlined"
                  >
                    search
                  </span>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ItemListContainer;
