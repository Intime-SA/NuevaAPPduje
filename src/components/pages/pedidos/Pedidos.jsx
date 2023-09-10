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
import * as XLSX from "xlsx";

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
  const [render, setRender] = useState(false);

  const [pedidoLista, setPedidoLista] = useState([]);
  const exportToExcel = () => {
    const data = pedidoLista.map((pedido) => {
      const productos = pedido.productos.map(
        (producto) =>
          `${producto.Producto} / ${producto.Cantidad} / $${producto.Precio}`
      );
      const filaPedido = [
        pedido.cliente,
        pedido.estado,
        pedido.fecha,
        pedido.vendedor,
        ...productos,
      ];
      return filaPedido;
    });

    const header = ["Cliente", "Estado", "Fecha", "Vendedor"];
    const productHeaders = pedidoLista.reduce((headers, pedido) => {
      const numProductos = pedido.productos.length;
      for (let i = 0; i < numProductos; i++) {
        if (header.length < numProductos) {
          headers.push(...[`Producto ${i + 1}`]);
          // Agrega otras propiedades del producto si es necesario
        }
      }
      return headers;
    }, []);

    const wsData = [header, ...data];
    wsData[0].push(...productHeaders); // Agrega los encabezados de productos al encabezado principal

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MiHojaDeCalculo");
    XLSX.writeFile(wb, "mi_archivo_excel.xlsx");
  };

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
    setRender(null);
  }, [render]);

  console.log(pedidoLista);

  const recibirCambioDesdeHijo = (nuevoEstado) => {
    setRender(!nuevoEstado);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row-reverse",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row-reverse",
          }}
        >
          <Button onClick={() => handleOpen()}>
            {" "}
            <p style={{ fontSize: "70%" }}> Crear Pedido</p>
          </Button>
          <Button onClick={() => handleOpen2(!open2)}>
            {" "}
            <p style={{ fontSize: "70%" }}> Ver Pedidos</p>
          </Button>
        </div>
        <div>
          <Button size="small" variant="contained" onClick={exportToExcel}>
            <p style={{ fontSize: "70%" }}>Exportar excel</p>
            <span class="material-symbols-outlined">download</span>
          </Button>
        </div>
      </div>

      <div>
        {open2 && (
          <ListadoPedidos
            render={render}
            handleOpen2={handleOpen2}
            setOpenForm={setOpen}
            enviarCambioAlPadre={recibirCambioDesdeHijo}
            pedidoLista={pedidoLista}
            setOpen2={setOpen2}
            open2={open2}
          />
        )}
        <Modal
          open2={open2}
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
