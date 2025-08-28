const express = require("express");
const connection = require("./config/db");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const orderRoutes = require("./routes/order.routes");
const cors = require("cors"); 

const app = express();
// Middleware
app.use(cors());        
app.use(express.json());

// Connect to DB
connection();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
