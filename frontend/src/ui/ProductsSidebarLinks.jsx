import axios from "axios";
import { useEffect, useState } from "react";
import SidebarNavLinks from "./SidebarNavLinks";

const fetchCategories = async () => {
  try {
    const res = await axios.get("/api/v1/products/categories");
    return res.data;
  } catch (err) {
    console.error("Error fetching categories 💥💥💥", err);
    return [];
  }
};

const ProductsSidebarLinks = () => {
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
  return <SidebarNavLinks links={categories} isProfilePage={false} />;
};

export default ProductsSidebarLinks;
