import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import AppLayout from "./ui/AppLayout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProfilePage from "./pages/ProfilePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import AddressesPage from "./pages/AddressesPage";
import OrdersPage from "./pages/OrdersPage";
import Wishlist from "./pages/WishlistPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        toastOptions={{
          style: {
            padding: "0",
            margin: "0",
            background: "none",
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="cart" element={<CartPage />} />

            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route
              path="products/:category/:productId"
              element={<ProductDetailsPage />}
            />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/addresses" element={<AddressesPage />} />
            <Route path="profile/orders" element={<OrdersPage />} />
            <Route path="profile/wishlist" element={<Wishlist />} />
            <Route
              path="profile/change-password"
              element={<ChangePasswordPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
