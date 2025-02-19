import express, { Response } from "express";
import Cart from "../models/cart.model";
import { authenticateUser, AuthRequest } from "../middleware/auth.middleware";
import { calcDeliveryDateAndPrice } from "../utils/utils";

const router = express.Router();

/**
 * @route   GET /api/cart
 * @desc    Fetch the user's cart
 * @access  Private
 */
router.get("/", authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user?.userId }).populate(
      "items.product"
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
  } catch (error) {
    console.error("Cart Fetch Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/cart
 * @desc    Add an item to the user's cart
 * @access  Private
 */
router.post("/", authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const {
      product,
      name,
      slug,
      category,
      quantity,
      countInStock,
      image,
      price,
      size,
      color,
    } = req.body;

    let cart = await Cart.findOne({ user: req.user?.userId });

    if (!cart) {
      cart = new Cart({ user: req.user?.userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === product
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        user: req.user?.userId,
        product,
        name,
        slug,
        category,
        quantity,
        countInStock,
        image,
        price,
        size,
        color,
      });
    }

    const itemsArray = cart.items.map((item) => ({
      price: item.price,
      quantity: item.quantity,
    }));

    const priceDetails = await calcDeliveryDateAndPrice({ items: itemsArray });
    cart.totalPrice = priceDetails.totalPrice;

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error("Cart Add Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   PUT /api/cart
 * @desc    Update cart item quantity
 * @access  Private
 */
router.put("/:id", authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user?.userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item)
      return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;

    const itemsArray = cart.items.map((item) => ({
      price: item.price,
      quantity: item.quantity,
    }));

    const priceDetails = await calcDeliveryDateAndPrice({ items: itemsArray });
    cart.totalPrice = priceDetails.totalPrice;

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("Cart Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   DELETE /api/cart/:id
 * @desc    Remove a single item from cart
 * @access  Private
 */
router.delete(
  "/:id",
  authenticateUser,
  async (req: AuthRequest, res: Response) => {
    try {
      const cart = await Cart.findOne({ user: req.user?.userId });

      if (!cart) return res.status(404).json({ message: "Cart not found" });

      cart.items.pull({ product: req.params.id });

      // ✅ Ensure cart.items is converted to a plain array before mapping
      const itemsArray = cart.items
        .toObject()
        .map((item: { price: number; quantity: number }) => ({
          price: item.price,
          quantity: item.quantity,
        }));

      const priceDetails = await calcDeliveryDateAndPrice({
        items: itemsArray,
      });

      cart.totalPrice = priceDetails.totalPrice;

      await cart.save();
      res.json(cart);
    } catch (error) {
      console.error("Cart Remove Item Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @route   DELETE /api/cart
 * @desc    Clear entire cart
 * @access  Private
 */
router.delete(
  "/",
  authenticateUser,
  async (req: AuthRequest, res: Response) => {
    try {
      await Cart.findOneAndDelete({ user: req.user?.userId });
      res.json({ message: "Cart cleared" });
    } catch (error) {
      console.error("Cart Clear Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
