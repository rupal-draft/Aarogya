"use client"

import { blogPosts } from "../../Data/blog"
import AnimatedSection from "../Animation/AnimatedSection"
import { motion } from "framer-motion"

const BlogSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Latest News Update</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt uttom labore et
            dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <AnimatedSection key={index} delay={index * 0.1} direction="up" className="h-full">
              <motion.div whileHover={{ y: -10 }} className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
                <div className="relative overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-56 object-cover transition-transform duration-500"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                  >
                    <motion.a
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      href={post.url}
                      className="bg-white rounded-full p-2"
                      aria-label="Read blog post"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </motion.a>
                  </motion.div>
                </div>

                <div className="p-6 flex flex-col h-[calc(100%-224px)]">
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-2">
                      <a href={post.url} className="text-gray-800 hover:text-blue-600 transition-colors">
                        {post.title}
                      </a>
                    </h3>
                    <a href={post.url} className="text-gray-500 text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {post.date}
                    </a>
                    <p className="text-gray-600 mt-2">{post.excerpt}</p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                    <motion.a
                      whileHover={{ x: 5 }}
                      href={post.url}
                      className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                    >
                      Read More
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </motion.a>
                    <div className="flex space-x-3">
                      <motion.a
                        whileHover={{ y: -2 }}
                        href={post.url}
                        className="text-gray-500 hover:text-blue-600 transition-colors flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <span className="ml-1">{post.likes}</span>
                      </motion.a>
                      <motion.a
                        whileHover={{ y: -2 }}
                        href={post.url}
                        className="text-gray-500 hover:text-blue-600 transition-colors flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span className="ml-1">{post.comments}</span>
                      </motion.a>
                      <motion.a
                        whileHover={{ y: -2 }}
                        href={post.url}
                        className="text-gray-500 hover:text-blue-600 transition-colors flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                        <span className="ml-1">{post.shares}</span>
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogSection
