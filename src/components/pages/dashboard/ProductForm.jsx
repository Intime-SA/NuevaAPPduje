import React from "react";
import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { uploadFile, db } from "../../../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

const ProductForm = ({
  handleClose,
  setIsChange,
  productSelected,
  setProductSelected,
}) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    unit_price: 0,
    stock: 0,
    marca: "",
    img: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [file, setFile] = useState(null);

  const handleImage = async () => {
    setIsLoading(true);
    let url = await uploadFile(file);

    setNewProduct({ ...newProduct, img: url });
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let obj = {
      ...newProduct,
      unit_price: +newProduct.unit_price,
      stock: +newProduct.stock,
    };
    console.log(newProduct);
    const productsCollection = collection(db, "productos");
    addDoc(productsCollection, obj).then(() => {
      setIsChange(true);
      handleClose();
    });
  };

  return (
    <div style={{ border: "solid 1px black" }}>
      <form style={{ border: "solid 1px black" }} onSubmit={handleSubmit}>
        <TextField
          name="name"
          variant="outlined"
          defaultValue={productSelected?.name}
          label="Nombre"
          onChange={handleChange}
        ></TextField>
        <TextField
          name="unit_price"
          variant="outlined"
          defaultValue={productSelected?.unit_price}
          label="Precio"
          onChange={handleChange}
        ></TextField>
        <TextField
          name="stock"
          variant="outlined"
          defaultValue={productSelected?.stock}
          label="Stock"
          onChange={handleChange}
        ></TextField>
        <TextField
          name="marca"
          variant="outlined"
          defaultValue={productSelected?.marca}
          label="marca"
          onChange={handleChange}
        ></TextField>
        <input
          name="img"
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        {file && (
          <Button onClick={handleImage} type="button">
            Cargar Imagen
          </Button>
        )}
        {file && !isLoading && <Button type="submit">Crear Producto</Button>}
      </form>
    </div>
  );
};

export default ProductForm;
