import { useState } from "react";
import ProductOperations from "../../../ui/ProductOperations";
import { formatCurrency } from "../../../utils/helpers";

const CompleteProductDetails = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { primaryImage, name, description, price, variants } = product;
  const totalStock = variants.reduce((acc, v) => v.stock + acc, 0);

  const hasMultiplePrices = variants.some((v) => v.price);
  const selectedVariantObject = variants.find(
    (v) => v.description === selectedVariant,
  );

  return (
    <div>
      <div className="card bg-base-100 h-full w-full max-w-96 shadow-sm">
        <figure>
          <img src={primaryImage} alt={name} />
        </figure>
        <div className="card-body space-y-2 p-5">
          <div className="space-y-2">
            <h2 className="card-title text-xl">{name}</h2>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-semibold tracking-wider">
                {hasMultiplePrices &&
                  selectedVariant &&
                  formatCurrency(selectedVariantObject?.price)}
                {hasMultiplePrices &&
                  !selectedVariant &&
                  `${formatCurrency(variants.at(0).price)} - ${formatCurrency(variants.at(-1).price)}`}

                {!hasMultiplePrices && formatCurrency(price)}
              </span>

              <span className="opacity-75">
                {variants.length > 1 &&
                  selectedVariant &&
                  selectedVariantObject.stock}
                {variants.length > 1 && !selectedVariant && totalStock}
                {variants.length === 1 && totalStock} stocks
              </span>
            </div>
          </div>
          <p>{description}</p>

          <ProductOperations
            variants={variants}
            setSelectedVariant={setSelectedVariant}
            selectedVariant={selectedVariant}
          />
        </div>
      </div>
    </div>
  );
};

export default CompleteProductDetails;
