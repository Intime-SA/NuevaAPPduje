import React, { useState, useEffect } from "react";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Autocomplete, Button, CssBaseline, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { db } from "../../../firebaseConfig";
import { addDoc, deleteDoc, doc } from "firebase/firestore";
import { DataGrid } from "@mui/x-data-grid";
import { Grid } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";

const FormPedidos = ({ setOpen }) => {
  const [selectedOption, setSelectedOption] = useState();
  const [selectedOption2, setSelectedOption2] = useState();
  const [dataClientes, setDataClientes] = useState([]);
  const [dataProductos, setDataProductos] = useState([]);
  const [options, setOptions] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [selectedOption3, setSelectedOption3] = useState();
  const [selectedOptionsArray, setSelectedOptionsArray] = useState([]);
  const [cantidad, setCantidad] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [newItem, setNewItem] = useState();
  const [producto, setProducto] = useState();

  const [pedido, setPedido] = useState();

  const cerrarListadoPedidos = () => {
    setOpen(false);
  };

  const opciones = dataProductos.map((producto) => ({
    id: producto.id,
    name: producto.name,
    unit_price: producto.unit_price,
    stock: producto.stock,
    marca: producto.marca,
    peso: producto.peso,
    medida: producto.medida,
  }));

  const theme = createTheme({
    components: {
      MuiAutocomplete: {
        styleOverrides: {
          option: {
            fontFamily: "Arial, sans-serif", // Cambia la fuente de las opciones
            // Otras propiedades de estilo que quieras ajustar
          },
        },
      },
    },
  });

  // Función que se pasará como prop al componente hijo
  const onSubmit = (data) => {
    // Formatear la fecha en el formato "yyyy-MM-dd"
    const fechaIsoObj = new Date(data.fecha);
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const fechaSimpleStr = fechaIsoObj.toLocaleDateString(options);

    let obj = {
      cliente: selectedOption,
      fecha: fechaSimpleStr,
      productos: selectedOptionsArray,
      vendedor: "Ramiro",
    };
    console.log(obj);
    const productsCollection = collection(db, "pedidos");
    addDoc(productsCollection, obj)
      // .then(() => {
      //   setIsChange(true);
      //   handleClose();
      // })
      .then((res) => {
        console.log(res.data);
        // botonCerrarPedido();
        // setAbrirPedidos(true);
      });

    console.log(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const clientesCollection = collection(db, "clientes");
      const querySnapshot = await getDocs(clientesCollection);
      const newArray = querySnapshot.docs.map((cliente) => ({
        ...cliente.data(),
        id: cliente.id,
      }));
      setDataClientes(newArray);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setOptions(dataClientes.map((cliente) => [cliente.name]));
  }, [dataClientes]);

  const eliminarProducto = (index) => {
    const updatedArray = [...selectedOptionsArray];
    updatedArray.splice(index, 1);
    setSelectedOptionsArray(updatedArray);
  };

  useEffect(() => {
    const fetchData = async () => {
      const productosCollection = collection(db, "productos");
      const querySnapshot = await getDocs(productosCollection);
      const newArray = querySnapshot.docs.map((product) => ({
        ...product.data(),
        id: product.id,
      }));
      setDataProductos(newArray);
    };
    fetchData();
  }, []);

  useEffect(() => {}, [cantidad, producto, descuento]);

  const confirmarProducto = async () => {
    console.log(selectedOption3.value);

    const productoDocRef = doc(db, "productos", selectedOption3.value);
    const productoDocSnapshot = await getDoc(productoDocRef);

    if (productoDocSnapshot.exists()) {
      try {
        // El documento del producto existe en la base de datos
        const productoData = productoDocSnapshot.data();
        const precio = productoData.unit_price;

        const newItem = {
          Producto: selectedOption3.label,
          Cantidad: cantidad,
          Precio: precio, // Usar el precio obtenido de la base de datos
          Descuento: descuento,
          ID: selectedOption3.value, // Guardar el ID del producto seleccionado
        };
        console.log(newItem);
        setSelectedOptionsArray([...selectedOptionsArray, newItem]);
        useNavigate("/pedidos");
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    setOptions2(
      dataProductos.map((propiedad) => ({
        value: propiedad.id,
        label: propiedad.name, // Supongo que la propiedad name está en el objeto propiedad
      }))
    );
  }, [dataProductos]);

  const handleChange3 = (event, selectedOption) => {
    if (selectedOption !== null) {
      const selectedProductId = selectedOption.value; // Obtén el ID del producto
      setSelectedOption3(selectedOption);
      setProducto(selectedProductId); // Establece el ID del producto en lugar del objeto completo
      console.log(selectedProductId);
    }
  };

  const handleChange4 = (event) => {
    const value = event.target.value;
    setCantidad(value);
  };
  const handleChange5 = (event) => {
    const value = event.target.value;
    setDescuento(value);
  };

  const handleChange2 = (value) => {
    console.log(value);
    setSelectedOption2(value);
  };
  const handleChange = (event, value) => {
    setSelectedOption(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedOption) {
      const data = {
        cliente: selectedOption,
        fecha: selectedOption2,
      };

      onSubmit(data);
      cerrarListadoPedidos();
    }
  };

  function quitarComas(objt) {
    const objeto = objt.replace(/,/g, "");
    return objeto;
  }

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

  const correctColumns = [
    { field: "Producto", width: 180 },
    { field: "Cantidad", width: 10 },
    { field: "Precio", width: 80 },
    { field: "Descuento", width: 10 },
    {
      field: "Acciones",
      width: 10,
      renderCell: (params) => (
        <Button
          onClick={() => {
            eliminarProducto(params.id); // Aquí usamos params.id para obtener el id de la fila
          }}
        >
          <span className="material-symbols-outlined">delete</span>
        </Button>
      ),
    },
  ];

  const navigate = useNavigate();

  const objeto = selectedOptionsArray.map((elemento, index) => ({
    id: index,
    Producto: elemento.Producto,
    Cantidad: elemento.Cantidad,
    Precio: `$ ${elemento.Precio}`,
    Descuento: `${elemento.Descuento} %`,
  }));

  const rows = objeto;

  const volverPedidos = () => {
    setOpen(false);
  };

  return (
    <div>
      <CssBaseline />
      <Box sx={style}>
        <form
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "column",
            alignItems: "center",
            margin: "1rem",
          }}
          onSubmit={handleSubmit}
        >
          <Grid
            container
            rowSpacing={4}
            // alignItems="center"
            justifyContent={"center"}
          >
            <div
              sx={{
                width: "100%",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",

                // backgroundColor: theme.palette.secondary.main,
              }}
            >
              <CssBaseline />
              <div style={{ width: "90%", marginLeft: "10%" }}>
                <DemoContainer
                  size="small"
                  sx={{ display: "flex", alignItems: "center" }}
                  components={["DatePicker"]}
                >
                  {/* <div>
                Fecha de Entrega:
                <DatePicker
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "0.5rem",
                  }}
                  id="fecha"
                  name="fecha"
                  value={selectedOption2}
                  onChange={handleChange2}
                />
              </div> */}
                </DemoContainer>
                <ThemeProvider theme={theme}>
                  <div style={{ width: "80%", margin: "1rem" }}>
                    Seleccionar Comercio:
                    <Autocomplete
                      disablePortal
                      size="small"
                      id="cliente"
                      options={options}
                      getOptionLabel={(options) => options.toString()}
                      name="cliente"
                      value={selectedOption}
                      onChange={handleChange}
                      sx={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField {...params} label="Escribe el Comercio" />
                      )}
                    />
                  </div>
                  <div style={{ width: "80%", margin: "1rem" }}>
                    <Autocomplete
                      size="small"
                      disablePortal
                      sx={{ width: "100%" }}
                      id="productos"
                      options={options2}
                      getOptionLabel={(options) => options.label}
                      name="productos"
                      value={selectedOption3}
                      onChange={handleChange3}
                      fullWidth
                      renderInput={(params) => {
                        quitarComas(params.inputProps.value);

                        return (
                          <TextField {...params} label="Escribe el Producto" />
                        );
                      }}
                    />
                  </div>
                  <div style={{ width: "80%", margin: "1rem" }}>
                    <TextField
                      size="small"
                      sx={{ width: "20%", margin: "2rem" }}
                      disablePortal
                      id="cantidad"
                      name="cantidad"
                      value={cantidad} // Asignamos el valor del estado aquí
                      onChange={handleChange4}
                      label="Cantidad de Unidades"
                    />

                    <TextField
                      size="small"
                      sx={{ width: "20%", margin: "2rem", marginLeft: "1rem" }}
                      disablePortal
                      id="cantidad"
                      name="descuento"
                      value={descuento} // Asignamos el valor del estado aquí
                      onChange={handleChange5}
                      label="Descuento %"
                    />
                    <Button onClick={confirmarProducto}>
                      <span
                        style={{
                          fontSize: "2.5rem",
                          display: "flex",
                          alignItems: "center",
                          marginTop: "1rem",
                        }}
                        class="material-symbols-outlined"
                      >
                        add
                      </span>
                    </Button>
                  </div>
                </ThemeProvider>
                <div
                  style={{
                    width: "80%",
                    margin: "1rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={10}>
                      <Box sx={{ height: 250 }}>
                        <DataGrid rows={rows} columns={correctColumns} />
                      </Box>
                      {/* <table style={{ width: "90%" }} className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Unidades</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {selectedOptionsArray.map((item, index) => (
                  <tr key={index}>
                    <td style={{ width: "60%" }}>
                      <h4 style={{ color: "black", fontSize: "2rem" }}>
                        {item[0].Producto[0] +
                          item[0].Producto[1] +
                          item[0].Producto[2] +
                          item[0].Producto[3] +
                          item[0].Producto[4] +
                          item[0].Producto[5]}
                      </h4>{" "}
                    </td>
                    <td style={{ width: "10%" }}>
                      <h4 style={{ color: "black", fontSize: "2rem" }}>
                        {parseFloat(item[0].Producto[7]).toFixed(2)}
                      </h4>{" "}
                    </td>
                    <td style={{ width: "10%" }}>
                      <h4 style={{ color: "black", fontSize: "2rem" }}>
                        {item[1].Cantidad}
                      </h4>{" "}
                    </td>
                    <td style={{ width: "10%" }}>
                      <Button onClick={() => eliminarProducto(index)}>
                        <span class="material-symbols-outlined">delete</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> */}
                    </Grid>
                  </Grid>
                </div>
                <Button
                  style={{ margin: "2rem" }}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Agregar
                </Button>
                <Button
                  style={{ margin: "2rem" }}
                  variant="contained"
                  color="primary"
                  onClick={volverPedidos}
                >
                  Volver
                </Button>
              </div>
            </div>
          </Grid>
        </form>
      </Box>
    </div>
  );
};

export default FormPedidos;
