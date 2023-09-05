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

const ListadoPedidos = ({ pedidoLista }) => {
  return (
    <div>
      {" "}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="left">Cliente</TableCell>
              <TableCell align="left">Vendedor</TableCell>
              <TableCell align="left">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidoLista.map((pedido) => (
              <TableRow
                key={pedido.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {pedido.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {pedido.cliente}
                </TableCell>
                <TableCell component="th" scope="row">
                  {pedido.vendedor}
                </TableCell>
                <TableCell component="th" scope="row">
                  <IconButton
                    onClick={() => {
                      handleOpen(pedido);
                    }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      deleteProduct(pedido.id);
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

export default ListadoPedidos;
