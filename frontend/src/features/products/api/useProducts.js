import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router";

const fetchProducts = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();

    const url = `/api/v1/products${queryString ? `?${queryString}` : ""}`;

    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error("Error fetching all products 💥💥💥", err);
    throw err;
  }
};

const useProducts = () => {
  const [searchParams] = useSearchParams();

  const urlCategory = searchParams.get("category");
  const params = {
    page: Number(searchParams.get("page")) || 1,
    category: urlCategory && urlCategory !== "all" ? urlCategory : null,
    isFeatured: searchParams.get("isFeatured"),
    brand: searchParams.get("brand"),
    minPrice: Number(searchParams.get("minPrice")) || null,
    maxPrice: Number(searchParams.get("maxPrice")) || null,
  };

  // Remove undefined/null params
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      // eslint-disable-next-line no-unused-vars
      ([_, value]) => value !== null && value !== undefined,
    ),
  );

  const { data, status, error } = useQuery({
    queryKey: ["products", cleanParams],
    queryFn: () => fetchProducts(cleanParams),
  });

  return { data, status, error };
};

export default useProducts;
