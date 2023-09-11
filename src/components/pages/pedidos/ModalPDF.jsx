import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  View,
  Image,
  Text,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  table: {
    display: "flex",
    justifyContent: "center",
    margin: "10px",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    top: 0,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "start",
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  tableHeader: {
    fontWeight: "bold",
    fontSize: "15px",
  },
  tableCell: {
    paddingRight: "0px",
    textAlign: "right",
  },
  container: {
    display: "flex",
    paddingBottom: "250px",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  image: {
    width: "100px",
    margin: "15px",
    top: "0",
  },

  textColum1: {
    fontFamily: "Helvetica",
    fontSize: 20,
    color: "#89ca8f",
    margin: "10px",
    textAlign: "left",
  },

  textColum2: {
    fontFamily: "Helvetica",
    fontSize: 20,
    color: "#89ca8f",
    margin: "10px",
    textAlign: "left",
  },

  textColum3: {
    fontFamily: "Helvetica",
    fontSize: 25,
    color: "#89ca8f",
    margin: "10px",
    textAlign: "right",
  },

  textBlack: {
    color: "black",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: "10px",
    marginRight: "10px",
  },
  columnFlex2: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: "25px",
  },
  spaceAround: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: "10px",
  },
  endJustify: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  infoBlock: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginRight: 10,
  },
  infoText: {
    fontSize: 12,
    marginBottom: 5,
  },
});

const ModalPDF = ({ data }) => {
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Calculate the total price when data changes
    let totalPrice = 0;
    data.productos.forEach((producto) => {
      const price = producto.Cantidad * producto.Precio;
      totalPrice += price;
    });
    setTotalPrice(totalPrice);
  }, [data]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            paddingBottom: "250px",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            marginLeft: "2rem",
            padding: "2rem",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-around",
            }}
          >
            <View style={styles.infoBlock}>
              <Text style={styles.infoText}>CUIT: 30-71576888-3</Text>
              <Text style={styles.infoText}>
                Dirección: Av. Dr. Arturo Alió 3198, B7600 Mar del Plata,
                Provincia de Buenos Aires
              </Text>
              <Text style={styles.infoText}>Teléfono: 0223 680-0402</Text>
            </View>
            <Image src="public\an.jpg" alt="logiyo" style={styles.image} />
          </View>
          <View style={styles.header}>
            <View style={styles.columnFlex2}>
              <Text>Pedido ID:</Text>
              <Text style={styles.textColum1}>
                {data ? data.cliente : "no cargo la info"}
              </Text>
              <Text>Nombre Cliente</Text>
              <Text style={styles.textColum2}>
                {data ? data.cliente : "no cargo la info"}
              </Text>
            </View>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={{ ...styles.tableHeader, width: "200px" }}>
                Producto
              </Text>
              <Text
                style={{
                  ...styles.tableCell,
                  ...styles.tableHeader,
                  width: "70px",
                }}
              >
                Unidades
              </Text>
              <Text
                style={{
                  ...styles.tableCell,
                  ...styles.tableHeader,
                  width: "70px",
                }}
              >
                Precio
              </Text>
              <Text
                style={{
                  ...styles.tableCell,
                  ...styles.tableHeader,
                  width: "70px",
                }}
              >
                Dto %
              </Text>

              <Text
                style={{
                  ...styles.tableCell,
                  ...styles.tableHeader,
                  width: "100px",
                  textAlign: "right",
                }}
              >
                Totales
              </Text>
            </View>
            {data.productos.map((producto, index) => (
              <View key={producto.id} style={styles.tableRow}>
                <View style={{ ...styles.tableCell, width: "200px" }}>
                  <Text
                    style={{
                      color: "black",
                      textAlign: "left",
                      fontSize: "10px",
                    }}
                  >
                    {producto.Producto}
                  </Text>
                </View>

                <View
                  style={{
                    ...styles.tableCell,
                    width: "70px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      textAlign: "right",
                      fontSize: "10px",
                    }}
                  >
                    {producto.Cantidad}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.tableCell,
                    width: "70px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      textAlign: "right",
                      fontSize: "10px",
                    }}
                  >
                    {parseFloat(producto.Precio)
                      .toFixed(2)
                      .toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </Text>
                </View>
                <View
                  style={{
                    color: "black",
                    width: "70px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      textAlign: "right",
                      fontSize: "10px",
                    }}
                  >
                    {producto.Descuento}
                  </Text>
                </View>
                <View
                  style={{
                    color: "black",
                    width: "100px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Text style={styles.tableCell}>
                    {(
                      parseFloat(producto.Precio) *
                      parseFloat(producto.Cantidad) *
                      (1 - parseFloat(producto.Descuento) / 100)
                    )
                      .toFixed(2)
                      .toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              width: "90%",
              margin: "20px",
            }}
          >
            <View>
              <Text>Total Orden:</Text>
            </View>
            <View>
              <Text>
                {parseFloat(totalPrice).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ModalPDF;
