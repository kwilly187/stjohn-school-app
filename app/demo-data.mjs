export const products = [
  { name: "Saints Tee", price: 25, kind: "Apparel" },
  { name: "Saints Crewneck", price: 42, kind: "Apparel" },
  { name: "Saints Cap", price: 24, kind: "Accessories" },
  { name: "Saints Water Bottle", price: 19, kind: "Accessories" },
];

export const wishLists = [
  {
    name: "Classroom supplies",
    type: "Teachers",
    items: ["Dry-erase markers", "Copy paper", "Tissue boxes"],
  },
  {
    name: "Saints athletics",
    type: "Teams",
    items: ["Practice volleyballs", "Training cones", "Team towels"],
  },
];

/**
 * @template {Record<string, unknown>} T
 * @param {readonly T[]} items
 * @param {string} category
 * @param {keyof T} key
 * @returns {T[]}
 */
export function filterByCategory(items, category, key) {
  if (category === "All") return [...items];
  return items.filter((item) => item[key] === category);
}
