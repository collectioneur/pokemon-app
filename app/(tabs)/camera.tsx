import CameraCarousel from "@/components/CameraCarousel";
import { SwitchCamera } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Camera as VisionCamera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import {
  Camera,
  Face,
  FaceDetectionOptions,
} from "react-native-vision-camera-face-detector";

export default function camera() {
  const { hasPermission } = useCameraPermission();
  const { width, height } = useWindowDimensions();
  const back = useCameraDevice("back");
  const front = useCameraDevice("front");
  const [device, setDevice] = useState(front);
  const [imageURI, setImageURI] = useState<string | null>(
    "https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/other/official-artwork/1.png?raw=true"
  );

  useEffect(() => {
    (async () => {
      const status = await VisionCamera.requestCameraPermission();
    })();
  }, [device]);

  const aFaceW = useSharedValue(0);
  const aFaceH = useSharedValue(0);
  const aFaceX = useSharedValue(0);
  const aFaceY = useSharedValue(0);

  const drawFaceBounds = (face?: Face) => {
    if (face) {
      const { width, height, x, y } = face.bounds;
      aFaceW.value = width;
      aFaceH.value = height;
      aFaceX.value = x;
      aFaceY.value = y;
    } else {
      aFaceW.value = aFaceH.value = aFaceX.value = aFaceY.value = 50;
    }
  };

  const faceBoxStyle = useAnimatedStyle(() => ({
    position: "absolute",
    borderWidth: 0,
    width: withTiming(aFaceW.value, { duration: 100 }),
    height: withTiming(aFaceH.value, { duration: 100 }),
    left: withTiming(aFaceX.value, { duration: 100 }),
    top: withTiming(aFaceY.value, { duration: 100 }),
  }));

  const chooseImage = (uri: string) => {
    setImageURI(uri);
  };

  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    performanceMode: "fast",
    landmarkMode: "all",
    classificationMode: "none",
    trackingEnabled: false,
    windowWidth: width,
    windowHeight: height,
    autoScale: true,
  }).current;

  const handleFacesDetection = (faces: Face[]) => {
    try {
      if (faces?.length > 0) {
        const face = faces[0];
        drawFaceBounds(face);
      } else {
        drawFaceBounds();
      }
    } catch (error) {
      console.error("Error in face detection:", error);
    }
  };

  if (!hasPermission)
    return <Text>Camera permission is required to use this feature.</Text>;
  if (device == null) return <Text>Camera device not found.</Text>;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        faceDetectionCallback={handleFacesDetection}
        faceDetectionOptions={faceDetectionOptions}
      />
      <Animated.View style={[faceBoxStyle, styles.animatedView]}>
        <Image
          source={{
            uri: imageURI ?? "",
          }}
          style={{ width: 100, height: 100 }}
        />
      </Animated.View>
      <View className="absolute bottom-0 left-0 right-0 p-4">
        <View className="flex-row justify-end items-start mb-2">
          <TouchableOpacity
            style={{
              backgroundColor: "#000000bb",
              borderRadius: 9000,
              padding: 10,
              marginTop: 10,
            }}
          >
            <SwitchCamera
              size={32}
              color="#ffffffbb"
              onPress={() => {
                setDevice(device?.position === "front" ? back : front);
              }}
            />
          </TouchableOpacity>
        </View>
        <CameraCarousel chooseImage={chooseImage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  animatedView: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    padding: 10,
  },
});
