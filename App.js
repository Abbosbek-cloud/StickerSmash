import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import domtoimage from "dom-to-image";

import ImageViewer from "./components/ImageView";
import Button from "./components/Button";
import IconButton from "./components/IconButton";
import CircleButton from "./components/CircleButton";
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from "./components/EmojiList";
import EmojiSticker from "./components/EmojiSticker";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const PlaceHolderImage = require("./assets/images/background-image.png");

export default function App() {
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [showAppOptions, setShowAppOptions] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [pickedEmoji, setPickedEmoji] = React.useState(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();

  const imgRef = React.useRef();

  if (status === null) {
    requestPermission();
  }

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onSaveImageAsync = async () => {
    if (Platform.OS !== "web") {
      try {
        const localUri = await captureRef(imgRef, {
          height: 440,
          quality: 1,
        });
        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert("Saved!");
        }
      } catch (e) {
        alert("Xatolik yuz berdi, qayta urinib ko'ring!");
      }
    } else {
      try {
        const dataUrl = await domtoimage.toJpeg(imgRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });

        let link = document.createElement("a");
        link.download = "sticker-smash.jpeg";
        link.href = dataUrl;
        link.click();
      } catch (e) {
        alert("Xatolik yuz berdi, iltimos qayta urinib ko'ring!");
      }
    }
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
      alert("Xatolik yuz berdi, iltimos qayta urinib ko'ring!");
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imgRef} collapsable={false}>
          <ImageViewer
            placeholderImageSource={PlaceHolderImage}
            selectedImage={selectedImage}
          />
          {pickedEmoji !== null ? (
            <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
          ) : null}
        </View>
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton
              icon="save-alt"
              label="Save"
              onPress={onSaveImageAsync}
            />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button
            theme="primary"
            label="Choose a photo"
            onPress={pickImageAsync}
          />
          <Button
            label="Use this photo"
            onPress={() => {
              alert("Xatolik yuz berdi, iltimos qayta urinib ko'ring!");
              setShowAppOptions(true);
            }}
          />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
        {/* A list of emoji component will go here */}
      </EmojiPicker>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
