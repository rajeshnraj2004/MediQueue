import React, { useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Image,
    StatusBar,
    PanResponder,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    withSpring,
    runOnJS,
    useAnimatedRef,
} from "react-native-reanimated";
import Svg, { Path, Polyline } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const Slides = [
    {
        id: 1,
        title: "Book Your Doctor\nAnywhere Anytime",
        description: "We provide the best consultation near you, at your convenience",
        image: require("../../assets/images/instant-booking.png"),
    },
    {
        id: 2,
        title: "Verified Doctors\nYou Can Trust",
        description: "Consult only the best and verified doctors with ease",
        image: require("../../assets/images/doctor.png"),
    },
    {
        id: 3,
        title: "AI Health\nAssistant",
        description: "Get personalized health insights powered by AI",
        image: require("../../assets/images/ai-assistants.png"),
    },
];

// ECG / Heartbeat line
function HeartbeatLine() {
    return (
        <Svg width={120} height={40} viewBox="0 0 120 40">
            <Polyline
                points="0,20 15,20 22,5 30,35 38,10 46,28 54,20 70,20 76,10 82,30 88,20 120,20"
                fill="none"
                stroke="#5c6bc0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

// Individual slide — just the image portion
function Slide({ item }) {
    return (
        <View style={styles.slide}>
            <Image
                source={item.image}
                style={styles.slideImage}
                resizeMode="contain"
            />
        </View>
    );
}

// Swipe Button Component
const SWIPE_WIDTH = width - 56; // card paddingHorizontal 28 * 2
const BUTTON_HEIGHT = 64;
const KNOB_SIZE = 52;
const SWIPE_THRESHOLD = SWIPE_WIDTH - KNOB_SIZE - 10;

function SwipeButton({ onSwipe, text, currentIndex }) {
    const translateX = useSharedValue(0);
    const isPressed = useSharedValue(false);

    const gesture = Gesture.Pan()
        .activeOffsetX([-10, 10]) // Allow some wiggle room
        .onBegin(() => {
            isPressed.value = true;
        })
        .onUpdate((event) => {
            // Only allow rightward movement
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

    // Reset when index changes
    React.useEffect(() => {
        translateX.value = withSpring(0);
    }, [currentIndex]);

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
                    {text}
                </Animated.Text>
            </View>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.swipeKnob, knobStyle]}>
                    <View style={styles.knobInner}>
                        <Svg width={20} height={20} viewBox="0 0 24 24">
                            <Path
                                d="M5 12h14M13 6l6 6-6 6"
                                stroke="#5c6bc0"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        </Svg>
                    </View>
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

export default function OnboardingScreen() {
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useSharedValue(0);
    const flatListRef = useAnimatedRef();
    const activeIndex = useSharedValue(0);

    const updateIndex = (i) => {
        activeIndex.value = i;
        setCurrentIndex(i);
    };

    const scrollTo = (index) => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
        updateIndex(index);
    };


    const onViewRef = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            updateIndex(viewableItems[0].index);
        }
    });

    const viewConfigRef = useRef({
        viewAreaCoveragePercentThreshold: 50,
    });

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const handlePress = () => {
        if (activeIndex.value < Slides.length - 1) {
            const nextIndex = activeIndex.value + 1;
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            updateIndex(nextIndex);
        } else {
            navigation.replace("LoginScreen");
        }
    };

    const currentSlide = Slides[currentIndex];

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#e8eaf6" />

            {/* Top lavender image area */}
            <View style={styles.imageArea}>
                {/* Heartbeat line top-left */}
                <View style={styles.heartbeatWrapper}>
                    <HeartbeatLine />
                </View>

                {/* Horizontally scrollable slides (image only) */}
                <Animated.FlatList
                    ref={flatListRef}
                    data={Slides}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={onViewRef.current}
                    viewabilityConfig={viewConfigRef.current}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <Slide item={item} />}
                    style={styles.flatList}
                />
            </View>

            {/* Bottom white card */}
            <View style={styles.card}>
                {/* Pagination dots */}
                <View style={styles.pagination}>
                    {Slides.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                currentIndex === i ? styles.dotActive : styles.dotInactive,
                            ]}
                        />
                    ))}
                </View>

                <Text style={styles.title}>{currentSlide.title}</Text>
                <Text style={styles.description}>{currentSlide.description}</Text>

                {/* Replace button with SwipeButton */}
                <SwipeButton
                    text={currentIndex === Slides.length - 1 ? "Swipe to Get Started" : "Swipe to Continue"}
                    onSwipe={handlePress}
                    currentIndex={currentIndex}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#e8eaf6",
    },
    imageArea: {
        flex: 1,
        backgroundColor: "#e8eaf6",
        alignItems: "center",
        justifyContent: "flex-end",
        overflow: "hidden",
    },
    heartbeatWrapper: {
        position: "absolute",
        top: 60,
        left: 24,
        zIndex: 10,
    },
    flatList: {
        width,
    },
    slide: {
        width,
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 0,
    },
    slideImage: {
        width: width * 1.4,
        height: height * 0.95,
        marginBottom: -270,
    },
    card: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        paddingHorizontal: 28,
        paddingTop: 4,
        paddingBottom: 40,
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    dotActive: {
        backgroundColor: "#2563EB",
        width: 24,
    },
    dotInactive: {
        backgroundColor: "#cbd5e1",
        width: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#1a1a2e",
        textAlign: "center",
        lineHeight: 36,
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: "#888",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 28,
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
        fontSize: 16,
        fontWeight: "700",
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
});