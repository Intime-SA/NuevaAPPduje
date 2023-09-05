import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import FormPedidos from "./FormPedidos";
import ListadoPedidos from "./ListadoPedidos";
import { db } from "../../../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";

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

const Pedidos = () => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpen2 = () => setOpen2(true);
  const handleClose = () => setOpen(false);

  const [pedidoLista, setPedidoLista] = useState([]);

  useEffect(() => {
    const productsCollection = collection(db, "pedidos");
    getDocs(productsCollection)
      .then((res) => {
        const pedidos = []; // Inicializa un arreglo para los nuevos vendedores
        res.docs.forEach((elemento) => {
          pedidos.push({ ...elemento.data(), id: elemento.id });
        });
        setPedidoLista(pedidos); // Actualiza el estado una vez con todos los vendedores
      })
      .catch((error) => {
        console.error("Error al obtener vendedores:", error);
      });
  }, []);

  console.log(pedidoLista);

  return (
    <div>
      <Button onClick={() => handleOpen()}>Crear Pedido</Button>
      <Button onClick={() => handleOpen2(!open2)}>Ver Pedidos</Button>

      <div>
        {open2 && <ListadoPedidos pedidoLista={pedidoLista} />}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <FormPedidos setOpen={setOpen} />
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Pedidos;
