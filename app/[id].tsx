import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../services/supabase';



export default function RunDetail() {
  // ปุ่ม Save การแก้ไขข้อมูลรายการวิ่ง แล้วกลับไปหน้าหลัก
  const handleUpdateRun = async () => {
    // varidate UI 
    if (!location || !distance) {
      Alert.alert("คำเตือน", "กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    // บันทึกแก้ไขไปยัง supabase
    const { error } = await supabase
      .from("runs")
      .update({
        location: location,
        distance: distance,
        time_of_day: timeOfDay,
      })
      .eq("id", id);

    // ตรวจสอบว่าเกิดข้อผิดพลาดหรือไม่
    if (error) {
      Alert.alert("คำเตือน", "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      return;
    }

    // แสดงข้อความบันทึกสําเร็จ
    Alert.alert("สําเร็จ", "บันทึกข้อมูลสําเร็จ");

    // ย้อนกลับไปหน้า run เพื่อแสดงข้อมูลล่าสุดจาก Supabase
    router.back();


  };

  //  ฟังก์ชันสำหรับลบรายการวิ่งใน supabase
  const handleDeleteRun = async () => {
    // แสดง Alert ยืนยันการลบรายการวิ่ง
    Alert.alert(
      "คําเตือน",
      "คุณแน่ใจหรือไม่ว่าต้องการลบรายการวิ่งนี้?",
      [
        {
          text: "ยกเลิก",
          style: "cancel",
        },
        {
          text: "ลบงับ(ยืนยันการลบ)",
          onPress: async () => {
            // ลบรายการวิ่งใน supabase
            const { error } = await supabase
              .from("runs")
              .delete()
              .eq("id", id);
            // ตรวจสอบว่าเกิดข้อผิดพลาดหรือไม่
            if (error) {
              Alert.alert("คําเตือน", "เกิดข้อผิดพลาดในการลบรายการวิ่ง");
              return;
            }
            // ลบรูปภาพของรายการวิ่งใน Storage
            const { error: deleteError } = await supabase.storage
              .from("run_bk")
              .remove([imageUri.split("/").pop() || ""]);
            // ตรวจสอบว่าเกิดข้อผิดพลาดหรือไม่
            if (deleteError) {
              Alert.alert(
                "คําเตือน",
                "เกิดข้อผิดพลาดในการลบรูปภาพของรายการวิ่ง"
              );
              return;
            }
            // แสดงข้อความบันทึกสําเร็จ
            Alert.alert("สําเร็จ", "ลบรายการวิ่งสําเร็จ");
            // ย้อนกลับไปหน้า run เพื่อแสดงข้อมูลล่าสุดจาก Supabase
            router.back();
          },
        },
      ]
    )
    // และลบรายการวิ่งใน supabase หากผู้ใช้ยืนยัน
  }
  //ตัวแปรเก็บข้อมูลพารามิเตอร์ที่ส่งมาจาก Run  คือ id ของรายการววิ่งที่ส่งมา
  const { id } = useLocalSearchParams();

  //สร้าง state เพื่อเก็ฐข้อมูลรายละเอียดของรายการวิ่งที่ดึงมาจาก supabase และนำไปใช้กับ Component
  const [location, setLocation] = React.useState("");
  const [distance, setDistance] = React.useState("");
  const [timeOfDay, setTimeOfDay] = React.useState("เช้า");
  const [imageUri, setImageUri] = React.useState(""); //สำหรับใช้แสดงบน UI 

  //ดึงข้อมูลรายละเอียดของรายการวิ่งที่ส่งมาจาก supabase โดยใช้ id เป็นคีย์หลัก 
  useEffect(() => {
    // ฟังก์ชันสําหรับดึงข้อมูล จาก supabase และกำหนดค่าให้กับ state ที่เตรียมไว้
    const fetchRunData = async () => {
      const { data, error } = await supabase
        .from("runs")
        .select("*")
        .eq("id", id)
        .single();
      // หลังจากดึงข้อมูลมาแล้ว ตรวจสอบว่าเกิดข้อผิดพลาดหรือไม่
      if (error) {
        Alert.alert("คำเตือน", "เกิดข้อผิดพลาดในการดึงข้อมูล");
        return;
      }
      //  ถ้าไม่มีข้อผิดพลาด ให้นำข้อมูลไปใช้กับ Component
      setLocation(data.location);
      setDistance(data.distance.toString());
      setTimeOfDay(data.time_of_day);
      setImageUri(data.image_url);
    };

    // เรียกใช้ฟังก์ชันดึงข้อมูล
    fetchRunData();
  }, []);


  return (
    <ScrollView style={styles.container}>
      {/* ส่วนแสดงรูปภาพ */}
      <Image source={{ uri: imageUri }} style={styles.ImgRun} resizeMode="cover" />

      {/* ส่วนแสดงร่ายละเอียดกการวิ่ง */}
      <View style={styles.detailContainer}>
        {/* ป้อนสถานที่วิ่ง */}
        <Text style={styles.titleShow}>สถานที่วิ่ง</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="เช่น สวนลุมพินี"
          style={styles.inputValue}
        />
        {/* ป้อนระยะทาง */}
        <Text style={styles.titleShow}>ระยะทาง (กิโลเมตร)</Text>
        <TextInput
          value={distance}
          onChangeText={setDistance}
          placeholder="เช่น 5.2"
          keyboardType="numeric"
          style={styles.inputValue}
        />

        {/* เลือกช่วงเวลา */}
        <Text style={styles.titleShow}>ช่วงเวลา</Text>
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <TouchableOpacity
            style={[
              styles.todBtn,
              { backgroundColor: timeOfDay === "เช้า" ? "#1889da" : "#e6e6e6" },
            ]}
            onPress={() => setTimeOfDay("เช้า")}
          >
            <Text style={{ fontFamily: "Kanit_400Regular", color: "#4d4d4d" }}>
              เช้า
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.todBtn,
              { backgroundColor: timeOfDay === "เย็น" ? "#1889da" : "#e6e6e6" },
            ]}
            onPress={() => setTimeOfDay("เย็น")}
          >
            <Text style={{ fontFamily: "Kanit_400Regular", color: "#4d4d4d" }}>
              เย็น
            </Text>
          </TouchableOpacity>
        </View>


        {/* ปุ่มบันทึกการแก้ไข */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateRun}>
          <Text style={{ fontFamily: "Kanit_700Bold", color: "#fff" }}>
            บันทึกการแก้ไขข้อมูล
          </Text>
        </TouchableOpacity>


        {/* ปุ่มลบการวิ่ง */}
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteRun}>
          <Ionicons name="trash-bin" size={24} color="black" />
          <Text style={{ fontFamily: "Kanit_700Bold", color: "#f00" }}>
            {"   "}ลบรายการวิ่ง
          </Text>
        </TouchableOpacity>


      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  deleteBtn: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  saveBtn: {
    padding: 15,
    backgroundColor: "#1889da",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  todBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  inputValue: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontFamily: "Kanit_400Regular",
    backgroundColor: "#EFEFEF",
  },
  titleShow: {
    fontFamily: "Kanit_700Bold",
    marginBottom: 10,
  },
  detailContainer: {
    padding: 25,
    backgroundColor: "#fff",
    height: "100%",
    marginTop: -30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  ImgRun: {
    width: "100%",
    height: 250,
  },
  container: {
    flex: 1,
  },
})