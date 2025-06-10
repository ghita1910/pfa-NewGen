import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  ImageBackground
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { Feather } from "@expo/vector-icons";
import BookingCard from "@/components/componentClient/BookingCard";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import axios from "axios";
import { icons, images } from "@/constants";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const [bookingsByDate, setBookingsByDate] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchBookings = async () => {
    try {
      const clientId = await AsyncStorage.getItem("client_id");
      if (!clientId) return;

      const res = await axios.get(`http://192.168.1.5:8000/home/client-demandes?client_id=${clientId}&etat=en%20attente`);

      const data = res.data;

      const grouped: { [key: string]: any[] } = {};
      data.forEach((d: any) => {
        if (!grouped[d.Date]) grouped[d.Date] = [];

        

        grouped[d.Date].push({
          title: `${d.prestataire_nom} ${d.prestataire_prenom}`,
          name: `${d.username}`,
          status: d.etat,
          image: { uri: `http://192.168.1.5:8000/${d.photo}` },
          date: d.Date,
          time: d.heure,
          address: d.adresse,
          description: d.description,
        });

      });

      setBookingsByDate(grouped);
      const today = new Date().toISOString().split("T")[0];
      setSelectedDate(today);
    } catch (error) {
      console.error("Erreur de chargement des bookings :", error);
    } finally {
      setLoading(false);
    }
  };

  fetchBookings();
}, []);


  const bookings = bookingsByDate[selectedDate] || [];

  return (
    <ImageBackground
                      source={images.fondecran4}
                      style={styles.background}
                      resizeMode="cover"
                    >
    <SafeAreaView style={styles.safeArea}>
      <Animated.ScrollView
        entering={FadeIn.duration(500)}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={styles.headerRow} entering={FadeInUp.delay(100)}>
          <Feather name="calendar" size={26} color="#7B2CBF" />
          <Text style={styles.header}>Calendar</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(250)} style={styles.calendarWrapper}>
          <Calendar
            current={selectedDate}
            onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: "#7B2CBF" },
            }}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#F6F1FE",
              textSectionTitleColor: "#1A1A1A",
              selectedDayBackgroundColor: "#7B2CBF",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#7B2CBF",
              dayTextColor: "#222222",
              textDisabledColor: "#d9e1e8",
              arrowColor: "#7B2CBF",
              monthTextColor: "#1A1A1A",
              textDayFontWeight: "500",
              textMonthFontWeight: "700",
              textDayHeaderFontWeight: "600",
              textMonthFontSize: 20,
              textDayFontSize: 16,
              textDayHeaderFontSize: 14,
            }}
            style={styles.calendar}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400)}>
          <Text style={styles.subTitle}>
            Upcoming Bookings ({bookings.length})
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#7B2CBF" />
          ) : bookings.length === 0 ? (
            <Text style={{ textAlign: "center", color: "#999", marginTop: 12 }}>
              No bookings for this date.
            </Text>
          ) : (
            bookings.map((booking, index) => (
              <Animated.View key={index} entering={FadeInUp.delay(500 + index * 100)}>
                <BookingCard service={booking} onMessagePress={function (): void {
                  throw new Error("Function not implemented.");
                } } refreshBookings={function (): void {
                  throw new Error("Function not implemented.");
                } } />
              </Animated.View>
            ))
          )}
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
   background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  calendarWrapper: {
    backgroundColor: "#F6F1FE",
    borderRadius: 16,
    padding: 10,
    marginBottom: 26,
    shadowColor: "#7B2CBF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  calendar: {
    borderRadius: 16,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    color: "#1A1A1A",
  },
});
  