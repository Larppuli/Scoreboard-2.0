"use client";
import { Text } from "@mantine/core";
import { motion } from "framer-motion";

export default function HomePage() {
  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut",
        type: "spring",
        bounce: 0.3,
        delay: 0.3
      }
    }
  };

  const shapeVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0 
    },
    visible: { 
      opacity: 1,
      scale: 1,
      rotate: 360,
      transition: { 
        duration: 1,
        ease: "easeOut",
        rotate: { 
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }
      }
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "75vh",
        gap: "20px"
      }}
    >
      <motion.div
        variants={shapeVariants}
        animate="pulse"
        style={{
          marginTop: '5px',
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          background: "linear-gradient(45deg, #4F46E5, #E11D48)",
          boxShadow: "0 0 20px rgba(79, 70, 229, 0.5)",
          flexShrink: 0
        }}
      />
      <motion.div
        variants={textVariants}
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.8 }
        }}
      >
        <Text 
          size="50px" 
          fw={700}
          style={{ 
            background: "linear-gradient(45deg, #4F46E5, #E11D48)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            whiteSpace: "nowrap"
          }}
        >
          Coming <br/> Soon
        </Text>
      </motion.div>
    </motion.div>
  );
}