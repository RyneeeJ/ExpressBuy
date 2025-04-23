export const formatCurrency = (value) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "PHP" }).format(
    value,
  );
