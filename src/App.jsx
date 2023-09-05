import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import CartContextComponente from "./context/CartContext";
import AuthContextComponent from "./context/AuthContext";
import { GlobalStateProvider } from "./context/Context";

function App() {
  return (
    <GlobalStateProvider>
      <BrowserRouter>
        <AuthContextComponent>
          <CartContextComponente>
            <AppRouter />
          </CartContextComponente>
        </AuthContextComponent>
      </BrowserRouter>
    </GlobalStateProvider>
  );
}

export default App;
