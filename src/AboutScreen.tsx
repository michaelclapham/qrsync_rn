import React, { useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarCodeReadEvent, RNCamera } from "react-native-camera";
import QRCodeScanner from "react-native-qrcode-scanner";
import { useDispatch } from "react-redux";
import { scanClientId } from "./sessionSlice";

const AboutScreen: React.FC = () => {

    const dispatch = useDispatch();
    const onSuccess = (event: BarCodeReadEvent) => {
        console.log("Success?");
        Alert.alert("QR Code Scanned", event.data);
        dispatch(scanClientId(event.data));
    }

    console.log("AboutScreen render");

    return (
        <View style={{flexDirection: "column", flex: 1, backgroundColor: "black"}}>
            <QRCodeScanner
                onRead={onSuccess}
                containerStyle={{ flexDirection: "column", justifyContent: "center"}}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    centerText: {
      flex: 1,
      fontSize: 18,
      padding: 32,
      color: '#777'
    },
    textBold: {
      fontWeight: '500',
      color: '#000'
    },
    buttonText: {
      fontSize: 21,
      color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
      padding: 16
    }
  });

export default AboutScreen;