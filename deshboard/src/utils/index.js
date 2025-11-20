// src/utils/utils.js OR src/utils/index.js
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
