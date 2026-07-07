"use client";
import { motion } from "framer-motion";

export default function FadeUp({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} /* Jarak luncur diperpendek (dari 40 ke 20) */
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, delay: delay, ease: "easeOut" }} /* Dipercepat ke 0.3s */
      className={className}
    >
      {children}
    </motion.div>
  );
}