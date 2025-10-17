"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const BlogBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Fixed: Added proper container positioning
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start start", "end start"],
  });

  // Enhanced parallax effect values
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 1.2]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <motion.section
      ref={bannerRef}
      className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden"
      style={{ position: "relative" }} // Fixed: Added explicit positioning
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Enhanced Background with multiple layers */}
      <div className="absolute inset-0">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-blue-500/30 to-cyan-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-purple-500/30 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Main background image with enhanced parallax */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
          style={{
            backgroundImage:
              "url(https://images.pexels.com/photos/11661531/pexels-photo-11661531.jpeg)",
            y: backgroundY,
            scale,
            opacity: 0.4,
          }}
        />

        {/* Enhanced overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-800/60 to-indigo-900/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-blue-900/40"></div>

        {/* Animated grid pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 79px, #ffffff 79px, #ffffff 81px, transparent 81px),
              linear-gradient(#ffffff 1px, transparent 1px)
            `,
            backgroundSize: "100% 40px, 100% 40px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "0px 40px"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      {/* Enhanced floating particles system */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/30"
            style={{
              width: Math.random() * 8 + 2,
              height: Math.random() * 8 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            // Fixed: Simplified animation to avoid spring errors
            animate={{
              y: [0, -200],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 0.7, 0],
              scale: [0, 1],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 10,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Enhanced animated medical/science icons */}
      <div className="absolute inset-0">
        {[
          { icon: "📚", size: 40, left: "5%", top: "15%", delay: 0 },
          { icon: "🔬", size: 36, left: "90%", top: "10%", delay: 0.5 },
          { icon: "🧪", size: 32, left: "80%", top: "75%", delay: 1 },
          { icon: "🩺", size: 44, left: "12%", top: "80%", delay: 1.5 },
          { icon: "💡", size: 38, left: "45%", top: "5%", delay: 2 },
          { icon: "📖", size: 34, left: "60%", top: "85%", delay: 2.5 },
          { icon: "🔍", size: 30, left: "85%", top: "45%", delay: 3 },
          { icon: "✍️", size: 42, left: "8%", top: "45%", delay: 3.5 },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-white/20"
            style={{
              fontSize: item.size,
              left: item.left,
              top: item.top,
            }}
            initial={{ scale: 0 }}
            animate={{
              y: [0, -30], // Fixed: Simplified to 2 keyframes
              scale: [0, 1],
              opacity: [0, 0.2],
            }}
            transition={{
              duration: 2,
              delay: item.delay,
              ease: "easeOut",
            }}
            whileHover={{
              scale: 1.3,
              opacity: 0.4,
              transition: { duration: 0.3 },
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      {/* Enhanced floating text elements */}
      <div className="absolute inset-0">
        {["Research", "Innovation", "Health", "Science", "Discovery"].map(
          (word, index) => (
            <motion.div
              key={word}
              className="absolute text-white/5 font-bold text-xl md:text-2xl pointer-events-none"
              style={{
                left: `${20 + index * 15}%`,
                top: `${15 + index * 12}%`,
              }}
              // Fixed: Simplified animation
              animate={{
                y: [0, -20],
                opacity: [0.03, 0.08],
              }}
              transition={{
                duration: 8 + index * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 1.5,
                ease: "easeInOut",
              }}
            >
              {word}
            </motion.div>
          )
        )}
      </div>

      {/* Enhanced Content */}
      <motion.div
        className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-center items-center text-center"
        style={{ opacity }}
      >
        <motion.div className="relative max-w-4xl mx-auto">
          {/* Enhanced decorative elements */}
          <motion.div
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: isVisible ? 128 : 0, opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />

          {/* Enhanced title with staggered letters */}
          <div className="mb-8">
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="relative inline-block bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                {"Medical Blog".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.05 }}
                    className="inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </span>
            </motion.h1>
          </div>

          {/* Enhanced subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Discover cutting-edge medical research, health insights, and
            healthcare innovations from our expert contributors
          </motion.p>

          {/* Enhanced breadcrumb with animation */}
          <motion.div
            className="flex items-center justify-center text-white/90 text-lg md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hover:text-white transition-colors"
            >
              <Link to="/" className="flex items-center gap-2">
                <motion.div
                  animate={{ x: [-2, 2, -2] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  🏠
                </motion.div>
                Home
              </Link>
            </motion.div>

            <motion.span
              className="mx-4 text-blue-300"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              ▶
            </motion.span>

            <motion.span
              className="text-white font-semibold bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20"
              whileHover={{ scale: 1.05 }}
            >
              Blog Articles
            </motion.span>
          </motion.div>

          {/* Enhanced stats bar */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 mt-12 text-white/80"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {[
              { number: "100+", label: "Articles" },
              { number: "50+", label: "Experts" },
              { number: "10K+", label: "Readers" },
              { number: "24/7", label: "Updates" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  delay: 1.4 + index * 0.1,
                }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced bottom wave effect */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full"
        >
          <motion.path
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 2, delay: 0.8 }}
            fill="#f8fafc"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default BlogBanner;
