import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";

const PedidoDetalle = ({ dataPedido, handleCloseModal, dataId }) => {
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Calculate the total price when data changes
    let totalPrice = 0;

    dataPedido.productos.forEach((producto) => {
      const price = producto.Precio * producto.Cantidad;
      totalPrice += price;
    });
    setTotalPrice(totalPrice);
  }, [dataPedido]);

  //   const idPedido = "pedidoID:" + data.id + ".pdf";

  //   async function envioMensaje(id) {

  //     let linkWsp = ``;
  //     let phoneNumber;

  //     await axios.get(`http://localhost:5000/clientes/${id}`).then((res) => {
  //       phoneNumber = res.data.telefono;
  //       console.log(res.data.telefono);
  //     });

  //     const message = `Te paso el detalle del pedido ID: ${id}`; // Mensaje a enviar
  //     linkWsp = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
  //       message
  //     )}`;
  //     console.log(linkWsp);

  //     return (window.location.href = linkWsp);
  //   }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "80vw" }}>
          {/* <PDFViewer>{abrir && <ModalPDF data={data} />}</PDFViewer> */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
            }}
          >
            <Link to="/shop">
              <img
                src="https://media.licdn.com/dms/image/D4D0BAQEvYBgs5V2lhQ/company-logo_200_200/0/1682360728459?e=1697673600&v=beta&t=Im6s7_Cy12RU4pKxagWyRxKi8NEG9AELc4eBDNBWCQY"
                alt="logiyo"
                style={{ width: "100px" }}
              />
            </Link>

            <div
              style={{
                display: "flex",
                alignItems: "end",
                flexDirection: "column",
              }}
            >
              <p style={{ fontSize: "50%" }}>CUIT: 30-71576888-3</p>
              <p style={{ fontSize: "50%", textAlign: "right" }}>
                Dirección: Av. Dr. Arturo Alió 3198, B7600 Mar del Plata,
                Provincia de Buenos Aires
              </p>
              <p style={{ fontSize: "50%" }}>Teléfono: 0223 680-0402</p>
              {/* <PDFDownloadLink
            style={{ marginTop: "10px" }}
            document={<ModalPDF data={data} />}
            fileName={idPedido}
          >
            {({ blob, url, loading, error }) => (
              <Button variant="contained">
                {loading ? "Generando PDF..." : "Descargar PDF"}
              </Button>
            )}
          </PDFDownloadLink> */}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "end",
              flexDirection: "column",
            }}
          >
            Pedido ID:{dataId}
            <h3>{dataPedido ? dataPedido.id : "no cargo la info"}</h3>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ color: "black" }}>
              {dataPedido ? dataPedido.cliente : "no cargo la info"}
            </h3>
            <h3 style={{ color: "black" }}>
              {dataPedido ? dataPedido.fecha : "no cargo la info"}
            </h3>
          </div>
          <TableContainer
            component={Paper}
            style={{ maxHeight: 400, overflowY: "auto" }}
          >
            <Table style={{ width: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell width="90%">Producto</TableCell>
                  <TableCell width="10%">Totales</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataPedido.productos.map((producto, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <p style={{ color: "black" }}>{producto.Producto}</p>
                      <h6 style={{ color: "black" }}>
                        ${parseFloat(producto.Precio).toFixed(2)}
                      </h6>
                      <h6 style={{ color: "black" }}>{producto.Cantidad}</h6>
                    </TableCell>
                    <TableCell>
                      <h6 style={{ color: "black" }}>
                        ${" "}
                        {parseFloat(
                          producto.Cantidad * parseFloat(producto.Precio)
                        ).toFixed(2)}
                      </h6>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ color: "black" }}>Total Orden: </h3>
            <h3 style={{ color: "black" }}>
              {totalPrice.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true, // Esto agrega separadores de miles (ejemplo: 1.234.567,89)
              })}
            </h3>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div>
          <Button size="small" variant="contained" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </div>

        <Button
          style={{
            background: "none",
            border: "0px",
            marginTop: "6px",
            cursor: "pointer",
          }}
          // onClick={() => envioMensaje(idCliente)}
        >
          <img
            style={{ width: "70px" }}
            src="https://live.mrf.io/statics/i/ps/www.muycomputer.com/wp-content/uploads/2012/10/whatsapp.jpg?width=1200&enable=upscale"
            alt="wsp"
            id="wsp"
          />
        </Button>
      </div>
    </div>
  );
};

export default PedidoDetalle;
