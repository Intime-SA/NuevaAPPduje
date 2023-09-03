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
import { productsCollection } from "../../../firebaseConfig";
import axios from "axios";

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
      <Button onClick={() => handleOpen(null)} variant="contained">
        Agregar Nuevo Producto
      </Button>
      <Button onClick={() => importarDatos()} variant="contained">
        Importar Productos
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="right">Titulo</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="right">Imagen</TableCell>
              <TableCell align="right">Categoria</TableCell>
              <TableCell align="right">Acciones</TableCell>
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
