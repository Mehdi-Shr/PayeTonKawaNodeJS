const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI_ORDER);

const dbName = "order_db";

const customerData = [
  {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.coms",
    phone: "0623456789",
  },
  {
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    phone: "0698765432",
  },
  {
    first_name: "Michael",
    last_name: "Johnson",
    email: "michael.johnson@example.com",
    phone: "0676543210",
  },
  {
    first_name: "Emily",
    last_name: "Brown",
    email: "emily.brown@example.com",
    phone: "0665432198",
  },
];

const orderData = [
  {
    customer_id: "1",
    products: [
      { product_id: "1", product_quantity: 2 }
    ],
    order_amount: 25.98
  },
  {
    customer_id: "2",
    products: [
      { product_id: "2", product_quantity: 1 }
    ],
    order_amount: 199.99
  },
  {
    customer_id: "3",
    products: [
      { product_id: "3", product_quantity: 1 }
    ],
    order_amount: 49.99
  },
  {
    customer_id: "4",
    products: [
      { product_id: "4", product_quantity: 4 }
    ],
    order_amount: 31.96
  },
  {
    customer_id: "1",
    products: [
      { product_id: "2", product_quantity: 1 }
    ],
    order_amount: 199.99
  }
];

const productData = [
  {
    product_name: "Coffee Beans",
    product_description: "High-quality coffee beans from Colombia",
    product_price: 12.99,
    product_stock: 100,
    product_category: "Beverages",
  },
  {
    product_name: "Espresso Machine",
    product_description: "Professional espresso machine for home use",
    product_price: 199.99,
    product_stock: 30,
    product_category: "Appliances",
  },
  {
    product_name: "Coffee Grinder",
    product_description: "Adjustable coffee grinder for perfect grind",
    product_price: 49.99,
    product_stock: 50,
    product_category: "Accessories",
  },
  {
    product_name: "Mug",
    product_description: "Ceramic mug for your favorite coffee",
    product_price: 7.99,
    product_stock: 200,
    product_category: "Tableware",
  },
];

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);

    // Liste des collections à supprimer
    const collectionsToDrop = ["customers", "products", "orders"];

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
    const customersCollection = db.collection("customers");
    const customerResult = await customersCollection.insertMany(customerData);
    console.log(`${customerResult.insertedCount} customers inserted`);

    const productsCollection = db.collection("products");
    const productResult = await productsCollection.insertMany(productData);
    console.log(`${productResult.insertedCount} products inserted`);

    const ordersCollection = db.collection("orders");
    const orderResult = await ordersCollection.insertMany(orderData);
    console.log(`${orderResult.insertedCount} orders inserted`);
  } catch (err) {
    console.error("Error occurred while initializing database", err);
  } finally {
    await client.close();
  }
}

run();
