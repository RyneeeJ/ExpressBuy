const VariantSelector = ({ variants, setSelectedVariant }) => {
  const handleSelect = (e) => setSelectedVariant(e.target.value);
  return (
    <div>
      <select
        onChange={handleSelect}
        defaultValue="Select variant"
        className="select"
      >
        <option disabled={true}>Select variant</option>
        {variants.map((v) => (
          <option value={v.description} key={v._id}>
            {v.description}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VariantSelector;
