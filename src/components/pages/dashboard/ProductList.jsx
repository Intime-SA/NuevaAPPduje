import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, IconButton, Typography, Box, TextField } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { db } from "../../../firebaseConfig";
import { addDoc, deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import ProductForm from "./ProductForm";
import {
  productsCollection,
  clientesCollection,
} from "../../../firebaseConfig";
import axios from "axios";
import * as XLSX from "xlsx";

const ProductList = ({ products, setIsChange }) => {
  const [open, setOpen] = useState(false);
  const [productSelected, setProductSelected] = useState({});

  console.log(productsCollection);

  const importarDatos = async () => {
    try {
      const response = await axios.get("../products.json");
      const dataProductos = response.data;

      for (const elemento of dataProductos) {
        // Agregar cada elemento como un documento en la colección
        addDoc(productsCollection, elemento);
        console.log("Documento agregado exitosamente.");
      }

      console.log("Importación de datos completada.");
    } catch (error) {
      console.error("Error al importar datos:", error);
    }
  };

  const exportToExcel = () => {
    console.log(products);
    const data = products.map((producto) => {
      const unitPrice =
        typeof producto.unit_price === "number"
          ? producto.unit_price.toFixed(2)
          : producto.unit_price;
      const filaPedido = [
        producto.categoria,
        producto.id,
        producto.img,
        producto.marca,
        producto.medida,
        producto.name,
        producto.nuevo,
        producto.oferta,
        producto.peso,
        producto.precioBulto,
        producto.stock,
        producto.unidades,
        unitPrice,
      ];
      return filaPedido;
    });

    const header = [
      "Categoria",
      "ID",
      "URL Imagen",
      "Marca",
      "Medida",
      "Nombre",
      "Nuevo",
      "Oferta",
      "Peso",
      "precioBulto",
      "Stock",
      "Unidades",
      "Precio",
    ];
    // const productHeaders = pedidoLista.reduce((headers, pedido) => {
    //   const numProductos = pedido.productos.length;
    //   for (let i = 0; i < numProductos; i++) {
    //     if (header.length < numProductos) {
    //       headers.push(...[`Producto ${i + 1}`]);
    //       // Agrega otras propiedades del producto si es necesario
    //     }
    //   }
    //   return headers;
    // }, []);

    const wsData = [header, ...data];
    // wsData[0].push(...productHeaders); // Agrega los encabezados de productos al encabezado principal

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MiHojaDeCalculo");
    XLSX.writeFile(wb, "mi_archivo_excel.xlsx");
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

  const editProduct = (id) => {
    console.log(id);
  };

  const deleteProduct = (id) => {
    setIsChange(true);
    deleteDoc(doc(db, "productos", id));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (product) => {
    setProductSelected(product);
    setOpen(true);
  };

  return (
    <div>
      <div
        style={{
          width: "40vw",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Button
          style={{ margin: "1rem" }}
          onClick={() => handleOpen(null)}
          variant="contained"
        >
          Nuevo Producto
        </Button>
        <Button
          style={{ margin: "1rem" }}
          onClick={() => importarDatos()}
          variant="contained"
        >
          Importar Productos
        </Button>
        <Button
          style={{ margin: "1rem" }}
          onClick={() => exportToExcel()}
          variant="contained"
        >
          Exportar Productos
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="left">Titulo</TableCell>
              <TableCell align="left">Precio</TableCell>
              <TableCell align="left">Stock</TableCell>
              <TableCell align="left">Imagen</TableCell>
              <TableCell align="left">Categoria</TableCell>
              <TableCell align="left">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {product.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {product.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {product.unit_price}
                </TableCell>
                <TableCell component="th" scope="row">
                  {product.stock}
                </TableCell>

                <TableCell component="th" scope="row">
                  <img src={product.img} alt="imgProduct" width="100px" />
                </TableCell>
                <TableCell component="th" scope="row">
                  {product.marca}
                </TableCell>
                <TableCell component="th" scope="row">
                  <IconButton
                    onClick={() => {
                      handleOpen(product);
                    }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      deleteProduct(product.id);
                    }}
                  >
                    <DeleteForeverIcon color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ProductForm
            handleClose={handleClose}
            setIsChange={setIsChange}
            productSelected={productSelected}
            setProductSelected={setProductSelected}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default ProductList;
