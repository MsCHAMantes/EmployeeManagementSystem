import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Receipt() {

  const [cart, setCart] = useState<any[]>([]);

  // LOAD CART
  const loadCart = async () => {
    const data = await AsyncStorage.getItem("CART");

    if (data) {
      setCart(JSON.parse(data));
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  // TOTAL ITEMS
  const totalItems = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  // GRAND TOTAL
  const grandTotal = cart.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
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
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Total Product Calculation
      </Text>

      {/* ITEM DETAILS */}
      {cart.map((item) => (
        <View
          key={item.id}
          style={{
            marginBottom: 15,
            borderBottomWidth: 1,
            paddingBottom: 10,
          }}
        >
          <Text>{item.name}</Text>

          <Text>
            Quantity: {item.quantity}
          </Text>

          <Text>
            Total: ₱
            {item.price * item.quantity}
          </Text>
        </View>
      ))}

      {/* TOTALS */}
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
          marginTop: 10,
        }}
      >
        Grand Total: ₱{grandTotal}
      </Text>

      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => router.push("/")}
        style={{
          backgroundColor: "blue",
          padding: 12,
          borderRadius: 10,
          marginTop: 30,
        }}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
          }}
        >
          Back to Products
        </Text>
      </TouchableOpacity>
    </View>
  );
}