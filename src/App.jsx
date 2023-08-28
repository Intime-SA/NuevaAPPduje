import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import CartContextComponente from "./context/CartContext";

function App() {
  return (
    <BrowserRouter>
      <CartContextComponente>
        <AppRouter />
      </CartContextComponente>
    </BrowserRouter>
  );
}

export default App;
