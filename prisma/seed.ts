import { PrismaClient, USER_ROLE, PAYMENT_STATUS, ORDER_STATUS } from "../prisma/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data (optional - uncomment if you want to start fresh)
  // await prisma.orderItem.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.productVariant.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.category.deleteMany();
  // await prisma.session.deleteMany();
  // await prisma.account.deleteMany();
  // await prisma.user.deleteMany();

  // Create Users
  console.log("👥 Creating users...");
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@karnika.com" },
      update: {},
      create: {
        id: "user_admin_001",
        name: "Admin User",
        email: "admin@karnika.com",
        emailVerified: true,
        role: USER_ROLE.ADMIN,
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: "john.doe@example.com" },
      update: {},
      create: {
        id: "user_customer_001",
        name: "John Doe",
        email: "john.doe@example.com",
        emailVerified: true,
        role: USER_ROLE.USER,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: "jane.smith@example.com" },
      update: {},
      create: {
        id: "user_customer_002",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        emailVerified: true,
        role: USER_ROLE.USER,
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: "mike.wilson@example.com" },
      update: {},
      create: {
        id: "user_customer_003",
        name: "Mike Wilson",
        email: "mike.wilson@example.com",
        emailVerified: false,
        role: USER_ROLE.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  // Create Categories
  console.log("📂 Creating categories...");
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: {
        name: "Electronics",
        slug: "electronics",
        description: "Latest electronic gadgets and devices",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.category.upsert({
      where: { slug: "clothing" },
      update: {},
      create: {
        name: "Clothing",
        slug: "clothing",
        description: "Fashion and apparel for all occasions",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.category.upsert({
      where: { slug: "books" },
      update: {},
      create: {
        name: "Books",
        slug: "books",
        description: "Books for learning and entertainment",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.category.upsert({
      where: { slug: "home-garden" },
      update: {},
      create: {
        name: "Home & Garden",
        slug: "home-garden",
        description: "Everything for your home and garden",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.category.upsert({
      where: { slug: "sports-fitness" },
      update: {},
      create: {
        name: "Sports & Fitness",
        slug: "sports-fitness",
        description: "Equipment for sports and fitness activities",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  // Create Products
  console.log("📦 Creating products...");
  const products = [];

  // Electronics Products
  const electronicsProducts = [
    {
      name: "iPhone 15 Pro",
      slug: "iphone-15-pro",
      description: "Latest iPhone with titanium design and powerful A17 Pro chip",
      images: [
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
      ],
      categoryId: categories[0].id,
      variants: [
        {
          variantName: "128GB Natural Titanium",
          price: 134900,
          stock: 25,
          attributes: { storage: "128GB", color: "Natural Titanium" },
          isDefault: true,
        },
        {
          variantName: "256GB Blue Titanium",
          price: 144900,
          stock: 15,
          attributes: { storage: "256GB", color: "Blue Titanium" },
        },
        {
          variantName: "512GB White Titanium",
          price: 164900,
          stock: 10,
          attributes: { storage: "512GB", color: "White Titanium" },
        },
      ],
    },
    {
      name: "MacBook Air M2",
      slug: "macbook-air-m2",
      description: "Lightweight laptop with M2 chip and stunning Retina display",
      images: [
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600",
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
      ],
      categoryId: categories[0].id,
      variants: [
        {
          variantName: "8GB RAM 256GB SSD Silver",
          price: 119900,
          stock: 20,
          attributes: { ram: "8GB", storage: "256GB", color: "Silver" },
          isDefault: true,
        },
        {
          variantName: "16GB RAM 512GB SSD Space Gray",
          price: 149900,
          stock: 12,
          attributes: { ram: "16GB", storage: "512GB", color: "Space Gray" },
        },
      ],
    },
    {
      name: "Samsung Galaxy Watch 6",
      slug: "samsung-galaxy-watch-6",
      description: "Advanced smartwatch with health monitoring and GPS",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
      ],
      categoryId: categories[0].id,
      variants: [
        {
          variantName: "40mm Graphite",
          price: 29900,
          stock: 30,
          attributes: { size: "40mm", color: "Graphite" },
          isDefault: true,
        },
        {
          variantName: "44mm Silver",
          price: 32900,
          stock: 25,
          attributes: { size: "44mm", color: "Silver" },
        },
      ],
    },
  ];

  // Clothing Products
  const clothingProducts = [
    {
      name: "Premium Cotton T-Shirt",
      slug: "premium-cotton-t-shirt",
      description: "Comfortable 100% cotton t-shirt with modern fit",
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600",
      ],
      categoryId: categories[1].id,
      variants: [
        {
          variantName: "Medium Black",
          price: 1299,
          stock: 50,
          attributes: { size: "M", color: "Black" },
          isDefault: true,
        },
        {
          variantName: "Large White",
          price: 1299,
          stock: 40,
          attributes: { size: "L", color: "White" },
        },
        {
          variantName: "Small Navy",
          price: 1299,
          stock: 35,
          attributes: { size: "S", color: "Navy" },
        },
      ],
    },
    {
      name: "Designer Jeans",
      slug: "designer-jeans",
      description: "Premium denim jeans with perfect fit and style",
      images: [
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600",
      ],
      categoryId: categories[1].id,
      variants: [
        {
          variantName: "32 Waist Dark Blue",
          price: 3999,
          stock: 25,
          attributes: { waist: "32", color: "Dark Blue" },
          isDefault: true,
        },
        {
          variantName: "34 Waist Light Blue",
          price: 3999,
          stock: 20,
          attributes: { waist: "34", color: "Light Blue" },
        },
      ],
    },
  ];

  // Books Products
  const booksProducts = [
    {
      name: "The Complete Guide to Programming",
      slug: "complete-guide-programming",
      description: "Comprehensive guide to modern programming techniques",
      images: [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600",
      ],
      categoryId: categories[2].id,
      variants: [
        {
          variantName: "Paperback",
          price: 899,
          stock: 100,
          attributes: { format: "Paperback" },
          isDefault: true,
        },
        {
          variantName: "Hardcover",
          price: 1299,
          stock: 50,
          attributes: { format: "Hardcover" },
        },
      ],
    },
  ];

  // Home & Garden Products
  const homeProducts = [
    {
      name: "Ceramic Plant Pot Set",
      slug: "ceramic-plant-pot-set",
      description: "Beautiful ceramic pots perfect for indoor plants",
      images: [
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600",
      ],
      categoryId: categories[3].id,
      variants: [
        {
          variantName: "Set of 3 White",
          price: 1599,
          stock: 40,
          attributes: { count: "3", color: "White" },
          isDefault: true,
        },
        {
          variantName: "Set of 5 Terra Cotta",
          price: 2499,
          stock: 25,
          attributes: { count: "5", color: "Terra Cotta" },
        },
      ],
    },
  ];

  // Sports Products
  const sportsProducts = [
    {
      name: "Professional Yoga Mat",
      slug: "professional-yoga-mat",
      description: "Non-slip yoga mat perfect for all types of exercise",
      images: [
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
      ],
      categoryId: categories[4].id,
      variants: [
        {
          variantName: "6mm Purple",
          price: 2499,
          stock: 30,
          attributes: { thickness: "6mm", color: "Purple" },
          isDefault: true,
        },
        {
          variantName: "8mm Blue",
          price: 2899,
          stock: 25,
          attributes: { thickness: "8mm", color: "Blue" },
        },
      ],
    },
  ];

  const allProducts = [
    ...electronicsProducts,
    ...clothingProducts,
    ...booksProducts,
    ...homeProducts,
    ...sportsProducts,
  ];

  for (const productData of allProducts) {
    const { variants, ...productInfo } = productData;
    const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);

    const product = await prisma.product.upsert({
      where: { slug: productInfo.slug },
      update: {},
      create: {
        ...productInfo,
        totalStock,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create variants for this product
    for (const variantData of variants) {
      await prisma.productVariant.upsert({
        where: {
          id: `${product.id}_${variantData.variantName.replace(/\s+/g, '_').toLowerCase()}`,
        },
        update: {},
        create: {
          id: `${product.id}_${variantData.variantName.replace(/\s+/g, '_').toLowerCase()}`,
          productId: product.id,
          ...variantData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    products.push(product);
  }

  // Create Sample Orders with spread out dates for better lifetime graph
  console.log("🛒 Creating orders...");
  const now = new Date();
  const orderData = [
    // Orders from 6 months ago
    {
      userId: users[1].id, // John Doe
      items: [
        {
          productId: products[4].id, // Designer Jeans
          variantName: "32 Waist Dark Blue",
          quantity: 1,
          price: 3999,
          productName: "Designer Jeans",
        },
      ],
      totalAmount: 3999,
      paymentStatus: PAYMENT_STATUS.SUCCESS,
      orderStatus: ORDER_STATUS.DELIVERED,
      address: "123 Main St, Mumbai, Maharashtra 400001",
      phone: "+91 9876543210",
      paymentMethod: "razorpay",
      razorpayOrderId: "order_test_001",
      razorpayPaymentId: "pay_test_001",
      paymentCapturedAt: new Date(now.getFullYear(), now.getMonth() - 6, 15),
      createdAt: new Date(now.getFullYear(), now.getMonth() - 6, 15),
    },
    // Orders from 4 months ago
    {
      userId: users[2].id, // Jane Smith
      items: [
        {
          productId: products[3].id, // T-Shirt
          variantName: "Medium Black",
          quantity: 3,
          price: 1299,
          productName: "Premium Cotton T-Shirt",
        },
        {
          productId: products[5].id, // Book
          variantName: "Paperback",
          quantity: 1,
          price: 899,
          productName: "The Complete Guide to Programming",
        },
      ],
      totalAmount: 4796,
      paymentStatus: PAYMENT_STATUS.SUCCESS,
      orderStatus: ORDER_STATUS.DELIVERED,
      address: "456 Park Avenue, Delhi, Delhi 110001",
      phone: "+91 9876543211",
      paymentMethod: "razorpay",
      razorpayOrderId: "order_test_002",
      razorpayPaymentId: "pay_test_002",
      paymentCapturedAt: new Date(now.getFullYear(), now.getMonth() - 4, 10),
      createdAt: new Date(now.getFullYear(), now.getMonth() - 4, 10),
    },
    // Orders from 3 months ago
    {
      userId: users[1].id, // John Doe
      items: [
        {
          productId: products[2].id, // Samsung Watch
          variantName: "40mm Graphite",
          quantity: 1,
          price: 29900,
          productName: "Samsung Galaxy Watch 6",
        },
      ],
      totalAmount: 29900,
      paymentStatus: PAYMENT_STATUS.SUCCESS,
      orderStatus: ORDER_STATUS.DELIVERED,
      address: "123 Main St, Mumbai, Maharashtra 400001",
      phone: "+91 9876543210",
      paymentMethod: "razorpay",
      razorpayOrderId: "order_test_003",
      razorpayPaymentId: "pay_test_003",
      paymentCapturedAt: new Date(now.getFullYear(), now.getMonth() - 3, 5),
      createdAt: new Date(now.getFullYear(), now.getMonth() - 3, 5),
    },
    // Orders from 2 months ago
    {
      userId: users[2].id, // Jane Smith
      items: [
        {
          productId: products[1].id, // MacBook
          variantName: "8GB RAM 256GB SSD Silver",
          quantity: 1,
          price: 119900,
          productName: "MacBook Air M2",
        },
      ],
      totalAmount: 119900,
      paymentStatus: PAYMENT_STATUS.SUCCESS,
      orderStatus: ORDER_STATUS.DELIVERED,
      address: "456 Park Avenue, Delhi, Delhi 110001",
      phone: "+91 9876543211",
      paymentMethod: "razorpay",
      razorpayOrderId: "order_test_004",
      razorpayPaymentId: "pay_test_004",
      paymentCapturedAt: new Date(now.getFullYear(), now.getMonth() - 2, 20),
      createdAt: new Date(now.getFullYear(), now.getMonth() - 2, 20),
    },
    // Orders from 1 month ago
    {
      userId: users[3].id, // Mike Wilson
      items: [
        {
          productId: products[6].id, // Yoga Mat
          variantName: "6mm Purple",
          quantity: 2,
          price: 2499,
          productName: "Professional Yoga Mat",
        },
        {
          productId: products[7].id, // Plant Pot
          variantName: "Set of 3 White",
          quantity: 1,
          price: 1599,
          productName: "Ceramic Plant Pot Set",
        },
      ],
      totalAmount: 6597,
      paymentStatus: PAYMENT_STATUS.SUCCESS,
      orderStatus: ORDER_STATUS.DELIVERED,
      address: "789 Garden Road, Bangalore, Karnataka 560001",
      phone: "+91 9876543212",
      paymentMethod: "razorpay",
      razorpayOrderId: "order_test_005",
      razorpayPaymentId: "pay_test_005",
      paymentCapturedAt: new Date(now.getFullYear(), now.getMonth() - 1, 8),
      createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 8),
    },
    // Recent orders (this month)
    {
      userId: users[1].id, // John Doe
      items: [
        {
          productId: products[0].id, // iPhone
          variantName: "128GB Natural Titanium",
          quantity: 1,
          price: 134900,
          productName: "iPhone 15 Pro",
        },
        {
          productId: products[3].id, // T-Shirt
          variantName: "Medium Black",
          quantity: 2,
          price: 1299,
          productName: "Premium Cotton T-Shirt",
        },
      ],
      totalAmount: 137498,
      paymentStatus: PAYMENT_STATUS.SUCCESS,
      orderStatus: ORDER_STATUS.DELIVERED,
      address: "123 Main St, Mumbai, Maharashtra 400001",
      phone: "+91 9876543210",
      paymentMethod: "razorpay",
      razorpayOrderId: "order_test_006",
      razorpayPaymentId: "pay_test_006",
      paymentCapturedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      userId: users[2].id, // Jane Smith
      items: [
        {
          productId: products[2].id, // Samsung Watch
          variantName: "44mm Silver",
          quantity: 1,
          price: 32900,
          productName: "Samsung Galaxy Watch 6",
        },
      ],
      totalAmount: 32900,
      paymentStatus: PAYMENT_STATUS.SUCCESS,
      orderStatus: ORDER_STATUS.SHIPPED,
      address: "456 Park Avenue, Delhi, Delhi 110001",
      phone: "+91 9876543211",
      paymentMethod: "razorpay",
      razorpayOrderId: "order_test_007",
      razorpayPaymentId: "pay_test_007",
      paymentCapturedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    // Pending order (current)
    {
      userId: users[3].id, // Mike Wilson
      items: [
        {
          productId: products[1].id, // MacBook
          variantName: "16GB RAM 512GB SSD Space Gray",
          quantity: 1,
          price: 149900,
          productName: "MacBook Air M2",
        },
      ],
      totalAmount: 149900,
      paymentStatus: PAYMENT_STATUS.PENDING,
      orderStatus: ORDER_STATUS.PENDING,
      address: "789 Garden Road, Bangalore, Karnataka 560001",
      phone: "+91 9876543212",
      paymentMethod: "cod",
      createdAt: new Date(),
    },
  ];

  for (const orderInfo of orderData) {
    const { items, ...orderDetails } = orderInfo;

    const order = await prisma.order.create({
      data: {
        ...orderDetails,
        updatedAt: orderDetails.createdAt || new Date(),
      },
    });

    // Create order items
    for (const item of items) {
      // Find the variant ID
      const variant = await prisma.productVariant.findFirst({
        where: {
          productId: item.productId,
          variantName: item.variantName,
        },
      });

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          variantId: variant?.id,
          quantity: item.quantity,
          price: item.price,
          productName: item.productName,
          variantName: item.variantName,
        },
      });
    }
  }

  console.log("✅ Database seeding completed successfully!");
  console.log(`Created ${users.length} users`);
  console.log(`Created ${categories.length} categories`);
  console.log(`Created ${products.length} products`);
  console.log(`Created ${orderData.length} orders`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
