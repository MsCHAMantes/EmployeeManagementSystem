import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const products = [
  {
    id: "1",
    name: "Shoes",
    price: 1200,
    image: require("../assets/Product1.jpg"),
  },
  {
    id: "2",
    name: "Bag",
    price: 900,
    image: require("../assets/Product2.jpg"),
  },
  {
    id: "3",
    name: "Watch",
    price: 1500,
    image: require("../assets/Product3.jpg"),
  },
  {
    id: "4",
    name: "Headphones",
    price: 2000,
    image: require("../assets/Product4.jpg"),
  },
];

export default function Index() {
  const addToCart = async (product: any) => {
    const data = await AsyncStorage.getItem("CART");
    let cart = data ? JSON.parse(data) : [];
    const item = cart.find(
      (i: any) => i.id === product.id
    );

    if (item) {
      item.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    await AsyncStorage.setItem(
      "CART",
      JSON.stringify(cart)
    );

    router.push("/cart");
  };
    return (
  <ScrollView
    style={{
      flex: 1,
      backgroundColor: "#fff",
    }}
    contentContainerStyle={{
      padding: 20,
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
        Products
      </Text>

      {/* PRODUCTS */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {products.map((item) => (
          <View
            key={item.id}
            style={{
              width: "48%",
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              padding: 10,
              marginBottom: 15,
            }}
          >
            <Image
              source={item.image}
              style={{
                width: "100%",
                height: 90,
                resizeMode: "contain",
                borderRadius: 10,
                backgroundColor: "#f2f2f2",
              }}
            />

            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginTop: 10,
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
              onPress={() => addToCart(item)}
              style={{
                backgroundColor: "pink",
                padding: 10,
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
                Add to Cart
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}