import ProductCard from "./ProductCard";

const ProductList = ({ products }) => {
  return (
    <ul className="grid w-full grid-cols-1 place-items-center gap-4 sm:grid-cols-2 md:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </ul>
  );
};

export default ProductList;
