import FeaturedProducts from "../features/products/FeaturedProducts";
import Testimonials from "../ui/Testimonials";

const HomePage = () => {
  return (
    <div className="flex flex-col">
      <FeaturedProducts />
      <Testimonials />
    </div>
  );
};

export default HomePage;
