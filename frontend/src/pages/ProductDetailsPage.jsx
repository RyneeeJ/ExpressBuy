import useProductDetails from "../features/products/api/useProductDetails";
import CompleteProductDetails from "../features/products/components/CompleteProductDetails";
import BreadcrumbNav from "../ui/BreadcrumbNav";
import LoadingSpinner from "../ui/LoadingSpinner";
const ProductDetailsPage = () => {
  const { data, isLoading } = useProductDetails();
  const breadcrumbLinks = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
  ];

  if (isLoading) return <LoadingSpinner />;
  const { product } = data.data;

  const categoryPath = product.category
    .replaceAll(" ", "-")
    .replace("&", "%26")
    .toLowerCase();

  breadcrumbLinks.push({
    label: product.category,
    path: `/products?category=${categoryPath}`,
  });

  return (
    <div className="flex h-full flex-col">
      <BreadcrumbNav linksArr={breadcrumbLinks} />
      <div className="flex flex-1 flex-col items-center overflow-y-auto">
        <CompleteProductDetails product={product} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
