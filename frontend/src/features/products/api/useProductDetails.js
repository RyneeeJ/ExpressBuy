import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router";

const fetchProductDetail = async ({ productId, category }) => {
  const res = await axios.get(`/api/v1/products/${category}/${productId}`);
  return res.data;
};

const useProductDetails = () => {
  const { productId, category } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["product-details", productId, category],
    queryFn: () => fetchProductDetail({ productId, category }),
    retry: false,
    throwOnError: true,
  });

  return { data, isLoading };
};

export default useProductDetails;
