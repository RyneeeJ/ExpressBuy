import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const fetchCategories = async () => {
  try {
    const res = await axios.get("/api/v1/products/categories");
    return res.data;
  } catch (err) {
    console.error("Error fetching categories 💥💥💥", err);
    return [];
  }
};

const useProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const { data, status, error } = useQuery({
    queryKey: ["product-category"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (!data) return;
    const finalCategories = [...data.data.categories];
    finalCategories.unshift({ label: "All Products", category: "all" });
    setCategories(finalCategories);
  }, [data]);

  return { categories, status, error };
};

export default useProductCategories;
