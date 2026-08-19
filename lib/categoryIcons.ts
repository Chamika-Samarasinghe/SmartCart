import {
  LuLeaf,
  LuApple,
  LuCake,
  LuCookie,
  LuCupSoda,
  LuCoffee,
  LuMilk,
  LuPopcorn,
  LuFish,
  LuBeef,
  LuUtensils,
  LuPizza,
  LuCarrot,
  LuShoppingBag,
  LuPackage,
} from "react-icons/lu";
import type { IconType } from "react-icons";

export interface CategoryIconOption {
  id: string;
  name: string;
  Icon: IconType;
  color: string;
  bg: string;
}

export const CATEGORY_ICON_OPTIONS: CategoryIconOption[] = [
  { id: "LuCupSoda",     name: "Beverages / Drinks", Icon: LuCupSoda,     color: "text-blue-600",   bg: "bg-blue-50"   },
  { id: "LuCoffee",      name: "Coffee & Tea",       Icon: LuCoffee,      color: "text-amber-700",  bg: "bg-amber-50"  },
  { id: "LuLeaf",        name: "Vegetables",         Icon: LuLeaf,        color: "text-green-600",  bg: "bg-green-50"  },
  { id: "LuApple",       name: "Fruits",             Icon: LuApple,       color: "text-orange-500", bg: "bg-orange-50" },
  { id: "LuCake",        name: "Cakes & Bakery",     Icon: LuCake,        color: "text-pink-500",   bg: "bg-pink-50"   },
  { id: "LuCookie",      name: "Biscuits",           Icon: LuCookie,      color: "text-amber-600",  bg: "bg-amber-50"  },
  { id: "LuMilk",        name: "Dairy",              Icon: LuMilk,        color: "text-cyan-600",   bg: "bg-cyan-50"   },
  { id: "LuPopcorn",     name: "Snacks",             Icon: LuPopcorn,     color: "text-yellow-600", bg: "bg-yellow-50" },
  { id: "LuFish",        name: "Seafood",            Icon: LuFish,        color: "text-sky-600",    bg: "bg-sky-50"    },
  { id: "LuBeef",        name: "Meat & Poultry",     Icon: LuBeef,        color: "text-red-600",    bg: "bg-red-50"    },
  { id: "LuUtensils",    name: "Prepared Meals",     Icon: LuUtensils,    color: "text-purple-600", bg: "bg-purple-50" },
  { id: "LuPizza",       name: "Fast / Ready Food",  Icon: LuPizza,       color: "text-rose-600",   bg: "bg-rose-50"   },
  { id: "LuCarrot",      name: "Fresh Produce",      Icon: LuCarrot,      color: "text-emerald-600",bg: "bg-emerald-50"},
  { id: "LuShoppingBag", name: "Shopping General",   Icon: LuShoppingBag, color: "text-indigo-600", bg: "bg-indigo-50" },
  { id: "LuPackage",     name: "Pantry Essentials",  Icon: LuPackage,     color: "text-teal-600",   bg: "bg-teal-50"   },
];

const DEFAULT_ICON_OPTION = CATEGORY_ICON_OPTIONS.find((opt) => opt.id === "LuShoppingBag")!;

// Legacy mapping for fallback if no DB icon is stored
const LEGACY_NAME_MAP: Record<string, string> = {
  beverages: "LuCupSoda",
  drinks: "LuCupSoda",
  vegetables: "LuLeaf",
  fruits: "LuApple",
  cakes: "LuCake",
  biscuits: "LuCookie",
  dairy: "LuMilk",
  snacks: "LuPopcorn",
  seafood: "LuFish",
  meat: "LuBeef",
};

export function getCategoryStyle(iconId?: string | null, categoryName?: string): CategoryIconOption {
  if (iconId) {
    const found = CATEGORY_ICON_OPTIONS.find((opt) => opt.id === iconId);
    if (found) return found;
  }

  if (categoryName) {
    const legacyKey = LEGACY_NAME_MAP[categoryName.toLowerCase()];
    if (legacyKey) {
      const foundLegacy = CATEGORY_ICON_OPTIONS.find((opt) => opt.id === legacyKey);
      if (foundLegacy) return foundLegacy;
    }
  }

  return DEFAULT_ICON_OPTION;
}
