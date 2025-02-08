import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export default function Products() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ProductsClient />
    </Suspense>
  );
}
