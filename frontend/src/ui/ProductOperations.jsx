import { useState } from "react";
import QuantitySelector from "./QuantitySelector";
import VariantSelector from "./VariantSelector";
import useAddToCart from "../features/cart/api/useAddToCart";
import { useParams } from "react-router";
import showToast from "../utils/toast";

const ProductOperations = ({
  variants,
  setSelectedVariant,
  selectedVariant,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { productId } = useParams();
  const hasMultipleVariants = variants.length > 1;

  const variantId = hasMultipleVariants
    ? variants.find((v) => v.description === selectedVariant)?._id
    : variants.at(0)._id;

  //TODO: finish this after login and sign up functionality

  const { mutate: addItemToCart, isPending: isAddingToCart } = useAddToCart();

  const handleDecrement = () => {
    if (quantity === 1) return;
    setQuantity((q) => q - 1);
  };
  const handleIncrement = () => {
    setQuantity((q) => q + 1);
  };

  const addToCart = () => {
    if (!variantId || !quantity || !productId) {
      return showToast("error", "Please select a variant for this product.");
    }
    addItemToCart({ productId, variantId, quantity });
    setQuantity(1);
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
        <button
          onClick={addToCart}
          disabled={isAddingToCart}
          className="btn btn-primary"
        >
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </>
  );
};

export default ProductOperations;
