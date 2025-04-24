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
  const paramsPage = searchParams.get("page");
  const page = !paramsPage ? 1 : Number(paramsPage);
  // if params page = 0, use it.
  // if params page = undefined, use 1

  const params = {
    page,
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
    retry: false,
  });

  return { data, status, error };
};

export default useProducts;
