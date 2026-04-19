/**
 * Tabela unificada de símbolos por face.
 * Todos os dados (D6, D10, D12) compartilham a mesma progressão:
 *
 * Face  1: —       (Vazia)
 * Face  2: —       (Vazia)
 * Face  3: C       (1 Pressão)
 * Face  4: C       (1 Pressão)
 * Face  5: B+C     (1 Adaptação + 1 Pressão)
 * Face  6: A       (1 Sucesso)
 * Face  7: A+A     (2 Sucessos)
 * Face  8: A+B     (1 Sucesso + 1 Adaptação)
 * Face  9: A+B+C   (1 Sucesso + 1 Adaptação + 1 Pressão)
 * Face 10: A+A+C   (2 Sucessos + 1 Pressão)
 * Face 11: A+B+B+C (1 Sucesso + 2 Adaptações + 1 Pressão)
 * Face 12: C+C     (2 Pressões)
 */
const FACE_SYMBOLS = [
    { a: 0, b: 0, c: 0 },  // face  1: —
    { a: 0, b: 0, c: 0 },  // face  2: —
    { a: 0, b: 0, c: 1 },  // face  3: C
    { a: 0, b: 0, c: 1 },  // face  4: C
    { a: 0, b: 1, c: 1 },  // face  5: B+C
    { a: 1, b: 0, c: 0 },  // face  6: A
    { a: 2, b: 0, c: 0 },  // face  7: A+A
    { a: 1, b: 1, c: 0 },  // face  8: A+B
    { a: 1, b: 1, c: 1 },  // face  9: A+B+C
    { a: 2, b: 0, c: 1 },  // face 10: A+A+C
    { a: 1, b: 2, c: 1 },  // face 11: A+B+B+C
    { a: 0, b: 0, c: 2 },  // face 12: C+C
];

export const D6_FACES  = FACE_SYMBOLS.slice(0, 6);   // faces 1–6
export const D10_FACES = FACE_SYMBOLS.slice(0, 10);  // faces 1–10
export const D12_FACES = FACE_SYMBOLS;               // faces 1–12
