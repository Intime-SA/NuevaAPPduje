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

const VendedoresList = ({ vendedores }) => {
  return (
    <div>
      <h2>Vendedores</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="left">Nombre</TableCell>
              <TableCell align="left">Direccion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendedores.map((vendedor) => (
              <TableRow
                key={vendedor.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {vendedor.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {vendedor.nombre}
                </TableCell>
                <TableCell component="th" scope="row">
                  <IconButton
                    onClick={() => {
                      handleOpen(vendedor.id);
                    }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      deleteProduct(vendedor.id);
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

export default VendedoresList;
