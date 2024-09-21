const express = require("express");
const router = express.Router();
const customerControllers = require("../controllers/customerControllers.js");

router.get("/", customerControllers.homepage);

router.get("/add", customerControllers.addCustomer);
router.post("/add", customerControllers.postCustomer);
router.get("/view/:id", customerControllers.viewCustomer);
router.get("/edit/:id", customerControllers.edit);
router.put("/edit/:id", customerControllers.editPost);
router.delete("/delete/:id", customerControllers.deleteCustomer);

router.post("/search", customerControllers.searchCustomers);

module.exports = router;
