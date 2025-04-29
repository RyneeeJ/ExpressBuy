const QuantitySelector = ({ handleDecrement, handleIncrement, quantity }) => {
  return (
    <div className="flex items-center">
      <button className="btn w-10" onClick={handleDecrement}>
        &minus;
      </button>
      <div className="btn w-10">{quantity}</div>
      <button className="btn w-10" onClick={handleIncrement}>
        &#43;
      </button>
    </div>
  );
};

export default QuantitySelector;
