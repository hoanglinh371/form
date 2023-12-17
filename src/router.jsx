import { createBrowserRouter } from "react-router-dom";

import ProductForm from "./components/product-form";
import ProductList from "./components/product-list";

const router = createBrowserRouter([
  {
    path: "/add",
    element: <ProductForm />,
  },
  {
    path: "/",
    element: <ProductList />,
  },
]);

export default router;
