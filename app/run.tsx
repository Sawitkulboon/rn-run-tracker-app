import { supabase } from '@/services/supabase';
import { Runs } from '@/types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Run() {
  // สร้าง State เพื่อเก็บข้อมูลที่ดึงมาจาก supabase และนำไปใช้กับ Component
  const [runs, setRuns] = useState<Runs[]>([]);
  // สร้างฟังก์ชันสําหรับดึงข้อมูล
  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        const { data: data, error } = await supabase
          .from("runs")
          .select("*")
          .order("run_date", { ascending: true });

        // หลังจากดึงข้อมูลมาแล้ว ตรวจสอบว่าเกิดข้อผิดพลาดหรือไม่
        if (error) {
          Alert.alert("เกิดข้อผิดพลาดในการดึงข้อมูล: " + error.message);
          return;
        }
        //  ถ้าไม่มีข้อผิดพลาด ให้นำข้อมูลไปใช้กับ Component
        setRuns(data || []);
      }
      fetchData();
    }, [])
  );

  // ฟังก์ชันหน้าตาของแต่ละรายการสำหรับ FlatList
  const showListRuns = ({ item }: { item: Runs }) => {
    return (
      <TouchableOpacity
        onPress={() => router.push({
          pathname: "/[id]",
          params: {
            id: item.id,
            location: item.location,
            distance: item.distance,
            time_of_day: item.time_of_day,
            run_date: item.run_date,
            image_url: item.image_url,
          },
        })}
        style={styles.cardSty}
      >
        <View style={styles.cardSty1}>
          <Image source={{ uri: item.image_url }} style={styles.runImage} />
          <View style={styles.cardSty2}>
            <Text style={styles.runtitle1}>{item.location}</Text>
            <Text style={styles.runtitle2}>{item.run_date}</Text>
          </View>
          <Text style={styles.runtitle3}>{item.distance} km</Text>
          <MaterialIcons name="arrow-forward-ios" size={24} color="black"  style={styles.runtitle4}/>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Image
        // ส่วนแสดง LOGO รูป
        source={require("@/assets/images/runlogo.png")}
        style={styles.runlogo}
      />

      <FlatList
        data={runs}
        renderItem={showListRuns}
        keyExtractor={(item) => item.id}
      />
      {/* ส่วนแสดงปุ่มเปิดไปหน้า Add */}
      <TouchableOpacity
        onPress={() => router.push("/add")}
        style={styles.addBtn}>
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>


  );
}

const styles = StyleSheet.create({
  runImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  cardSty1: {
    flexDirection: "row",

  },
  runtitle4: {
    position: "absolute",
    top: 30,
    paddingLeft: 300,
    fontFamily: 'Kanit_700Bold',
    color: '#ffc6c6',
  },
  runtitle3: {
    position: "absolute",
    top: 30,
    paddingLeft: 250,
    fontFamily: 'Kanit_700Bold',
    fontSize: 16,
    color: '#6770eb',
  },

  runtitle2: {
    fontFamily: 'Kanit_400Regular',
    color: '#747474',
  },
  runtitle1: {
    fontFamily: 'Kanit_700Bold',
    fontSize: 17,
    marginBottom: 5,
  },
  cardSty2: {
    marginLeft: 10,
    justifyContent: "center",
    
  },
  cardSty: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: '#b4a8a8',
    borderWidth: 1
  },
  addBtn: {
    position: "absolute",
    right: 40,
    bottom: 40,
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#00f",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  runlogo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginTop: 30,
  },
});