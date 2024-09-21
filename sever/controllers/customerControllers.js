const Customer = require("../models/Customer");
const mongoose = require("mongoose");

exports.homepage = async (req, res) => {
  const messages = await req.flash("info");

  const local = {
    title: "NodeJs",
    description: "Free NodeJs User Management System",
  };

  let perPage = 12;
  let page = req.query.page || 1;

  try {
    const customers = await Customer.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Customer.countDocuments({});

    res.render("index", {
      local,
      customers,
      current: page,
      pages: Math.ceil(count / perPage),
      messages,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.addCustomer = async (req, res) => {
  const local = {
    title: "Add New Customer - Node js",
    description: "Free user management system",
  };
  res.render("customer/add", { local });
};

exports.postCustomer = async (req, res) => {
  const { firstName, lastName, email, tel, details } = req.body;

  const newCustomer = new Customer({
    firstName,
    lastName,
    email,
    tel,
    details,
  });

  try {
    await newCustomer.save();
    await req.flash("info", "New customer has been added.");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

exports.viewCustomer = async (req, res) => {
  const local = {
    title: "View Customer - Node js",
    description: "Free user management system",
  };

  const userId = req.params.id;
  try {
    const customer = await Customer.findById(userId);
    res.render("customer/view", { local, customer });
  } catch (error) {
    console.log(error);
  }
};

exports.edit = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id });

    const local = {
      title: "Edit Customer Data",
      description: "Free NodeJs User Management System",
    };

    res.render("customer/edit", {
      local,
      customer,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.editPost = async (req, res) => {
  try {
    const { firstName, lastName, tel, email, details } = req.body;
    await Customer.findByIdAndUpdate(req.params.id, {
      firstName,
      lastName,
      tel,
      email,
      details,
      updatedAt: Date.now(),
    });
    await res.redirect(`/edit/${req.params.id}`);

    console.log("redirected");
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.deleteOne({ _id: req.params.id });
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

exports.searchCustomers = async (req, res) => {
  const local = {
    title: "Search Customer Data",
    description: "Free NodeJs User Management System",
  };

  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const customers = await Customer.find({
      $or: [
        { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      customers,
      local,
    });
  } catch (error) {
    console.log(error);
  }
};
