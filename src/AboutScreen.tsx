import React, { useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarCodeReadEvent, RNCamera } from "react-native-camera";
import QRCodeScanner from "react-native-qrcode-scanner";
import { useDispatch } from "react-redux";
import { scanClientId } from "./sessionSlice";

const AboutScreen: React.FC = () => {

    const onSuccess = (event: BarCodeReadEvent) => {
        console.log("Success?");
        Alert.alert("QR Code Scanned", event.data);
        const dispatch = useDispatch();
        dispatch(scanClientId(event.data));
    }

    return (
        <View>
            <Text>About</Text>
            <QRCodeScanner
                onRead={onSuccess}
                topContent={
                    <Text style={styles.centerText}>
                        Go to{' '} <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
                        your computer and scan the QR code.
                     </Text>
                }
                bottomContent={
                    <TouchableOpacity style={styles.buttonTouchable}>
                        <Text style={styles.buttonText}>OK. Got it!</Text>
                    </TouchableOpacity>
                }
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