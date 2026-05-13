import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function Index() {
  // PRODUCTS
  const products: Product[] = [
    {
      id: "1",
      name: "Shoes",
      price: 1200,
      image:
        "https://via.placeholder.com/100",
    },
    {
      id: "2",
      name: "Bag",
      price: 900,
      image:
        "https://via.placeholder.com/100",
    },
    {
      id: "3",
      name: "Watch",
      price: 1500,
      image:
        "https://via.placeholder.com/100",
    },
    {
      id: "4",
      name: "Headphones",
      price: 2000,
      image:
        "https://via.placeholder.com/100",
    },
  ];

  // CART STATE
  const [cart, setCart] = useState<CartItem[]>([]);

  // LOAD SAVED CART
  useEffect(() => {
    loadCart();
  }, []);

  // SAVE CART
  useEffect(() => {
    saveCart();
  }, [cart]);

  // LOAD FUNCTION
  const loadCart = async () => {
    const data = await AsyncStorage.getItem("CART");

    if (data) {
      setCart(JSON.parse(data));
    }
  };

  // SAVE FUNCTION
  const saveCart = async () => {
    await AsyncStorage.setItem(
      "CART",
      JSON.stringify(cart)
    );
  };

  // ADD TO CART
  const addToCart = (product: Product) => {
    const item = cart.find(
      (i) => i.id === product.id
    );

    if (item) {
      // increase quantity
      setCart(
        cart.map((i) =>
          i.id === product.id
            ? {
                ...i,
                quantity: i.quantity + 1,
              }
            : i
        )
      );
    } else {
      // add new item
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  };

  // REMOVE / DECREASE
  const removeItem = (id: string) => {
    const item = cart.find((i) => i.id === id);

    if (!item) return;

    if (item.quantity > 1) {
      setCart(
        cart.map((i) =>
          i.id === id
            ? {
                ...i,
                quantity: i.quantity - 1,
              }
            : i
        )
      );
    } else {
      setCart(
        cart.filter((i) => i.id !== id)
      );
    }
  };

  // TOTAL ITEMS
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // GRAND TOTAL
  const grandTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
      }}
    >
      {/* TITLE */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Simple E-Commerce App
      </Text>

      {/* PRODUCTS */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Products
      </Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 10,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{
                width: 100,
                height: 100,
                alignSelf: "center",
                marginBottom: 10,
              }}
            />

            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {item.name}
            </Text>

            <Text
              style={{
                marginVertical: 5,
              }}
            >
              ₱{item.price}
            </Text>

            <TouchableOpacity
              onPress={() =>
                addToCart(item)
              }
              style={{
                backgroundColor: "pink",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                Add to Cart
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* CART */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        Cart
      </Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 10,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <Text>
              {item.name}
            </Text>

            <Text>
              Quantity: {item.quantity}
            </Text>

            <Text>
              Subtotal: ₱
              {item.price * item.quantity}
            </Text>

            <TouchableOpacity
              onPress={() =>
                removeItem(item.id)
              }
              style={{
                backgroundColor: "red",
                padding: 8,
                borderRadius: 10,
                marginTop: 5,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* TOTALS */}
      <View
        style={{
          marginTop: 10,
          padding: 10,
          borderTopWidth: 1,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Total Items: {totalItems}
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Grand Total: ₱{grandTotal}
        </Text>
      </View>
    </View>
  );
}