const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI_PRODUCT);

const dbName = "product_db";

// IDs spécifiques à utiliser
const ids = {
  customers: {
    "John Doe": "64fbbf1d5d2071d6a5d9e2e7",
    "Jane Smith": "64fbbf1d5d2071d6a5d9e2e8",
    "Michael Johnson": "64fbbf1d5d2071d6a5d9e2e9",
    "Emily Brown": "64fbbf1d5d2071d6a5d9e2ea",
  },
  products: {
    "Coffee Beans": "64fbbf1d5d2071d6a5d9e2eb",
    "Espresso Machine": "64fbbf1d5d2071d6a5d9e2ec",
    "Coffee Grinder": "64fbbf1d5d2071d6a5d9e2ed",
    "Mug": "64fbbf1d5d2071d6a5d9e2ee",
  },
  orders: {
    "Order 1": "64fbbf1d5d2071d6a5d9e2ef",
    "Order 2": "64fbbf1d5d2071d6a5d9e2f0",
    "Order 3": "64fbbf1d5d2071d6a5d9e2f1",
    "Order 4": "64fbbf1d5d2071d6a5d9e2f2",
    "Order 5": "64fbbf1d5d2071d6a5d9e2f3",
  },
};

const customerData = [
  {
    _id: new ObjectId(ids.customers["John Doe"]),
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "0623456789",
  },
  {
    _id: new ObjectId(ids.customers["Jane Smith"]),
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    phone: "0698765432",
  },
  {
    _id: new ObjectId(ids.customers["Michael Johnson"]),
    first_name: "Michael",
    last_name: "Johnson",
    email: "michael.johnson@example.com",
    phone: "0676543210",
  },
  {
    _id: new ObjectId(ids.customers["Emily Brown"]),
    first_name: "Emily",
    last_name: "Brown",
    email: "emily.brown@example.com",
    phone: "0665432198",
  },
];

const productData = [
  {
    _id: new ObjectId(ids.products["Coffee Beans"]),
    product_name: "Coffee Beans",
    product_description: "High-quality coffee beans from Colombia",
    product_price: 12.99,
    product_stock: 100,
    product_category: "Beverages",
  },
  {
    _id: new ObjectId(ids.products["Espresso Machine"]),
    product_name: "Espresso Machine",
    product_description: "Professional espresso machine for home use",
    product_price: 199.99,
    product_stock: 30,
    product_category: "Appliances",
  },
  {
    _id: new ObjectId(ids.products["Coffee Grinder"]),
    product_name: "Coffee Grinder",
    product_description: "Adjustable coffee grinder for perfect grind",
    product_price: 49.99,
    product_stock: 50,
    product_category: "Accessories",
  },
  {
    _id: new ObjectId(ids.products["Mug"]),
    product_name: "Mug",
    product_description: "Ceramic mug for your favorite coffee",
    product_price: 7.99,
    product_stock: 200,
    product_category: "Tableware",
  },
];

const orderData = [
  {
    _id: new ObjectId(ids.orders["Order 1"]),
    customer_id: new ObjectId(ids.customers["John Doe"]),
    products: [
      { product_id: new ObjectId(ids.products["Coffee Beans"]), product_quantity: 2 }
    ],
    order_amount: 25.98
  },
  {
    _id: new ObjectId(ids.orders["Order 2"]),
    customer_id: new ObjectId(ids.customers["Jane Smith"]),
    products: [
      { product_id: new ObjectId(ids.products["Espresso Machine"]), product_quantity: 1 }
    ],
    order_amount: 199.99
  },
  {
    _id: new ObjectId(ids.orders["Order 3"]),
    customer_id: new ObjectId(ids.customers["Michael Johnson"]),
    products: [
      { product_id: new ObjectId(ids.products["Coffee Grinder"]), product_quantity: 1 }
    ],
    order_amount: 49.99
  },
  {
    _id: new ObjectId(ids.orders["Order 4"]),
    customer_id: new ObjectId(ids.customers["Emily Brown"]),
    products: [
      { product_id: new ObjectId(ids.products["Mug"]), product_quantity: 4 }
    ],
    order_amount: 31.96
  },
  {
    _id: new ObjectId(ids.orders["Order 5"]),
    customer_id: new ObjectId(ids.customers["John Doe"]),
    products: [
      { product_id: new ObjectId(ids.products["Espresso Machine"]), product_quantity: 1 }
    ],
    order_amount: 199.99
  }
];

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);

    // Liste des collections à supprimer
    const collectionsToDrop = ["products"];

    // Supprimer les collections existantes
    for (const collectionName of collectionsToDrop) {
      const collection = db.collection(collectionName);
      const collectionExists = (await collection.countDocuments()) > 0;

      if (collectionExists) {
        console.log(`Dropping collection: ${collectionName}`);
        await collection.drop();
        console.log(`Collection ${collectionName} dropped`);
      }
    }

    // Insérer les données
    const productsCollection = db.collection("products");
    const productResult = await productsCollection.insertMany(productData);
    console.log(`${productResult.insertedCount} products inserted`);
  } catch (err) {
    console.error("Error occurred while initializing database", err);
  } finally {
    await client.close();
  }
}

run();
