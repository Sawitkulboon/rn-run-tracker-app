import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function Index() {
  // หน่วงเวลา 3 วินาที แล้วเปิดไปหน้า่ run แบบย้อนกลับไม่ได้ ----- 
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/run");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);


  return (
    <View style={Styles.container}>
      <Image
        source={require("@/assets/images/runlogo.png")}
        style={Styles.runlogo}
      />
      <Text style={Styles.runtitle1}>Run Tracker</Text>
      <Text style={Styles.runtitle2}>วิ่งเพื่อสุขภาพ</Text>
      <ActivityIndicator
        size="large"
        color="#1619ec"
        style={{ marginTop: 20 }}
      />

    </View>
  );
}

const Styles = StyleSheet.create({
  runtitle2: {
    fontFamily: "Kanit_400Regular",
    fontSize: 20,
    marginTop: 10,
  },
  runtitle1: {
    fontFamily: "Kanit_700Bold",
    fontSize: 30,
    marginTop: 20,
    fontWeight: "bold",
  },
  runlogo: {
    width: 200,
    height: 200,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});