import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  Send, 
  Bot, 
  ChevronLeft, 
  AlertCircle, 
  Stethoscope, 
  Activity,
  Info,
  Clock,
  Trash2
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

const { width } = Dimensions.get("window");

const API_URL = "http://192.168.1.115:5000/api/ai/predict"; 

const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ ...props.style, opacity: fadeAnim }}>
      {props.children}
    </Animated.View>
  );
};

const AIChatScreen = () => {
  const navigation = useNavigation();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  const clearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to delete all messages?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive", 
          onPress: () => setMessages([]) 
        }
      ]
    );
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const symptomInput = inputText; // Send raw text for NLP processing
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: symptomInput }),
      });

      const data = await response.json();

      if (data.success) {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          text: data.message || "I couldn't analyze those symptoms. Please try again.",
          sender: "ai",
          prediction: data.predictions && data.predictions.length > 0 ? data.predictions[0] : null,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        throw new Error("Could not determine condition.");
      }
    } catch (error) {
      console.error("AI Chat Error:", error);
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to the server. Please make sure the server is running and try again.",
        sender: "ai",
        isError: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isAI = item.sender === "ai";
    return (
      <FadeInView style={[styles.messageWrapper, isAI ? styles.aiWrapper : styles.userWrapper]}>
        {isAI && (
          <View style={styles.aiAvatar}>
            <Bot size={16} color="#FFF" />
          </View>
        )}
        <View style={styles.bubbleContainer}>
          <View style={[styles.messageBubble, isAI ? styles.aiBubble : styles.userBubble]}>
            <Text style={[styles.messageText, isAI ? styles.aiText : styles.userText]}>
              {item.text}
            </Text>
            
            {item.prediction && (
              <View style={styles.predictionCard}>
                <View style={styles.predictionHeader}>
                  <Activity size={14} color="#2563EB" strokeWidth={2.5} />
                  <Text style={styles.predictionTitle}>AI RECOMMENDATION</Text>
                </View>

                <TouchableOpacity 
                  style={styles.actionButton}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('BookAppointmentScreen', { doctorType: item.prediction.recommendedDoctor || 'General Physician' })}
                >
                  <Text style={styles.actionButtonText}>Book {item.prediction.disease} Specialist</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={[styles.timestampWrapper, isAI ? {alignSelf: 'flex-start'} : {alignSelf: 'flex-end'}]}>
            <Clock size={10} color="#9CA3AF" />
            <Text style={styles.timestampText}>
              {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      </FadeInView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconButton}>
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>Vaidhya AI</Text>
          <View style={styles.statusWrapper}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
        <TouchableOpacity onPress={clearHistory} style={styles.headerIconButton}>
          <Trash2 size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={styles.innerContainer}>
          {/* Chat Area */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            style={styles.flatList}
          />

          {/* Loading Indicator */}
          {isLoading && (
            <View style={styles.loadingWrapper}>
              <View style={styles.loadingBubble}>
                <ActivityIndicator color="#2563EB" size="small" />
                <Text style={styles.loadingText}>Analyzing symptoms...</Text>
              </View>
            </View>
          )}

          {/* Input Area */}
          <View style={styles.inputArea}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type symptoms here..."
                placeholderTextColor="#9CA3AF"
                value={inputText}
                onChangeText={setInputText}
                multiline
              />
              <TouchableOpacity 
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
                onPress={handleSend}
                disabled={!inputText.trim()}
                activeOpacity={0.7}
              >
                <Send size={20} color="#FFF" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    zIndex: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  headerIconButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
  },
  headerTitleWrapper: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },
  statusWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  messageWrapper: {
    flexDirection: "row",
    marginBottom: 24,
    maxWidth: "85%",
  },
  aiWrapper: {
    alignSelf: "flex-start",
  },
  userWrapper: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 2,
    elevation: 3,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  bubbleContainer: {
    flex: 1,
  },
  messageBubble: {
    padding: 15,
    borderRadius: 22,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  aiBubble: {
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: "#2563EB",
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  aiText: {
    color: "#1F2937",
  },
  userText: {
    color: "#FFF",
  },
  timestampWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    paddingHorizontal: 4,
  },
  timestampText: {
    fontSize: 10,
    color: "#9CA3AF",
    marginLeft: 4,
    fontWeight: "500",
  },
  predictionCard: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  predictionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  predictionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2563EB",
    marginLeft: 8,
    letterSpacing: 1,
  },
  predictionContent: {
    marginBottom: 12,
  },
  infoSection: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  infoItem: {
    fontSize: 13,
    color: "#1E293B",
    lineHeight: 18,
  },
  actionButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  loadingWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "600",
  },
  inputArea: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 90 : 80, // Increased to clear navbar
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 28,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
    maxHeight: 120,
    fontWeight: "500",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: "#E2E8F0",
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default AIChatScreen;
