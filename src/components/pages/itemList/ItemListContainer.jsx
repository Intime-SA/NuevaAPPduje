import React, { useEffect, useRef, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  Backdrop,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
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
  const [estado, setEstado] = useState(false);
  const [scroll, setScroll] = useState(
    JSON.parse(localStorage.getItem("scrollPosition"))
  );

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      setEstado(true);
    }

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

  const unitarioFormateado = (precio) => {
    let precioForm = precio.toFixed(2);
    return precioForm;
  };

  const obtenerPosicion = () => {
    let scrollPosition = window.scrollY;
    console.log(scrollPosition);
    localStorage.setItem("scrollPosition", scrollPosition);
    setScroll(localStorage.getItem("scrollPosition")); // Actualizar el estado después de guardar en localStorage
  };

  const redirigir = async (scrollDelay) => {
    // Espera el tiempo de demora antes de realizar el desplazamiento
    await new Promise((resolve) => setTimeout(resolve, scrollDelay));

    // Realiza el desplazamiento suave
    window.scrollBy({
      top: scroll,
      left: 0,
      behavior: "smooth",
    });
  };
  redirigir();

  const fileInputRef = useRef(null);

  const handleClick = () => {
    // Simula un clic en el input de archivo cuando se hace clic en el botón
    fileInputRef.current.click();
  };

  const handleClose2 = () => {
    setEstado(false);
  };

  useEffect(() => {
    // Configura un temporizador para cerrar el Backdrop después de 20 segundos
    const timer = setTimeout(() => {
      handleClose2();
    }, 20000);

    // Limpia el temporizador cuando el componente se desmonta
    return () => clearTimeout(timer);
  }, []);

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
          <img
            src="https://firebasestorage.googleapis.com/v0/b/workshop-duje.appspot.com/o/contagram.png?alt=media&token=b9cd4443-1886-4cf1-81d1-c0cf8c76c4e1"
            alt="Contagram"
          />
          <h3 style={{ margin: "1rem" }}>
            Seleccione el archivo exportado desde Contagram
          </h3>

          <Button
            style={{ margin: "1rem", backgroundColor: "blue", color: "white" }}
            variant="contained"
            onClick={handleClick}
          >
            Subir archivo
          </Button>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={estado}
            onClose={handleClose2}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <input
            type="file"
            accept=".xlsx"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
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
                <Link
                  onClick={obtenerPosicion}
                  to={`/itemDetail/${product.id}`}
                >
                  <Card sx={{ flexWrap: "nowrap", width: 320, margin: 2 }}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="300px"
                        image={product.img}
                        alt="green iguana"
                        style={{ maxWidth: "100%" }} // Limita el tamaño de la imagen
                      />
                      <CardContent>
                        <Typography
                          fontSize={"100%"}
                          gutterBottom
                          variant="h6"
                          component="div"
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Precio Unitario:
                          <h4>
                            ARS{" "}
                            {product.unit_price.toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS",
                            })}
                          </h4>
                        </Typography>
                        <br />
                        <Typography variant="body2" color="text.secondary">
                          Unidades en Stock: <br />
                          <h4>{product.stock}</h4>
                        </Typography>
                      </CardContent>
                      <div
                        style={{
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
                    </CardActionArea>
                  </Card>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ItemListContainer;
