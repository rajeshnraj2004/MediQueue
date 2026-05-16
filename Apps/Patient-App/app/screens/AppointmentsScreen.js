import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity, 
    ActivityIndicator, 
    RefreshControl,
    Alert 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarDays, Clock, FileText, ChevronRight, XCircle } from "lucide-react-native";
import { useUser } from "@clerk/expo";

const AppointmentsScreen = () => {
  const { user } = useUser();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`http://192.168.1.115:5000/api/appointments/${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setAppointments(data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const handleCancelAppointment = async (id) => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`http://192.168.1.115:5000/api/appointments/cancel/${id}`, {
                method: "PUT",
              });
              if (response.ok) {
                Alert.alert("Success", "Appointment cancelled successfully.");
                fetchAppointments();
              }
            } catch (error) {
              Alert.alert("Error", "Could not cancel appointment.");
            }
          }
        }
      ]
    );
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'cancelled' ? '#FEE2E2' : '#DEF7EC' }]}>
          <Text style={[styles.statusText, { color: item.status === 'cancelled' ? '#991B1B' : '#03543F' }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.infoText}>{item.time}</Text>
        </View>
        <View style={styles.infoRow}>
          <FileText size={16} color="#6B7280" />
          <Text style={styles.infoText} numberOfLines={1}>{item.reason}</Text>
        </View>
      </View>

      {item.status !== 'cancelled' && (
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => handleCancelAppointment(item._id)}
        >
          <XCircle size={16} color="#EF4444" />
          <Text style={styles.cancelButtonText}>Cancel Visit</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Appointments</Text>
      </View>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item._id}
        renderItem={renderAppointment}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <CalendarDays size={64} color="#CBD5E1" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No Appointments</Text>
            <Text style={styles.emptySubtitle}>You haven't scheduled any visits yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dateText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },
  cardBody: {
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "500",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 6,
  },
  cancelButtonText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#475569",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 8,
  },
});

export default AppointmentsScreen;
