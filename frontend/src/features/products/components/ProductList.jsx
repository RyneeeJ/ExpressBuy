import { useLocation } from "react-router";
import ProductCard from "./ProductCard";
import { useEffect, useRef } from "react";

const ProductList = ({ products }) => {
  const location = useLocation();
  const listRef = useRef();

  useEffect(() => {
    // Scroll the list back to top when the URL query changes
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [location.search]);
  return (
    <ul
      ref={listRef}
      className="grid w-full grid-cols-1 place-items-center gap-4 overflow-y-auto sm:grid-cols-2 md:grid-cols-3"
    >
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </ul>
  );
};

export default ProductList;
