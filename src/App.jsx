import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import CartContextComponente from "./context/CartContext";
import AuthContextComponent from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthContextComponent>
        <CartContextComponente>
          <AppRouter />
        </CartContextComponente>
      </AuthContextComponent>
    </BrowserRouter>
  );
}

export default App;
