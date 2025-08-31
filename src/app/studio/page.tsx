'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Linkedin, Instagram } from 'lucide-react';
import localFont from 'next/font/local';
import FlipLink from '@/components/ui/text-effect-flipper';

const mori = localFont({
  src: "../../../public/fonts/Mori-Regular.otf", // ✅ fixed font path
});

const ContactPage: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const scaleVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-200 via-lime-300 to-green-300 flex items-center px-5 py-10">
      <motion.div
        className="max-w-7xl mx-auto grid lg:grid-cols-2  gap-20 items-center w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Content Section */}
        <motion.div className="text-gray-800 relative left-8" variants={itemVariants}>
          <motion.h1
            className={`absolute text-6xl lg:text-7xl ${mori.className}  font-black leading-none -top-20 items-center justify-items-center text-gray-900`}
            variants={itemVariants}
          >
            Let&apos;s talk.
          </motion.h1>

          

          <motion.div
            className="flex flex-col items-center  gap-4"
            variants={itemVariants}
          >
            <FlipLink href='https://github.com/shubham574'>Github</FlipLink>
            <FlipLink href='https://github.com/shubham574'>LinkedIn</FlipLink>

           {/* <div className="flex gap-3">
              <motion.a
                href="#"
                className="w-11 h-11 border-2 border-gray-800 rounded-full flex items-center justify-center text-gray-800 transition-all duration-300 hover:bg-gray-800 hover:text-white"
                whileHover={{ scale: 1.1, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin size={18} />
              </motion.a>

              <motion.a
                href="#"
                className="w-11 h-11 border-2 border-gray-800 rounded-full flex items-center justify-center text-gray-800 transition-all duration-300 hover:bg-gray-800 hover:text-white"
                whileHover={{ scale: 1.1, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
              >
                <Instagram size={18} />
              </motion.a>
            </div> */}
          </motion.div>
        </motion.div>

        {/* Calendar Section */}
        <motion.div
          className="bg-white rounded-2xl p-8 shadow-2xl"
          variants={scaleVariants}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h2
            className="text-2xl font-bold text-gray-800 text-center mb-6"
            variants={itemVariants}
          >
            Schedule a Meeting
          </motion.h2>

          <motion.div
            className="rounded-xl overflow-hidden"
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <iframe
              src="https://cal.com/shubham-maurya-ucvmce/testing-event"
              className="w-full h-[450px] border-none rounded-xl" 
              loading="lazy"
              title="Schedule a meeting"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
