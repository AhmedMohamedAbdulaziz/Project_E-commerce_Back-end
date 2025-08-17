const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const allowTo = require("../middlewares/allowedTo");

router
  .route("/")
  .get(allowTo("admin"), categoryController.getCategories)
  .post(allowTo("admin"), categoryController.createCategory);
router
  .route("/:id")
  .get(allowTo("admin"), categoryController.getCategoryById)
  .put(allowTo("admin"), categoryController.updateCategory)
  .delete(allowTo("admin"), categoryController.deleteCategory);
module.exports = router;
// app.use('/api/categories', categoryRoutes);
