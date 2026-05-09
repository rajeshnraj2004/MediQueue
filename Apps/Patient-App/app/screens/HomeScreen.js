import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useUser, useAuth } from "@clerk/expo";
import { useNavigation } from "@react-navigation/native";
import { 
  Home, 
  Calendar, 
  FileText, 
  Brain, 
  Plus, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  ChevronRight,
  MoreVertical
} from "lucide-react-native";
import AppointmentsScreen from "./AppointmentsScreen";
import AIChatScreen from "./AI-ChatScreen";

const { width } = Dimensions.get("window");
const Tab = createBottomTabNavigator();

/* 🔹 Animated Tab Item */
const AnimatedTabItem = ({ activeIcon: ActiveIcon, inactiveIcon: InactiveIcon, onPress, isActive }) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.85, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={styles.navItem}
    >
      <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
        {isActive ? (
          <ActiveIcon size={26} color="#2563EB" strokeWidth={2.5} />
        ) : (
          <InactiveIcon size={26} color="#9CA3AF" strokeWidth={2} />
        )}
        {isActive && <View style={styles.activeDot} />}
      </Animated.View>
    </TouchableOpacity>
  );
};

/* 🔹 Floating Add Button */
const FloatingAddButton = ({ onPress }) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.fabContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Animated.View style={[styles.fab, { transform: [{ scale }] }]}>
          <Plus size={32} color="#FFF" strokeWidth={2.5} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

/* 🔹 Custom Tab Bar */
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.bottomNav}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          let activeIcon, inactiveIcon;
          if (route.name === 'Home') {
            activeIcon = Home;
            inactiveIcon = Home;
          } else if (route.name === 'Appointments') {
            activeIcon = Calendar;
            inactiveIcon = Calendar;
          } else if (route.name === 'Records') {
            activeIcon = FileText;
            inactiveIcon = FileText;
          } else if (route.name === 'Brain') {
            activeIcon = Brain;
            inactiveIcon = Brain;
          }

          return (
            <AnimatedTabItem
              key={route.key}
              activeIcon={activeIcon}
              inactiveIcon={inactiveIcon}
              isActive={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>
      <FloatingAddButton onPress={() => navigation.navigate('BookAppointmentScreen')} />
    </View>
  );
}

function HomeScreen() {
  const { user } = useUser();
  const { getToken, signOut } = useAuth();
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  // 🔥 SYNC USER ON MOUNT
  useEffect(() => {
    if (user) {
      syncUser();
    }
  }, [user]);

  const syncUser = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      
      /* 
      await fetch("http://10.237.202.103:5000/api/patient/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user.id,
          firstName: user.firstName,
          emailAddresses: user.emailAddresses,
          imageUrl: user.imageUrl,
        }),
      });
      */
    } catch (error) {
      console.error("--> [FRONTEND] Sync Exception:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      setMenuVisible(false);
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Image
                source={{
                  uri: user?.imageUrl || "https://ui-avatars.com/api/?name=User",
                }}
                style={styles.profileIcon}
              />
            </TouchableOpacity>
            <View style={styles.userText}>
              <Text style={styles.greeting}>Hi, {user?.firstName || "User"}</Text>
              <Text style={styles.subGreeting}>How is your health?</Text>
            </View>
          </View>   

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={24} color="#111827" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Welcome Message */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to MediQueue</Text>
            <Text style={styles.welcomeSubtitle}>Your trusted healthcare companion.</Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionSection}>
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => navigation.navigate('BookAppointmentScreen')}
            >
              <Plus size={20} color="#FFF" strokeWidth={3} />
              <Text style={styles.bookButtonText}>Book Appointment</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Sign Out Dropdown Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownMenu}>
              <View style={styles.menuHeader}>
                <Image
                  source={{ uri: user?.imageUrl }}
                  style={styles.menuProfileImage}
                />
                <View>
                  <Text style={styles.menuName}>{user?.fullName}</Text>
                  <Text style={styles.menuEmail} numberOfLines={1}>{user?.primaryEmailAddress?.emailAddress}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <TouchableOpacity style={styles.menuItem} onPress={() => {setMenuVisible(false); navigation.navigate("Brain");}}>
                <Brain size={20} color="#444" strokeWidth={2} />
                <Text style={styles.menuItemText}>Mental Health</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Settings size={20} color="#444" strokeWidth={2} />
                <Text style={styles.menuItemText}>Settings</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={[styles.menuItem, styles.signOutItem]} 
                onPress={handleSignOut}
              >
                <LogOut size={20} color="#FF4B4B" strokeWidth={2} />
                <Text style={[styles.menuItemText, { color: "#FF4B4B" }]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

/* Dummy Screens */

function RecordsScreen() {
  return (
    <SafeAreaView style={styles.center}>
      <Text>Medical Records</Text>
    </SafeAreaView>
  );
}

function BrainScreen() {
  return (
    <SafeAreaView style={styles.center}>
      <Text>Mental Health & AI</Text>
    </SafeAreaView>
  );
}

/* Bottom Tabs */
export default function HomeTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Records" component={RecordsScreen} />
      <Tab.Screen name="Brain" component={AIChatScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userText: {
    marginLeft: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  subGreeting: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 15,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  welcomeSection: {
    marginTop: 40,
    alignItems: "center",
  },
  quickActionSection: {
    marginTop: 30,
    alignItems: "center",
  },
  bookButton: {
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  bookButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2563EB",
    position: 'absolute',
    bottom: -10,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 45,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#2563EB",
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: "#F8FAFC",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  dropdownMenu: {
    position: "absolute",
    top: 80,
    left: 20,
    width: width * 0.75,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  menuProfileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  menuName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  menuEmail: {
    fontSize: 12,
    color: "#6B7280",
    width: width * 0.45,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#374151",
    fontWeight: "500",
  },
  signOutItem: {
    marginTop: 5,
  },
});