import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import CartContextComponente from "./context/CartContext";
import AuthContextComponent from "./context/AuthContext";
import { GlobalStateProvider } from "./context/Context";
import { DrawerContextComponent } from "./context/DrawerContext";

function App() {
  return (
    <GlobalStateProvider>
      <BrowserRouter>
        <AuthContextComponent>
          <CartContextComponente>
            <DrawerContextComponent>
              <AppRouter />
            </DrawerContextComponent>
          </CartContextComponente>
        </AuthContextComponent>
      </BrowserRouter>
    </GlobalStateProvider>
  );
}

export default App;
