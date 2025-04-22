const ProductCard = ({ product }) => {
  console.log(product);
  const { name, primaryImage } = product;
  return (
    <div className="card bg-base-100 h-full w-full max-w-96 shadow-sm">
      <figure className="h-72">
        <img
          src={primaryImage}
          className="h-full w-full object-cover object-center"
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>
          A card component has a figure, a body part, and inside body there are
          title and actions parts
        </p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
