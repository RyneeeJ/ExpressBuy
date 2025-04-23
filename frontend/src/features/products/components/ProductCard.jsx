import { formatCurrency } from "../../../utils/helpers";
const ProductCard = ({ product }) => {
  const { name, primaryImage, price, variants } = product;
  const numVariants = variants.length;
  return (
    <div className="card bg-base-100 group h-full w-full max-w-96 cursor-pointer shadow-sm">
      <figure className="h-72">
        <img
          src={primaryImage}
          className="h-full w-full object-cover object-center transition-all duration-200 hover:scale-110"
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-md opacity-85 group-hover:underline">
          {name}
        </h2>
        <div className="mb-3 text-2xl font-semibold tracking-wide">
          {formatCurrency(price)}
        </div>

        {numVariants > 1 ? (
          <div className="mt-auto justify-end text-base opacity-85">
            <p>{variants.length} variants</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCard;
