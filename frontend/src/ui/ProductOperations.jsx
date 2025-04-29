import { useState } from "react";
import QuantitySelector from "./QuantitySelector";
import VariantSelector from "./VariantSelector";

const ProductOperations = ({ variants, setSelectedVariant }) => {
  const [quantity, setQuantity] = useState(1);

  const hasMultipleVariants = variants.length > 1;
  const handleDecrement = () => {
    if (quantity === 1) return;
    setQuantity((q) => q - 1);
  };
  const handleIncrement = () => {
    setQuantity((q) => q + 1);
  };
  return (
    <>
      <div
        className={`flex items-center ${hasMultipleVariants ? "justify-between" : "justify-end"}`}
      >
        {hasMultipleVariants && (
          <VariantSelector
            setSelectedVariant={setSelectedVariant}
            variants={variants}
          />
        )}
        <QuantitySelector
          handleDecrement={handleDecrement}
          handleIncrement={handleIncrement}
          quantity={quantity}
        />
      </div>
      <div className="card-actions mt-4 flex justify-between">
        <button className="btn btn-soft">Add to Wishlist</button>
        <button className="btn btn-primary">Add to Cart</button>
      </div>
    </>
  );
};

export default ProductOperations;
