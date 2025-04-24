import { useNavigate } from "react-router";
import useProducts from "../features/products/api/useProducts";
import ProductList from "../features/products/components/ProductList";
import Pagination from "../ui/Pagination";
import ErrorDisplay from "../ui/ErrorDisplay";

const ProductsPage = () => {
  const { data, error, status } = useProducts();
  const navigate = useNavigate();

  if (status === "pending") return <div>Loading products...</div>;
  if (error) {
    const errMsg = `${error.response.data.message}: No products found for this page`;
    return <ErrorDisplay errMsg={errMsg} />;
  }

  const { totalPages, filter, totalProducts, limit } = data.data;
  const productCategory =
    data.data.filter?.category?.replaceAll("-", " ").toUpperCase() ||
    "All Products";

  const curPage = Number(filter?.page);
  const lowerLimit = (curPage - 1) * limit + 1;
  const lastPageUpperLimit =
    lowerLimit + (totalProducts - (totalPages - 1) * limit) - 1;
  const upperLimit =
    curPage === totalPages ? lastPageUpperLimit : curPage * limit;

  const excessPageMessage = `No products found for this page (${data.pagination?.currentPage}).
    Total number of page is only ${data.pagination?.totalPages}`;

  return (
    <div className="flex h-full flex-col">
      {data.status === "Success" && data.results === 0 ? (
        <ErrorDisplay errMsg={excessPageMessage} />
      ) : (
        <>
          <div className="mb-8 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold tracking-wider sm:text-2xl">
                {productCategory}
              </span>
              <Pagination curPage={curPage} totalPages={totalPages} />
            </div>
            <span className="ml-auto text-sm opacity-80 sm:text-base">
              Showing {totalProducts > 1 ? `${lowerLimit} - ${upperLimit}` : 1}{" "}
              of {totalProducts} product
              {totalProducts > 1 ? "s" : ""}
            </span>
          </div>

          <ProductList products={data.data.products} />
        </>
      )}
    </div>
  );
};

export default ProductsPage;
