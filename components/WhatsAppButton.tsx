'use client'

import { motion } from 'framer-motion'

// Se puede sobreescribir con NEXT_PUBLIC_WHATSAPP_NUMBER (formato internacional, solo dígitos)
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '34683462705'

export default function WhatsAppButton() {
  const message = encodeURIComponent('Hola, me gustaría más información sobre QUEVI Wellness Clinic.')
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hablar por WhatsApp"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed left-4 bottom-4 sm:left-6 sm:bottom-6 z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-lg"
      style={{ background: '#25D366', boxShadow: '0 6px 24px -4px rgba(37,211,102,0.55)' }}
    >
      <span className="absolute inset-0 rounded-full animate-ping" style={{ background: '#25D366', opacity: 0.35 }} />
      <svg
        className="relative w-7 h-7"
        viewBox="0 0 24 24"
        fill="#ffffff"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.873.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.763.463 3.483 1.343 4.997L2 22l5.116-1.341a9.955 9.955 0 0 0 4.888 1.342h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.671-1.04-5.182-2.929-7.07a9.928 9.928 0 0 0-7.072-2.931zm0 18.194h-.003a8.28 8.28 0 0 1-4.226-1.157l-.303-.18-3.035.796.81-2.959-.198-.304a8.271 8.271 0 0 1-1.267-4.394c0-4.569 3.719-8.288 8.291-8.288a8.24 8.24 0 0 1 5.86 2.428 8.234 8.234 0 0 1 2.427 5.86c0 4.568-3.72 8.198-8.356 8.198z" />
      </svg>
    </motion.a>
  )
}
