import ExclusiveOffers from "../components/ExclusiveOffers";
import FeaturedDestination from "../components/FeaturedDestination";
import Hero from "../components/Hero";
import NewsLetter from "../components/NewsLetter";
import Testimonial from "../components/Testimonial";
import RecommendedHotels from "../components/RecommendedHotels.jsx";

const Home = () => {
  return (
    <>
      <Hero/>
      <RecommendedHotels/>
      <FeaturedDestination/>
      <ExclusiveOffers/>
      <Testimonial/>
      <NewsLetter/>
    </>
  );
};

export default Home;
