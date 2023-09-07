import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Button,
  IconButton,
  Typography,
  Box,
  TextField,
  Alert,
  AlertTitle,
  ToggleButton,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { db } from "../../../firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const ListadoPedidos = ({ pedidoLista, enviarCambioAlPadre }) => {
  const [estadoId, setEstadoId] = useState();
  const [datosClientes, setDatosClientes] = useState([]);
  const [client, setClient] = useState();
  const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos

  useEffect(() => {
    const fetchData = async () => {
      const pedidosDocumentRef = doc(db, "pedidos", estadoId);
      const docSnapshot = await getDoc(pedidosDocumentRef);
      if (docSnapshot.exists()) {
        // Ahora puedes acceder a los datos del documento
        const data = docSnapshot.data().estado;
        console.log("El estado es:", data);

        // Si deseas actualizar el estado del documento, puedes hacerlo aquí
        // Por ejemplo, actualiza el estado a "entregado"

        if (data === "pendiente") {
          await updateDoc(pedidosDocumentRef, { estado: "entregado" });
        } else {
          await updateDoc(pedidosDocumentRef, { estado: "pendiente" });
        }

        enviarCambioAlPadre(true);
      } else {
        console.log("El documento no existe.");
      }
    };
    setEstadoId(null);
    fetchData();
  }, [estadoId]);

  const botonActivo = (id) => {
    setEstadoId(id);
  };

  const borrarPedido = async (id) => {
    try {
      const pedidosDocumentRef = doc(db, "pedidos", id);
      const docSnapshot = await getDoc(pedidosDocumentRef);

      if (docSnapshot.exists()) {
        await deleteDoc(pedidosDocumentRef);
        console.log("Documento eliminado correctamente.");
        enviarCambioAlPadre(true);
        // No es necesario recargar la página aquí si no es requerido
      } else {
        console.log("El documento no existe.");
      }
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
    }
  };

  const estadoRender = (estado) => {
    if (estado === "pendiente") {
      return (
        <Alert severity="info">
          <AlertTitle>Pendiente</AlertTitle>
          {/* <strong>El pedido ya fue preparado</strong> */}
        </Alert>
      );
    } else if (estado === "entregado") {
      return (
        <Alert severity="success">
          <AlertTitle>Entregado</AlertTitle>
          {/* <strong>El pedido fue entregado con exito</strong> */}
        </Alert>
      );
    }
  };

  const obtenerDatosCliente = (nombre) => {
    datosClientes.map((cliente) => {
      if (cliente.name === nombre) {
        console.log(nombre);
        return nombre;
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesCollection = collection(db, "clientes");
        const querySnapshot = await getDocs(clientesCollection);
        const newArray = querySnapshot.docs.map((cliente) => cliente.data());
        setDatosClientes(newArray);
        setLoading(false); // Indicar que la carga de datos ha finalizado
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setLoading(false); // Indicar que la carga de datos ha finalizado
      }
    };
    fetchData();
    obtenerDatosCliente(datosClientes.name);
  }, []);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div>
      {" "}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Cliente</TableCell>
              <TableCell align="left">Acciones</TableCell>
              <TableCell align="left">Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidoLista.map((pedido) => (
              <TableRow
                key={pedido.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {datosClientes.map((cliente) => {
                    if (cliente.name === pedido.cliente[0]) {
                      return (
                        <>
                          <h4>{pedido.cliente}</h4>
                          <p>{cliente.direccion}</p>
                          <p>{cliente.telefono}</p>
                          <h6 style={{ fontWeight: "900" }}>{cliente.zona}</h6>
                        </>
                      );
                    }
                  })}
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
                      borrarPedido(pedido.id);
                    }}
                  >
                    <DeleteForeverIcon color="primary" />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      borrarPedido(pedido.id);
                    }}
                  >
                    <span class="material-symbols-outlined">search</span>
                  </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      alignItems: "space-around",
                    }}
                  >
                    <div>{estadoRender(pedido.estado)}</div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        marginTop: "1rem",
                      }}
                    >
                      <ToggleButton
                        value="check"
                        onClick={() => botonActivo(pedido.id)}
                      >
                        <span class="material-symbols-outlined">
                          arrow_back
                        </span>
                      </ToggleButton>
                      <ToggleButton
                        value="check"
                        onClick={() => botonActivo(pedido.id)}
                      >
                        <CheckIcon />
                      </ToggleButton>
                      <ToggleButton
                        value="check"
                        onClick={() => botonActivo(pedido.id)}
                      >
                        <span class="material-symbols-outlined">
                          arrow_forward
                        </span>
                      </ToggleButton>
                    </div>
                  </div>
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
