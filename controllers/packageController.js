/**
 * Package Controller
 * Handles API requests for package CRUD operations
 */
const packageModel = require("../models/packageModel");
const crypto = require("crypto");
const axios = require("axios");
const Package = require("../models/Package");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const { PAYSTACK_SECRET_KEY, CLIENT_BASE_URL } = process.env;

exports.createPackage = async (req, res, next) => {
  try {
    const packageData = req.body;

    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findByPk(req.user.id, { include: "subscription" });

    // Check if subscription has expired
    if (
      user.subscriptionStatus === "active" &&
      new Date() > user.subscriptionExpiresAt
    ) {
      user.subscriptionStatus = "none";
      user.subscriptionExpiresAt = null;
      await user.save();
    }

    let price = 7000;

    // First-time user discount
    const sentPackagesCount = await Package.count({
      where: { userId: user.id },
    });

    if (sentPackagesCount === 0) {
      price = 4500;
    } else if (
      user.subscriptionStatus === "active" &&
      user.subscription.packagesUsed < 15
    ) {
      price = 4500;
    }

    packageData.userId = user.id;
    packageData.price = price;
    packageData.status = "unpaid";

    const newPackage = await packageModel.createPackage(packageData);

    // Format packageCode (e.g., PKG-001)
    const formattedCode = `PKG-${String(newPackage.id).padStart(3, "0")}`;
    await newPackage.update({ packageCode: formattedCode });

    res.status(201).json({
      success: true,
      message: "Package created successfully. Payment required.",
      package: newPackage,
    });
  } catch (err) {
    console.error("Create package error:", err);
    next(err);
  }
};
/**
 * Get Package Controller
 * Returns a specific package by ID
 */
exports.getPackage = (req, res, next) => {
  try {
    const { id } = req.params;

    // Find package by ID
    const packageData = packageModel.findById(id);

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    // Check authorization if not admin (user can only view their own packages)
    if (
      req.user &&
      req.user.role !== "admin" &&
      packageData.userId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this package",
      });
    }

    // Return package data
    res.status(200).json({
      success: true,
      package: packageData,
    });
  } catch (err) {
    console.error("Get package error:", err);
    next(err);
  }
};

/**
 * Get User Packages Controller
 * Returns all packages for the authenticated user
 */
exports.getUserPackages = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Await the async function
    const packages = await packageModel.findByUserId(userId);

    res.status(200).json({
      success: true,
      count: packages.length,
      packages,
    });
  } catch (err) {
    console.error("Get user packages error:", err);
    next(err);
  }
};

/**
 * Get All Packages Controller (Admin only)
 * Returns all packages in the system
 */
exports.getAllPackages = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access all packages",
      });
    }

    // Await the async function
    const packages = await packageModel.getAllPackages();

    res.status(200).json({
      success: true,
      count: packages.length,
      packages,
    });
  } catch (err) {
    console.error("Get all packages error:", err);
    next(err);
  }
};
/**
 * Update Package Controller
 * Updates an existing package
 */
exports.updatePackage = (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find package by ID
    const existingPackage = packageModel.findById(id);

    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    // Check authorization if not admin (user can only update their own packages)
    if (
      req.user &&
      req.user.role !== "admin" &&
      existingPackage.userId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this package",
      });
    }

    // Update the package
    const updatedPackage = packageModel.updatePackage(id, updateData);

    // Return success response
    res.status(200).json({
      success: true,
      message: "Package updated successfully",
      package: updatedPackage,
    });
  } catch (err) {
    console.error("Update package error:", err);
    next(err);
  }
};

/**
 * Delete Package Controller
 * Deletes an existing package
 */
exports.deletePackage = (req, res, next) => {
  try {
    const { id } = req.params;

    // Find package by ID
    const existingPackage = packageModel.findById(id);

    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    // Check authorization if not admin (user can only delete their own packages)
    if (
      req.user &&
      req.user.role !== "admin" &&
      existingPackage.userId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this package",
      });
    }

    // Delete the package
    const isDeleted = packageModel.deletePackage(id);

    if (!isDeleted) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete package",
      });
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (err) {
    console.error("Delete package error:", err);
    next(err);
  }
};

exports.initiatePackagePayment = async (req, res, next) => {
  try {
    const packageId = req.params.id;
    const userId = req.user.id;

    const pkg = await Package.findOne({ where: { id: packageId, userId } });
    if (!pkg)
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });
    if (pkg.paymentStatus === "paid")
      return res
        .status(400)
        .json({ success: false, message: "Package already paid for" });

    const paystackData = {
      email: req.user.email,
      amount: pkg.cost * 100, // Paystack expects amount in kobo
      metadata: {
        packageId: pkg.id,
      },
      callback_url: `${CLIENT_BASE_URL}/payment-success`,
    };

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      paystackData,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reference = response.data.data.reference;

    await pkg.update({ paystackReference: reference });

    res.status(200).json({
      success: true,
      message: "Payment initialized",
      authorization_url: response.data.data.authorization_url,
    });
  } catch (err) {
    console.error("Error initiating Paystack payment:", err);
    next(err);
  }
};

exports.handlePaystackWebhook = async (req, res) => {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(401).send("Invalid signature");
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const metadata = event.data.metadata;
    const reference = event.data.reference;

    if (metadata.type === "package") {
      const pkg = await Package.findOne({
        where: { id: metadata.packageId, paystackReference: reference },
      });

      if (pkg && pkg.status !== "paid") {
        pkg.status = "paid";
        await pkg.save();

        // If user is subscribed, update usage
        const user = await User.findByPk(pkg.userId);
        if (user.subscriptionStatus === "active") {
          const subscription = await Subscription.findOne({
            where: { userId: user.id },
          });
          if (subscription && subscription.packagesUsed < 15) {
            subscription.packagesUsed += 1;
            await subscription.save();
          }
        }
      }
    }
  }

  res.sendStatus(200);
};
