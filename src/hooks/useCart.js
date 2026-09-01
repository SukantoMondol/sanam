import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { totalProductQuantity } from "@/redux/features/productQuantitySlice";
import { trackAddToCart } from "@/utils/ga4Ecommerce";

const CART_STORAGE_KEY = "sanam_cart";

function getLocalCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCart(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

function calculateSummary(items) {
  const subTotal = items.reduce(
    (acc, item) => acc + (Number(item?.payable_price) || 0) * (Number(item?.quantity) || 1),
    0
  );
  const totalQty = items.reduce(
    (acc, item) => acc + (Number(item?.quantity) || 1),
    0
  );
  const deliveryCharge = subTotal >= 10 ? 0 : 0; // Standard free delivery in Kuwait or configured rule

  return {
    sub_total: subTotal,
    total: subTotal + deliveryCharge,
    total_quantity: totalQty,
    delivery_charge: deliveryCharge,
  };
}

const useCart = () => {
  const [cart, setCart] = useState(() => {
    const items = getLocalCart();
    return {
      cart: items,
      summary: calculateSummary(items),
    };
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const updateCartQuantity = useCallback(
    (items) => {
      const totalQty = items.reduce(
        (acc, item) => acc + (Number(item?.quantity) || 1),
        0
      );
      dispatch(totalProductQuantity(totalQty || 0));
    },
    [dispatch]
  );

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const items = getLocalCart();
      const summary = calculateSummary(items);
      const cartObj = { cart: items, summary };
      setCart(cartObj);
      updateCartQuantity(items);
    } finally {
      setLoading(false);
    }
  }, [updateCartQuantity]);

  // Function to add item to cart
  const addToCart = async (cartData) => {
    try {
      const items = getLocalCart();
      const prodId = cartData.product_id || cartData.id;
      const varId = cartData.variation_id || null;
      const qty = Number(cartData.quantity) || 1;

      const existingIndex = items.findIndex(
        (item) =>
          String(item.product_id || item.id) === String(prodId) &&
          String(item.variation_id || "") === String(varId || "")
      );

      let updatedItems;
      if (existingIndex > -1) {
        updatedItems = [...items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: (Number(updatedItems[existingIndex].quantity) || 0) + qty,
        };
      } else {
        const payablePrice =
          Number(cartData.payable_price) ||
          Number(cartData.price?.payable_price) ||
          Number(cartData.price) ||
          Number(cartData.retail_price) ||
          0;
        const originalPrice =
          Number(cartData.price?.price) ||
          Number(cartData.old_price) ||
          payablePrice;

        const newItem = {
          id: prodId,
          product_id: prodId,
          product_name:
            cartData.product_name || cartData.name || cartData.title || "Product",
          photo: cartData.photo || cartData.image || "/assets/images/logo.png",
          payable_price: payablePrice,
          price: originalPrice,
          quantity: qty,
          variation_id: varId,
          product_attributes: cartData.product_attributes || [],
        };
        updatedItems = [...items, newItem];
      }

      saveLocalCart(updatedItems);
      const summary = calculateSummary(updatedItems);
      const newCartObj = { cart: updatedItems, summary };
      setCart(newCartObj);
      updateCartQuantity(updatedItems);

      try {
        trackAddToCart(
          {
            id: prodId,
            name: cartData.product_name || cartData.name,
            price: { payable_price: cartData.payable_price },
          },
          {
            quantity: qty,
            price: cartData.payable_price,
            value: (cartData.payable_price || 0) * qty,
          }
        );
      } catch {}

      toast.success("Product added to cart!");
      return { status: true, data: newCartObj };
    } catch (error) {
      toast.error("Failed to add product to cart");
      return { status: false };
    }
  };

  // Function to update item quantity in cart
  const updateCart = async (updatedData) => {
    try {
      const items = getLocalCart();
      const targetId = updatedData?.id || updatedData?.product_id;
      const newQty = Number(updatedData?.quantity);

      let updatedItems;
      if (newQty <= 0) {
        updatedItems = items.filter(
          (item) => String(item.id || item.product_id) !== String(targetId)
        );
      } else {
        updatedItems = items.map((item) => {
          if (String(item.id || item.product_id) === String(targetId)) {
            return { ...item, quantity: newQty };
          }
          return item;
        });
      }

      saveLocalCart(updatedItems);
      const summary = calculateSummary(updatedItems);
      const newCartObj = { cart: updatedItems, summary };
      setCart(newCartObj);
      updateCartQuantity(updatedItems);

      toast.success("Cart updated");
      return { status: true, data: newCartObj };
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

  // Function to remove item from cart
  const removeFromCart = async (id) => {
    try {
      const items = getLocalCart();
      const updatedItems = items.filter(
        (item) => String(item.id || item.product_id) !== String(id)
      );

      saveLocalCart(updatedItems);
      const summary = calculateSummary(updatedItems);
      const newCartObj = { cart: updatedItems, summary };
      setCart(newCartObj);
      updateCartQuantity(updatedItems);

      toast.success("Item removed from cart");
      return { status: true, data: newCartObj };
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  // Function to clear entire cart
  const clearCart = async () => {
    try {
      saveLocalCart([]);
      const emptyCartObj = {
        cart: [],
        summary: { sub_total: 0, total: 0, total_quantity: 0, delivery_charge: 0 },
      };
      setCart(emptyCartObj);
      updateCartQuantity([]);
      toast.success("Cart cleared");
      return { status: true };
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  return {
    cart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
    fetchCart,
    loading,
  };
};

export default useCart;
