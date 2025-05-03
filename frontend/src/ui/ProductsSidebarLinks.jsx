import SidebarNavLinks from "./SidebarNavLinks";
import useProductCategories from "../features/products/api/useProductCategories";

const ProductsSidebarLinks = () => {
  const { data: categories, error } = useProductCategories();

  if (error)
    return <div>There was an error in fetching product categories</div>;

  return <SidebarNavLinks links={categories} isProfilePage={false} />;
};

export default ProductsSidebarLinks;
