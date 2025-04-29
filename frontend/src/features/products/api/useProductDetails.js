import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router";

const fetchProductDetail = async ({ productId, category }) => {
  try {
    const res = await axios.get(`/api/v1/products/${category}/${productId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching product details 💥💥💥", err);
    throw err;
  }
};

const useProductDetails = () => {
  const { productId, category } = useParams();

  const { data, status, error } = useQuery({
    queryKey: ["product-details", productId, category],
    queryFn: () => fetchProductDetail({ productId, category }),
    retry: false,
  });

  return { data, status, error };
};

export default useProductDetails;
