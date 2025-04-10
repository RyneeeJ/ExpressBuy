import { useEffect, useState } from "react";

import axios from "axios";

const fetchCategories = async () => {
  try {
    const res = await axios.get("/api/v1/products/categories");
    return res.data;
  } catch (err) {
    console.error("Error fetching categories 💥💥💥", err);
    return [];
  }
};

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const loadCategories = async () => {
      const res = await fetchCategories();
      const finalCategories = [...res.data.categories];
      finalCategories.unshift({ label: "All Products", category: "all" });

      setCategories(finalCategories);
    };

    loadCategories();
  }, []);

  return <div className="flex">HomePage</div>;
};

export default HomePage;
