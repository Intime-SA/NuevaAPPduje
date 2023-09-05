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
import { clientesCollection } from "../../../firebaseConfig";
import axios from "axios";
import * as XLSX from "xlsx";

const ClientList = ({ clientes }) => {
  const exportToExcel = () => {
    const data = [
      ["Nombre", "Edad"],
      ["Juan", 30],
      ["María", 25],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MiHojaDeCalculo");
    XLSX.writeFile(wb, "mi_archivo_excel.xlsx");
  };

  const importarClientes = async () => {
    try {
      const response = await axios.get("../clientes.json");
      const dataClientes = response.data;

      for (const elemento of dataClientes) {
        // Agregar cada elemento como un documento en la colección
        addDoc(clientesCollection, elemento);
        console.log("Documento agregado exitosamente.");
      }

      console.log("Importación de datos completada.");
    } catch (error) {
      console.error("Error al importar datos:", error);
    }
  };

  return (
    <div>
      <Button
        style={{ margin: "1rem" }}
        onClick={() => importarClientes()}
        variant="contained"
      >
        Importar Clientes
      </Button>
      <Button onClick={exportToExcel}>Exportar excel</Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="left">Nombre</TableCell>
              <TableCell align="left">Direccion</TableCell>
              <TableCell align="left">Telefono</TableCell>
              <TableCell align="left">Categoria</TableCell>
              <TableCell align="left">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow
                key={cliente.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {cliente.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {cliente.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {cliente.direccion}
                </TableCell>
                <TableCell component="th" scope="row">
                  {cliente.telefono}
                </TableCell>

                <TableCell component="th" scope="row">
                  {cliente.zona}
                </TableCell>
                <TableCell component="th" scope="row">
                  <IconButton
                    onClick={() => {
                      handleOpen(cliente);
                    }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      deleteProduct(cliente.id);
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
    </div>
  );
};

export default ClientList;
