import ExclusiveOffers from "../components/ExclusiveOffers";
import Hero from "../components/Hero";
import NewsLetter from "../components/NewsLetter";
import Testimonial from "../components/Testimonial";
import RecommendedHotels from "../components/RecommendedHotels.jsx";
import { lazy, Suspense } from "react";
import Loader from "../components/Loader.jsx";
import Title from "../components/Title.jsx";

const FeaturedDestination = lazy(() => import('../components/FeaturedDestination'));

const Home = () => {
  return (
    <>
      <Hero/>
      <RecommendedHotels/>
      <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
        <Title
          title={"Featured Destination"}
          subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences"
        />
        
        <Suspense fallback={<div className="mt-6"><Loader/></div>}>
          <FeaturedDestination/>
        </Suspense>
      </div>
      <ExclusiveOffers/>
      <Testimonial/>
      <NewsLetter/>
    </>
  );
};

export default Home;
