import useProducts from "../features/products/api/useProducts";
import ProductList from "../features/products/components/ProductList";

const ProductsPage = () => {
  const { data, error, status } = useProducts();
  if (status === "pending") return <div>Loading products...</div>;
  if (error) {
    console.log(error);
    return <div>There was an error fetching the products...</div>;
  }
  return (
    <div>
      <ProductList products={data.data.products} />
    </div>
  );
};

export default ProductsPage;
