import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Image,
    Alert,
    Dimensions,
    StatusBar,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
    interpolate,
} from "react-native-reanimated";
import Svg, { Path, Polyline } from "react-native-svg";
import { useUser, useOAuth, useAuth } from "@clerk/expo";
import * as WebBrowser from "expo-web-browser";
import { useNavigation } from "@react-navigation/native";

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get("window");

const COLORS = {
    primary: "#2563EB",
    background: "#e8eaf6",
    white: "#FFFFFF",
    textDark: "#1a1a2e",
    textLight: "#888",
};

// Swipe Button Constants
const SWIPE_WIDTH = width - 56;
const BUTTON_HEIGHT = 64;
const KNOB_SIZE = 52;
const SWIPE_THRESHOLD = SWIPE_WIDTH - KNOB_SIZE - 10;

// ECG / Heartbeat line (consistent with Onboarding)
function HeartbeatLine() {
    return (
        <Svg width={120} height={40} viewBox="0 0 120 40">
            <Polyline
                points="0,20 15,20 22,5 30,35 38,10 46,28 54,20 70,20 76,10 82,30 88,20 120,20"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
        
    );
}

// Swipe Button Component for Login
function SwipeLoginButton({ onSwipe }) {
    const translateX = useSharedValue(0);
    const isPressed = useSharedValue(false);

    useEffect(() => {
        translateX.value = 0;
    }, []);

    const gesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .failOffsetY([-40, 40])
        .onBegin(() => {
            isPressed.value = true;
        })
        .onUpdate((event) => {
            const val = Math.max(0, Math.min(event.translationX, SWIPE_THRESHOLD));
            translateX.value = val;
        })
        .onEnd(() => {
            isPressed.value = false;
            if (translateX.value >= SWIPE_THRESHOLD - 5) {
                translateX.value = withSpring(SWIPE_THRESHOLD);
                runOnJS(onSwipe)();
            } else {
                translateX.value = withSpring(0);
            }
        })
        .onFinalize(() => {
            isPressed.value = false;
        });

    const knobStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { scale: withSpring(isPressed.value ? 1.05 : 1) }
        ],
    }));

    const textStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD / 2], [1, 0]),
    }));

    return (
        <View style={styles.swipeContainer}>
            <View style={styles.swipeTrack}>
                <Animated.Text style={[styles.swipeText, textStyle]}>
                    Swipe to Signup with Google
                </Animated.Text>
            </View>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.swipeKnob, knobStyle]}>
                    <View style={styles.knobInner}>
                        <Image
                            source={{
                                uri: "https://cdn-icons-png.flaticon.com/512/281/281764.png",
                            }}
                            style={styles.googleIcon}
                        />
                    </View>
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

export default function LoginScreen() {
    const navigation = useNavigation();
    const { user, isLoaded } = useUser();
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoaded && user) {
            navigation.reset({
                index: 0,
                routes: [{ name: "HomeScreen" }],
            });
        }
    }, [user, isLoaded]);

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            const { createdSessionId, setActive } = await startOAuthFlow();

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
                navigation.reset({
                    index: 0,
                    routes: [{ name: "HomeScreen" }],
                });
            }
        } catch (err) {
            Alert.alert("Error", err?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    if (!isLoaded || loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            {/* 🔵 TOP AREA */}
            <View style={styles.imageArea}>
                <View style={styles.heartbeatWrapper}>
                    <HeartbeatLine />
                </View>
                <Image
                    source={require("../../assets/images/mediqueue-logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* ⚪ CARD */}
            <View style={styles.card}>
                <Text style={styles.welcome}>Welcome Back 👋</Text>
                <Text style={styles.desc}>
                    Sign in to continue your healthcare journey
                </Text>

                <SwipeLoginButton onSwipe={handleGoogleSignIn} />

                <Text style={styles.footerText}>
                    By continuing, you agree to our Terms & Privacy Policy
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    imageArea: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 40,
    },
    heartbeatWrapper: {
        position: "absolute",
        top: 60,
        left: 24,
        zIndex: 10,
    },
    logo: {
        width: width * 1.3,
        height: width * 1.3,
        marginBottom: -80,
    },
    card: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        paddingHorizontal: 28,
        paddingTop: 40,
        paddingBottom: 60,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    welcome: {
        fontSize: 28,
        fontWeight: "800",
        color: COLORS.textDark,
        textAlign: "center",
        marginBottom: 8,
    },
    desc: {
        fontSize: 15,
        color: COLORS.textLight,
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 40,
    },
    swipeContainer: {
        width: "100%",
        height: BUTTON_HEIGHT,
        backgroundColor: "#f0f2f9",
        borderRadius: BUTTON_HEIGHT / 2,
        justifyContent: "center",
        padding: 6,
        marginTop: 10,
    },
    swipeTrack: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
    },
    swipeText: {
        color: "#2563EB",
        fontSize: 12,
        fontWeight: "600",
        justifyContent: 'center',
        flexWrap: "nowrap",
        letterSpacing: 0.5,
    },
    swipeKnob: {
        width: KNOB_SIZE,
        height: KNOB_SIZE,
        backgroundColor: "#2563EB",
        borderRadius: KNOB_SIZE / 2,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: "#2563EB",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    knobInner: {
        width: 38,
        height: 38,
        backgroundColor: "#fff",
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center",
    },
    googleIcon: {
        width: 24,
        height: 24,
    },
    footerText: {
        fontSize: 12,
        color: COLORS.textLight,
        textAlign: "center",
        marginTop: 30,
        opacity: 0.7,
    },
});