import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
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
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as XLSX from "xlsx";

function ItemListContainer() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return; // Salir si no se seleccionó un archivo
    }

    try {
      const excelData = await parseExcelFile(file);
      await updateFirebaseProducts(excelData);
      reloadUpdatedProducts();
    } catch (error) {
      console.error("Error al procesar el archivo Excel", error);
    }
  };

  const parseExcelFile = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        resolve(excelData);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const updateFirebaseProducts = async (excelData) => {
    const productsRef = collection(db, "productos");

    for (const rowData of excelData.slice(1)) {
      // Ignora la primera fila (encabezados)
      const productId = rowData[1]; // Supongamos que la primera columna es el ID del producto
      const unitPrice = rowData[12];
      const stock = rowData[10]; // Obtén el valor de unit_price desde el archivo Excel

      // Verifica que unitPrice tenga un valor definido
      if (typeof unitPrice !== "undefined") {
        const updatedData = {
          unit_price: unitPrice,
          stock: stock, // Asegúrate de que el campo tenga el nombre correcto
          // Otros campos...
        };

        const productDocRef = doc(productsRef, productId);

        try {
          await updateDoc(productDocRef, updatedData);
        } catch (error) {
          console.error("Error al actualizar el producto", error);
        }
      }
    }
  };

  const reloadUpdatedProducts = async () => {
    const productsRef = collection(db, "productos");
    const querySnapshot = await getDocs(productsRef);
    const updatedProducts = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setProducts(updatedProducts);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

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
      {" "}
      <Button onClick={handleOpen}>Actualizar Productos</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 style={{ margin: "1rem" }}>CARGAR ARCHIVO FORMATO CONTAGRAM</h2>
          <input type="file" accept=".xlsx" onChange={handleFileUpload} />
          <Button
            style={{ margin: "1rem" }}
            variant="contained"
            onClick={handleClose}
          >
            Cerrar
          </Button>
        </Box>
      </Modal>
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
                <Button></Button>
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
                        Precio Unitario: <h4>${product.unit_price}</h4>
                      </Typography>
                      <br />
                      <Typography variant="body2" color="text.secondary">
                        Unidades en Stock: <br />
                        <h4>{product.stock}</h4>
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
