import SidebarNavLinks from "./SidebarNavLinks";
import useProductCategories from "../features/products/api/useProductCategories";

const ProductsSidebarLinks = () => {
  const { categories, error, status } = useProductCategories();

  if (status === "pending") return <div>LOADING....</div>;
  if (error)
    return <div>There was an error in fetching product categories</div>;

  return <SidebarNavLinks links={categories} isProfilePage={false} />;
};

export default ProductsSidebarLinks;
