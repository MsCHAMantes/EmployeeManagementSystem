import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Cart() {

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

  // INCREASE QUANTITY
  const increaseQuantity = async (id: string) => {

    const updatedCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    setCart(updatedCart);

    await AsyncStorage.setItem(
      "CART",
      JSON.stringify(updatedCart)
    );
  };

  // DECREASE QUANTITY
  const decreaseQuantity = async (id: string) => {

    let updatedCart = [...cart];

    const item = updatedCart.find(
      (i) => i.id === id
    );

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      updatedCart = updatedCart.filter(
        (i) => i.id !== id
      );
    }

    setCart(updatedCart);

    await AsyncStorage.setItem(
      "CART",
      JSON.stringify(updatedCart)
    );
  };

  // REMOVE ITEM
  const removeItem = async (id: string) => {

    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    setCart(updatedCart);

    await AsyncStorage.setItem(
      "CART",
      JSON.stringify(updatedCart)
    );
  };

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
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        My Cart
      </Text>

      {/* TABLE HEADER */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#f2f2f2",
          padding: 10,
          borderWidth: 1,
          borderColor: "#ddd",
        }}
      >

        {/* PRODUCT */}
        <Text
          style={{
            flex: 2,
            fontWeight: "bold",
          }}
        >
          Product
        </Text>

        {/* SUBTOTAL */}
        <Text
          style={{
            flex: 1,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Subtotal
        </Text>

        {/* QUANTITY */}
        <Text
          style={{
            flex: 2,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Quantity
        </Text>

        {/* ACTION */}
        <Text
          style={{
            flex: 1,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Action
        </Text>
      </View>

      {/* TABLE BODY */}
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              padding: 10,
              borderWidth: 1,
              borderTopWidth: 0,
              borderColor: "#ddd",
              alignItems: "center",
            }}
          >

            {/* PRODUCT NAME */}
            <Text
              style={{
                flex: 2,
              }}
            >
              {item.name}
            </Text>

            {/* PRODUCT SUBTOTAL */}
            <Text
              style={{
                flex: 1,
                textAlign: "center",
              }}
            >
              ₱{item.price * item.quantity}
            </Text>

            {/* QUANTITY EDIT */}
            <View
              style={{
                flex: 2,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >

              {/* MINUS BUTTON */}
              <TouchableOpacity
                onPress={() =>
                  decreaseQuantity(item.id)
                }
                style={{
                  backgroundColor: "gray",
                  width: 25,
                  height: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  -
                </Text>
              </TouchableOpacity>

              {/* QUANTITY NUMBER */}
              <Text
                style={{
                  marginHorizontal: 10,
                }}
              >
                {item.quantity}
              </Text>

              {/* PLUS BUTTON */}
              <TouchableOpacity
                onPress={() =>
                  increaseQuantity(item.id)
                }
                style={{
                  backgroundColor: "green",
                  width: 25,
                  height: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  +
                </Text>
              </TouchableOpacity>

            </View>

            {/* REMOVE BUTTON */}
            <TouchableOpacity
              onPress={() =>
                removeItem(item.id)
              }
              style={{
                flex: 1,
                backgroundColor: "red",
                padding: 5,
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontSize: 12,
                }}
              >
                Remove
              </Text>
            </TouchableOpacity>

          </View>
        )}
      />

      {/* BUTTONS */}
      <TouchableOpacity
        onPress={() => router.push("/")}
        style={{
          backgroundColor: "gray",
          padding: 12,
          borderRadius: 10,
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Add More Products
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          router.push("/receipt")
        }
        style={{
          backgroundColor: "green",
          padding: 12,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Place Order
        </Text>
      </TouchableOpacity>

    </View>
  );
}