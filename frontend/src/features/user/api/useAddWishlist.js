import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import showToast from "../../../utils/toast";

const addToWishlist = async ({ productId, variantId }) => {
  const res = await axios.post(
    `/api/v1/users/me/wishlist/${productId}/${variantId}`,
  );

  return res.data;
};

const useAddWishlist = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      showToast(
        "success",
        "Product variant successfully added to your wishlist!",
      );
    },
    onError: (err) => {
      showToast("info", err.response.data.message);
    },
  });

  return { mutate, isPending, error };
};

export default useAddWishlist;
