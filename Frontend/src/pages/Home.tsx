import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Notebook as Robot, FileSearch, Siren } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Home = () => {
  const healthNews = [
    {
      id: 1,
      title: "Breakthrough in Cancer Treatment Using AI",
      excerpt:
        "New AI-powered drug discovery platform reduces research time by 60%...",
      category: "Medical Advancements",
      image:
        "https://plus.unsplash.com/premium_photo-1683121710572-7723bd2e235d?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      url: "#",
      date: "Mar 15, 2024",
      readTime: "4 min read",
    },
    {
      id: 2,
      title: "Daily Health Tip: Boost Your Immunity Naturally",
      excerpt:
        "Discover 5 science-backed ways to strengthen your immune system...",
      category: "Health Tips",
      image:
        "https://plus.unsplash.com/premium_photo-1666299901723-b886bb118d67?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      url: "#",
      date: "Mar 14, 2024",
      readTime: "3 min read",
    },
    {
      id: 3,
      title: "Mental Health Awareness: New Digital Tools",
      excerpt:
        "Explore AI-driven mental health support platforms changing care delivery...",
      category: "Mental Health",
      image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666",
      url: "#",
      date: "Mar 13, 2024",
      readTime: "5 min read",
    },
    {
      id: 4,
      title: "AI in Surgery: Robotic Breakthroughs",
      excerpt:
        "How machine learning is enhancing precision in surgical procedures...",
      category: "Medical Tech",
      image: "https://images.unsplash.com/photo-1578496781985-452d4a934d50",
      url: "#",
      date: "Mar 12, 2024",
      readTime: "6 min read",
    },
  ];
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Hero Section */}
      <div
        className="relative h-[755px] flex items-center justify-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-4xl md:text-6xl font-poppins font-bold text-white mb-6">
            Your
            <span className="bg-gradient-to-r from-green-400 to-primary text-transparent bg-clip-text">
              AI-powered
            </span>{" "}
            healthcare companion
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 font-inter">
            Anytime, anywhere
          </p>
          <Link
            to="/chatbot"
            className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            Get Started
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-poppins font-bold text-center mb-12 text-gray-800 dark:text-white">
          Our Services
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Robot,
              title: "AI Chatbot",
              description:
                "Get instant medical guidance with our intelligent chatbot",
              link: "/chatbot",
            },
            {
              icon: FileSearch,
              title: "Report Analyzer",
              description:
                "Upload medical reports for AI-powered analysis and insights",
              link: "/analyzer",
            },
            {
              icon: Siren,
              title: "Emergency SOS",
              description:
                "Quick access to emergency services and real-time location sharing",
              link: "/emergency",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white dark:bg-background-dark p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-poppins font-bold mb-2 text-gray-800 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 font-inter">
                {feature.description}
              </p>
              <Link
                to={feature.link}
                className="text-primary hover:text-primary/80 font-semibold inline-flex items-center"
              >
                Learn More →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Health News Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-800 dark:text-white mb-4">
            📰 Latest Health <span className="bg-gradient-to-r from-green-400 to-primary text-transparent bg-clip-text">News & Blogs</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-inter">
            AI-curated articles, medical advancements, and daily health tips
          </p>
        </motion.div>

        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 5000 }}
          navigation
          className="health-news-swiper"
        >
          {healthNews.map((article) => (
            <SwiperSlide key={article.id}>
              <motion.article
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <span className="text-sm font-semibold text-primary">
                    {article.category}
                  </span>
                  <h3 className="text-xl font-poppins font-bold mt-2 mb-3 text-gray-800 dark:text-white">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 font-inter line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
                <Link
                  to={article.url}
                  className="block w-full py-3 text-center bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-semibold"
                >
                  Read More
                </Link>
              </motion.article>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
};

export default Home;
