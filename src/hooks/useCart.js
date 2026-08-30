import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";
import { useDispatch } from "react-redux";
import { totalProductQuantity } from "@/redux/features/productQuantitySlice";
import { trackAddToCart } from "@/utils/ga4Ecommerce";

const useCart = () => {
  const [cart, setCart] = useState({});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const updateCartQuantity = (cartData) => {
    const totalQuantity = cartData?.cart?.reduce(
      (acc, item) => acc + item?.quantity,
      0
    );

    dispatch(totalProductQuantity(totalQuantity || 0));
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/cart");
      if (response?.data?.status) {
        setCart(response?.data?.data);
        updateCartQuantity(response?.data?.data);
      } else {
        setCart({});
        updateCartQuantity({});
      }
    } catch (error) {
      setCart({});
      updateCartQuantity({});
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (token) {
  //     fetchCart();
  //   }
  // }, []);

  // Function to add item to cart via API
  const addToCart = async (cartData) => {
    try {
      const response = await axiosInstance.post("/cart", cartData);
      if (response?.data?.status) {
        let cartItems = response?.data?.data?.cart || [];
        let product = cartItems.find(
          (item) => item?.product_id === cartData.product_id
        );

        trackAddToCart(
          {
            id: cartData.product_id,
            name: product?.product_name,
            category_name: product?.category_name,
            category_names: product?.category_names,
            category: product?.category,
            product_category: product?.product_category,
            product_category_name: product?.product_category_name,
            categories: product?.categories || product?.product?.categories,
            price: {
              payable_price: product?.payable_price,
            },
          },
          {
            quantity: cartData.quantity,
            price: product?.payable_price,
            value: product?.payable_price * cartData.quantity,
          }
        );

        fetchCart();
        toast.success(response?.data?.status_message);
        return response?.data;
      } else {
        toast.error(response?.data?.status_message || "Failed to add to cart");
        return response?.data;
      }
    } catch (error) {
      console.warn("addToCart error:", error?.message);
    }
  };

  // Function to update item in cart via API
  const updateCart = async (updatedData) => {
    try {
      const response = await axiosInstance.put(`/cart/${updatedData?.id}`, {
        variation_id: updatedData?.variationId,
        quantity: updatedData?.quantity,
      });

      if (response?.data?.status) {
        toast.success(response?.data?.status_message);
        fetchCart();
      } else {
        toast.error(response?.data?.status_message);
      }
    } catch (error) {
      if (error?.status === 422) {
        toast.error(error?.response?.data?.message);
      } else {
        console.warn("updateCart error:", error?.message);
      }
    }
  };

  // Function to remove item from cart via API
  const removeFromCart = async (id) => {
    try {
      const response = await axiosInstance.delete(`/cart/${id}`);
      if (response?.data?.status) {
        toast.success(response?.data?.status_message);
        fetchCart();
      } else {
        toast.error(response?.data?.status_message);
      }
    } catch (error) {
      console.warn("removeFromCart error:", error?.message);
    }
  };

  // Function to clear cart via API
  const clearCart = async () => {
    try {
      const response = await axiosInstance.get(`/clear-cart`);
      if (response?.data?.status) {
        toast.success(response?.data?.status_message);
        fetchCart();
      } else {
        toast.error(response?.data?.status_message);
      }
    } catch (error) {
      console.warn("clearCart error:", error?.message);
    } finally {
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
