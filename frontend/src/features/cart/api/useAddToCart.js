import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import showToast from "../../../utils/toast";

const addToCart = async ({ productId, variantId, quantity }) => {
  const itemObj = {
    variantId,
    quantity,
  };
  const res = await axios.post(`/api/v1/cart/${productId}`, itemObj);
  return res.data;
};

const useAddToCart = () => {
  const { data, error, isPending, mutate } = useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      const { product, variant } = data.data.item;
      showToast(
        "success",
        `${product.name} - ${variant.description} was added to your cart!`,
      );
    },
    onError: (err) => {
      showToast("error", err.response.data.message);
    },
  });

  return { data, error, isPending, mutate };
};

export default useAddToCart;
