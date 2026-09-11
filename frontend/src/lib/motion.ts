export type RevealDirection = "up" | "left" | "right";

/** Alternates left/right entry per index for an editorial, less-uniform rhythm. */
export function asymmetricDirection(index: number): RevealDirection {
  return index % 2 === 0 ? "left" : "right";
}
