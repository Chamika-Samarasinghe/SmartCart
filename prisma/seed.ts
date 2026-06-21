import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const categories = ["Vegetables", "Fruits", "Cakes", "Biscuits"];

const products = [
  // Vegetables
  {
    category: "Vegetables",
    name: "Fresh Broccoli",
    description: "Crisp, green broccoli florets packed with vitamins and minerals.",
    price: 2.49,
    imageUrl: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80",
  },
  {
    category: "Vegetables",
    name: "Organic Carrots",
    description: "Sweet, crunchy organic carrots, perfect for snacking or cooking.",
    price: 1.99,
    imageUrl: "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400&q=80",
  },
  {
    category: "Vegetables",
    name: "Cherry Tomatoes",
    description: "Juicy cherry tomatoes bursting with flavour, great for salads.",
    price: 3.29,
    imageUrl: "https://images.unsplash.com/photo-1561155707-37ac2cce0e63?w=400&q=80",
  },
  {
    category: "Vegetables",
    name: "Baby Spinach",
    description: "Tender baby spinach leaves, rich in iron and ready to eat.",
    price: 2.79,
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80",
  },

  // Fruits
  {
    category: "Fruits",
    name: "Alphonso Mangoes",
    description: "Premium Alphonso mangoes — sweet, creamy, and aromatic.",
    price: 6.99,
    imageUrl: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=80",
  },
  {
    category: "Fruits",
    name: "Strawberries",
    description: "Plump, ripe strawberries, perfect for desserts or eating fresh.",
    price: 4.49,
    imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80",
  },
  {
    category: "Fruits",
    name: "Blueberries",
    description: "Antioxidant-rich blueberries, great for smoothies and baking.",
    price: 5.29,
    imageUrl: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&q=80",
  },
  {
    category: "Fruits",
    name: "Green Grapes",
    description: "Seedless green grapes, chilled and refreshing.",
    price: 3.79,
    imageUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80",
  },

  // Cakes
  {
    category: "Cakes",
    name: "Chocolate Fudge Cake",
    description: "Rich, moist chocolate fudge cake with a velvety ganache frosting.",
    price: 18.99,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
  },
  {
    category: "Cakes",
    name: "Vanilla Sponge Cake",
    description: "Light and fluffy vanilla sponge layered with fresh cream and jam.",
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80",
  },
  {
    category: "Cakes",
    name: "Lemon Drizzle Cake",
    description: "Zesty lemon drizzle cake with a crispy sugar topping.",
    price: 13.49,
    imageUrl: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&q=80",
  },
  {
    category: "Cakes",
    name: "Red Velvet Cake",
    description: "Classic red velvet cake with cream cheese frosting.",
    price: 19.99,
    imageUrl: "https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=400&q=80",
  },

  // Biscuits
  {
    category: "Biscuits",
    name: "Butter Shortbread",
    description: "Melt-in-your-mouth Scottish butter shortbread, traditionally baked.",
    price: 3.99,
    imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
  },
  {
    category: "Biscuits",
    name: "Chocolate Digestives",
    description: "Crispy oat digestive biscuits half-dipped in milk chocolate.",
    price: 2.99,
    imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80",
  },
  {
    category: "Biscuits",
    name: "Ginger Snaps",
    description: "Spiced ginger snap biscuits with a satisfying crunch.",
    price: 2.49,
    imageUrl: "https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=400&q=80",
  },
  {
    category: "Biscuits",
    name: "Oatmeal Raisin Cookies",
    description: "Chewy oatmeal cookies packed with plump raisins.",
    price: 3.49,
    imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
  },
];

async function main() {
  console.log("Seeding database...");

  // Upsert categories
  const categoryMap: Record<string, number> = {};
  for (const name of categories) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categoryMap[name] = cat.id;
  }

  // Upsert products
  for (const p of products) {
    await prisma.product.upsert({
      where: {
        // Use a composite of name + categoryId as the stable identifier
        // Since Prisma requires a @unique field for upsert where clause, we rely on name uniqueness per seed run
        id: (await prisma.product.findFirst({ where: { name: p.name } }))?.id ?? 0,
      },
      update: {
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        categoryId: categoryMap[p.category],
      },
      create: {
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        categoryId: categoryMap[p.category],
      },
    });
  }

  // Seed a demo user
  await prisma.user.upsert({
    where: { email: "demo@smartcart.com" },
    update: {},
    create: {
      email: "demo@smartcart.com",
      name: "Demo User",
    },
  });

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
