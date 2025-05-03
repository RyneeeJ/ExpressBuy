import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchCategories = async () => {
  try {
    const res = await axios.get("/api/v1/products/categories");
    return res.data;
  } catch (err) {
    console.error("Error fetching categories 💥💥💥", err);
    throw err;
  }
};

const useProductCategories = () => {
  const { data, isPending, isFetching, status, error } = useQuery({
    queryKey: ["product-categories"],
    queryFn: fetchCategories,
    select: (data) => {
      // Transform data immediately after fetch
      return [
        { label: "All Products", category: "all" },
        ...data.data.categories,
      ];
    },
    onError: (error) => {
      console.error("Categories fetch failed:", error);
    },
  });

  return { data, status, isPending, isFetching, error };
};

export default useProductCategories;
