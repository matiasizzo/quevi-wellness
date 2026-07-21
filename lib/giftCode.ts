// Genera códigos de vale legibles: QUEVI-XXXX-XXXX
// Alfabeto sin caracteres ambiguos (sin 0/O, 1/I, etc.)
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateGiftCode(): string {
  const block = () =>
    Array.from({ length: 4 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('')
  return `QUEVI-${block()}-${block()}`
}

/** Normaliza un código introducido por el usuario (mayúsculas, sin espacios) */
export function normalizeGiftCode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '')
}
