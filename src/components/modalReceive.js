import React, { Component } from "react";
import Modal from "react-native-modal";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { styles } from "../styles/styles";
import { Icon } from "native-base";

class ModalReceive extends Component {
  hideModalReceiveBtc(hideModalReceiveBtc) {
    hideModalReceiveBtc();
  }
  copyToClipboard(copyToClipboard) {
    copyToClipboard();
  }
  render() {
    const { hideModalReceiveBtc, copyToClipboard } = this.props;
    return (
      <Modal
        style={styles.modal}
        swipeDirection="down"
        isVisible={this.props.isVisible}
        onBackButtonPress={() => {
          this.hideModalReceiveBtc(hideModalReceiveBtc);
        }}
        onBackdropPress={() => {
          this.hideModalReceiveBtc(hideModalReceiveBtc);
        }}
        onSwipeComplete={() => {
          this.hideModalReceiveBtc(hideModalReceiveBtc);
        }}
        animationInTiming={1000}
        animationOutTiming={1000}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0}
      >
        <View>
          <View style={styles.modalHeaderTop}>
            <Text> </Text>
          </View>
          <View style={styles.modalContainerReceive}>
            <Text style={styles.modalTitleReceive}>RECIBIR BTC</Text>
            <View style={styles.modalHeaderReceive}>
              <Text style={styles.saldoDisponible}>Saldo disponible</Text>
              <Text style={styles.cardText}>{this.props.balanceBtc} BTC</Text>
            </View>
            <View style={styles.qrContainer}>
              <Image
                source={require("../../assets/qr.png")}
                style={{ width: 300, height: 300 }}
              />
            </View>
            <View style={styles.addressContainer}>
              <Text style={styles.addressTitle}>Mi dirección BTC</Text>
              <View style={styles.addressRow}>
                <TouchableOpacity
                  style={styles.addressRow}
                  onPress={() => this.copyToClipboard(copyToClipboard)}
                >
                  <Text style={styles.addressText}>
                    1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX
                  </Text>
                  <Icon
                    name="md-copy"
                    type="Ionicons"
                    style={[styles.icon, { color: "#fff", marginLeft: 15 }]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default ModalReceive;
