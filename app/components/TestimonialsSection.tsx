"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Michael Carter",
    role: "CEO, CarterSoft Solutions",
    text: "WebAIGen completely transformed our workflow. Their AI automation reduced our workload by 60% and improved customer response time instantly.",
    avatar: "/images/woman1.jpg",
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director, NovaTech",
    text: "Their custom AI chatbot is the smartest tool we've ever implemented. Our support team now handles twice the volume with half the effort.",
    avatar: "/images/woman2.jpg",
  },
  {
    name: "James Bennett",
    role: "Founder, Bennett Real Estate",
    text: "We use WebAIGen's AI tools to manage leads and automate follow-ups. It's like having a full-time assistant working 24/7.",
    avatar: "/images/woman4.jpg",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-28 bg-white">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-40 right-1/2 translate-x-1/2 w-[800px] h-[800px] rounded-full bg-indigo-200 opacity-20 blur-[180px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-gray-900"
        >
          Trusted by Companies of All Sizes
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mt-4 text-lg text-gray-600 text-center max-w-2xl mx-auto"
        >
          See how WebAIGen is helping businesses automate, scale, and innovate.
        </motion.p>

        {/* Testimonials Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12, duration: 0.6 }}
              className="
                bg-white/70 backdrop-blur-xl shadow-sm border border-gray-200 
                p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1
                transition-all flex flex-col
              "
            >
              {/* Star Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="text-yellow-400 text-xl leading-none"
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 leading-relaxed text-sm">
                "{item.text}"
              </p>

              {/* Profile */}
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-200">
                {item.avatar ? (
                  <Image
                    src={item.avatar}
                    width={100}
                    height={100}
                    alt={item.name}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="h-18 w-18 rounded-full bg-gray-300" />
                )}

                <div>
                  <h4 className="text-gray-900 font-semibold">{item.name}</h4>
                  <p className="text-gray-500 text-sm">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
