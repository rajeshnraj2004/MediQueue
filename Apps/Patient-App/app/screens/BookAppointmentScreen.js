import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Calendar as CalendarIcon, Clock, Edit3 } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useUser } from "@clerk/expo";

const BookAppointmentScreen = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const onDateChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }
    const currentDate = selectedDate || date;
    
    if (Platform.OS === 'android') {
      // On Android, the picker closes itself. Just update the date and optionally show time.
      setDate(currentDate);
      setShowPicker(false);
      // Wait a moment before showing time picker to avoid UI conflicts
      setTimeout(() => {
        showTimePicker(currentDate);
      }, 100);
    } else {
      setDate(currentDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    if (event.type === 'dismissed') return;
    const currentTime = selectedTime || date;
    setDate(currentTime);
  };

  const showTimePicker = (currentDate) => {
    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: onTimeChange,
      mode: 'time',
      is24Hour: true,
      minuteInterval: 15,
    });
  };

  const handleShowPicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        onChange: onDateChange,
        mode: 'date',
        is24Hour: true,
      });
    } else {
      setShowPicker(true);
    }
  };

  const handleBookAppointment = async () => {
    if (!reason.trim()) {
      Alert.alert("Error", "Please provide a reason for the appointment.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://192.168.1.115:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user.id,
          patientName: user.fullName || "Anonymous",
          date: date.toLocaleDateString(),
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reason: reason,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Appointment booked successfully!", [
          { text: "OK", onPress: () => navigation.navigate("HomeScreen") }
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to book appointment.");
      }
    } catch (error) {
      console.error("Booking Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.introSection}>
          <CalendarIcon size={64} color="#2563EB" strokeWidth={1.5} style={{ marginBottom: 16 }} />
          <Text style={styles.title}>Schedule Your Visit</Text>
          <Text style={styles.subtitle}>Select a date and time for your medical consultation.</Text>
        </View>

        <View style={styles.form}>
          {/* Date Picker Trigger */}
          <TouchableOpacity style={styles.inputContainer} onPress={handleShowPicker}>
            <View style={styles.inputIcon}>
              <CalendarIcon size={20} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Date & Time</Text>
              <Text style={styles.inputValue}>{date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</Text>
            </View>
            <Clock size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Reason Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Edit3 size={20} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Reason for Visit</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Annual Checkup, Fever..."
                value={reason}
                onChangeText={setReason}
              />
            </View>
          </View>

          {Platform.OS === 'ios' && showPicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              is24Hour={true}
              display="default"
              minuteInterval={15}
              onChange={(event, d) => {
                setShowPicker(false);
                if (d) setDate(d);
              }}
            />
          )}

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.disabledButton]} 
            onPress={handleBookAppointment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Confirm Appointment</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  introSection: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  inputIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  inputLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 2,
  },
  inputValue: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },
  textInput: {
    fontSize: 15,
    color: "#111827",
    padding: 0,
    height: 24,
  },
  submitButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.7,
  }
});

export default BookAppointmentScreen;
