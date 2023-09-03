import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import { Link } from "react-router-dom";
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

function ItemListContainer() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let refCollection = collection(db, "productos");
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontSize: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "100vw",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {products.map((product) => {
            return (
              <div>
                <Card sx={{ flexWrap: "nowrap", width: 250, margin: 5 }}>
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
                      <Typography variant="body2" color="text.secondary">
                        ${product.unit_price}
                      </Typography>
                    </CardContent>
                    <div
                      style={{
                        padding: "20px",
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      {/* <Button variant="contained" onClick={addOne}>
                +
              </Button>
              <Button>{counter}</Button>
              <Button variant="contained" onClick={subOne}>
                -
              </Button> */}
                    </div>
                    {/* <Button onClick={add}>Agregar al carrito</Button> */}
                    <Link to={`/itemDetail/${product.id}`}>Ver Detalle</Link>
                  </CardActionArea>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ItemListContainer;

// import React, { useEffect, useState } from "react";
// import { db } from "../../../firebaseConfig";
// import { getDocs, collection } from "firebase/firestore";
// import { Link } from "react-router-dom";
// import axios from "axios";

// function ItemListContainer() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/productos")
//       .then((res) => {
//         let newArray = res.data.map((product) => {
//           return { ...product, id: product.id };
//         });
//         setProducts(newArray);
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   console.log(products);

//   return (
//     <div>
//       {products.map((product) => {
//         return (
//           <div
//             key={product.id}
//             style={{
//               display: "flex",
//               margin: "1rem",
//               width: "90%",
//               border: "1px grey solid",
//               borderRadius: "5px",
//             }}
//           >
//             <div style={{ display: "flex", flexDirection: "column" }}>
//               <div>
//                 <img src={product.img} alt="asd" style={{ width: "200px" }} />
//                 <h2 style={{ margin: "1rem" }}>{product.name}</h2>
//               </div>
//               <div>
//                 <Link to={`/itemDetail/${product.id}`}>
//                   <span
//                     style={{ margin: "1rem" }}
//                     class="material-symbols-outlined"
//                   >
//                     search
//                   </span>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default ItemListContainer;
