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
  Modal,
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
import FormPedidos from "./FormPedidos";
import PedidoDetalle from "./PedidoDetalle";

const ListadoPedidos = ({
  pedidoLista,
  enviarCambioAlPadre,
  setOpen,
  handleOpen2,
  render,
}) => {
  const [estadoId, setEstadoId] = useState();
  const [estadoId2, setEstadoId2] = useState();
  const [datosClientes, setDatosClientes] = useState([]);
  const [telefonoCliente, setTelefonoCliente] = useState();
  const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos
  const [edit, setEdit] = useState([]);
  const [open2, setOpen2] = useState(false);
  const [atras, setAtras] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [dataPedido, setDataPedido] = useState([]);
  const [dataId, setDataId] = useState(null);

  useEffect(() => {
    const fetchData = async (id, render) => {
      const pedidosDocumentRef = doc(db, "pedidos", id);
      const docSnapshot = await getDoc(pedidosDocumentRef);
      if (docSnapshot.exists()) {
        // Ahora puedes acceder a los datos del documento
        const data = docSnapshot.data().estado;
        console.log("El estado es:", data);

        // Si deseas actualizar el estado del documento, puedes hacerlo aquí
        // Por ejemplo, actualiza el estado a "entregado"

        if (atras) {
          if (data === "entregado") {
            await updateDoc(pedidosDocumentRef, { estado: "enDistribucion" });
          } else if (data === "enDistribucion") {
            await updateDoc(pedidosDocumentRef, { estado: "pendiente" });
          } else if (data === "pendiente") {
            await updateDoc(pedidosDocumentRef, { estado: "nuevo" });
          }
        } else {
          if (data === "pendiente") {
            await updateDoc(pedidosDocumentRef, { estado: "enDistribucion" });
          } else if (data === "nuevo") {
            await updateDoc(pedidosDocumentRef, { estado: "pendiente" });
          } else if (data === "enDistribucion") {
            await updateDoc(pedidosDocumentRef, { estado: "entregado" });
          }
        }
        enviarCambioAlPadre(render);
      }
    };
    fetchData(estadoId2);
    fetchData(estadoId);
    setAtras(false);
    setEstadoId(null);
    setEstadoId2(null);
  }, [estadoId, estadoId2]);

  const botonActivo = (id) => {
    setEstadoId(id);
  };

  const botonNoActivo = (id) => {
    setAtras(true);
    setEstadoId2(id);
  };

  const botonCancelado = async (id) => {
    try {
      const pedidosDocumentRef = doc(db, "pedidos", id);
      const docSnapshot = await getDoc(pedidosDocumentRef);

      if (docSnapshot.exists()) {
        await updateDoc(pedidosDocumentRef, { estado: "cancelado" });
        enviarCambioAlPadre(true);
        // No es necesario recargar la página aquí si no es requerido
      } else {
        console.log("El documento no existe.");
      }
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
    }

    enviarCambioAlPadre(false);
  };

  const obtenerDetalle = async (id) => {
    const pedidosDocumentRef = doc(db, "pedidos", id);
    const docSnapshot = await getDoc(pedidosDocumentRef);
    setDataId(id);
    setDataPedido(docSnapshot.data());
    setOpenModal(true);
    console.log(docSnapshot.data());
  };

  const borrarPedido = async (id) => {
    try {
      const pedidosDocumentRef = doc(db, "pedidos", id);
      const docSnapshot = await getDoc(pedidosDocumentRef);

      if (docSnapshot.exists()) {
        if (
          docSnapshot.data().estado === "nuevo" ||
          docSnapshot.data().estado === "pendiente"
        ) {
          await deleteDoc(pedidosDocumentRef);
          console.log("Documento eliminado correctamente.");
          enviarCambioAlPadre(true);
        } else {
          alert("Lo siento. Solamente se pueden borrar los pedidos nuevos");
        }
        // No es necesario recargar la página aquí si no es requerido
      } else {
        console.log("El documento no existe.");
      }
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
    }
    enviarCambioAlPadre(false);
  };

  const estadoRender = (estado) => {
    if (estado === "pendiente") {
      return (
        <Alert severity="info">
          <AlertTitle style={{ marginTop: "10%", fontSize: "75%" }}>
            Pendiente
          </AlertTitle>
          {/* <strong>El pedido ya fue preparado</strong> */}
        </Alert>
      );
    } else if (estado === "nuevo") {
      return (
        <Alert
          style={{ marginTop: "10%", fontSize: "75%" }}
          size="small"
          variant="filled"
          severity="info"
        >
          Nuevo
        </Alert>
      );
    } else if (estado === "entregado") {
      return (
        <Alert severity="success">
          <AlertTitle style={{ marginTop: "10%", fontSize: "75%" }}>
            Entregado
          </AlertTitle>
          {/* <strong>El pedido fue entregado con exito</strong> */}
        </Alert>
      );
    } else if (estado === "enDistribucion") {
      return (
        <Alert severity="success">
          <AlertTitle style={{ marginTop: "10%", fontSize: "75%" }}>
            En Distribucion
          </AlertTitle>
          {/* <strong>El pedido fue entregado con exito</strong> */}
        </Alert>
      );
    } else if (estado === "completado") {
      return (
        <Alert variant="filled" severity="success">
          Completado
        </Alert>
      );
    } else if (estado === "cancelado") {
      return (
        <Alert variant="filled" severity="error">
          Cancelado
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

  const handleOpen = async (id) => {
    try {
      const pedidosDocumentRef = doc(db, "pedidos", id);
      const docSnapshot = await getDoc(pedidosDocumentRef);

      if (docSnapshot.exists()) {
        console.log(docSnapshot.data());
        setEdit(docSnapshot.data());
        handleOpen2(!open2);
        setOpen(true);
        setOpen2(true);
      } else {
        console.log("El documento no existe.");
      }
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
    }
  };

  const botonCompletado = async (id) => {
    try {
      const pedidosDocumentRef = doc(db, "pedidos", id);
      const docSnapshot = await getDoc(pedidosDocumentRef);

      if (docSnapshot.exists()) {
        if (docSnapshot.data().estado === "cancelado") {
          alert("No se puede Completar un pedido Cancelado");

          // No es necesario recargar la página aquí si no es requerido
        } else {
          await updateDoc(pedidosDocumentRef, { estado: "completado" });
          console.log("completado");
          enviarCambioAlPadre(true);
        }
      } else {
        console.log("El documento no existe.");
      }
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
    }
    enviarCambioAlPadre(false);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100vw",
    height: "100vh",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const listaInversa = [...pedidoLista].reverse();

  async function envioMensaje(id, cliente) {
    try {
      const pedidosDocumentRef = doc(db, "pedidos", id);
      const docSnapshot = await getDoc(pedidosDocumentRef);
      const nombre = docSnapshot.data().cliente;
      console.log(nombre);

      const clientes = collection(db, "clientes");
      const res = await getDocs(clientes);

      let telefonoCliente = ""; // Declarar la variable antes de usarla

      res.docs.forEach((elemento) => {
        if (elemento.data().name === cliente) {
          telefonoCliente = elemento.data().telefono; // Asignar el valor a la variable
          console.log(telefonoCliente);
          return;
        } else console.log("error");
      });

      envioMensajeFinal(id, telefonoCliente);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const envioMensajeFinal = (id, telefonoCliente) => {
    try {
      const phoneNumber = telefonoCliente;
      const message = `Te paso el detalle del pedido ID: ${id}`;

      const encodedMessage = encodeURIComponent(message);
      const linkWsp = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
      console.log(linkWsp);
      window.location.href = linkWsp;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {" "}
      {open2 && (
        <FormPedidos
          enviarCambioAlPadre={enviarCambioAlPadre}
          render={render}
          edit={edit}
        />
      )}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <PedidoDetalle
            handleCloseModal={handleCloseModal}
            dataPedido={dataPedido}
            dataId={dataId}
          />
        </Box>
      </Modal>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Listado Pedidos</TableCell>
              {/* <TableCell align="left">Acciones</TableCell>
              <TableCell align="left">Estado</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidoLista.reverse().map((pedido, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {datosClientes.map((cliente) => {
                    if (cliente.name === pedido.cliente[0]) {
                      return (
                        <>
                          <div>
                            <div>
                              <div
                                style={{
                                  marginTop: "1rem",
                                  marginBottom: "1rem",
                                }}
                              >
                                {estadoRender(pedido.estado)}
                              </div>
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <IconButton
                                    onClick={() => {
                                      handleOpen(pedido.id);
                                    }}
                                  >
                                    <EditIcon color="primary" />
                                  </IconButton>
                                  <IconButton
                                    color="primary"
                                    onClick={() => {
                                      obtenerDetalle(pedido.id);
                                    }}
                                  >
                                    <span class="material-symbols-outlined">
                                      search
                                    </span>
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      borrarPedido(pedido.id);
                                    }}
                                  >
                                    <DeleteForeverIcon color="primary" />
                                  </IconButton>
                                </div>
                                <div>
                                  <h6 style={{ fontWeight: "700" }}>{index}</h6>
                                  <h4>{pedido.cliente}</h4>
                                  <p>{cliente.direccion}</p>
                                  <p>{cliente.telefono}</p>
                                  <h6 style={{ fontWeight: "700" }}>
                                    {pedido.fecha}
                                  </h6>
                                  <h6 style={{ fontWeight: "900" }}>
                                    {cliente.zona}
                                  </h6>
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                width: "90vw",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div>
                                <Button
                                  onClick={() =>
                                    envioMensaje(pedido.id, pedido.cliente[0])
                                  }
                                >
                                  <img
                                    src="https://firebasestorage.googleapis.com/v0/b/workshop-duje.appspot.com/o/whatsapp.png?alt=media&token=424dba56-2436-4cf3-a244-5a48c2510b57"
                                    alt="asd"
                                    width={"20px"}
                                  />
                                </Button>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  marginRight: "10%",
                                }}
                              >
                                <ToggleButton
                                  value="check"
                                  onClick={() => botonNoActivo(pedido.id)}
                                >
                                  <span class="material-symbols-outlined">
                                    arrow_back
                                  </span>
                                </ToggleButton>
                                <ToggleButton
                                  value="check"
                                  onClick={() => botonCompletado(pedido.id)}
                                >
                                  <CheckIcon />
                                </ToggleButton>
                                <ToggleButton
                                  value="check"
                                  onClick={() => botonCancelado(pedido.id)}
                                >
                                  <span class="material-symbols-outlined">
                                    close
                                  </span>
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
                          </div>
                        </>
                      );
                    }
                  })}
                </TableCell>
                <TableCell component="th" scope="row"></TableCell>
                <TableCell component="th" scope="row"></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListadoPedidos;
