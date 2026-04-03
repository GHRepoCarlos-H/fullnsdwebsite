import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import MyCartsPage from "./pages/MyCartsPage";
import LeadershipCartsPage from "./pages/LeadershipCartsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-carts"
          element={
            <ProtectedRoute>
              <MyCartsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leadership-carts"
          element={
            <ProtectedRoute allowedRoles={["supervisor", "manager", "admin"]}>
              <LeadershipCartsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;