import React, { Component } from "react";
import Modal from "react-native-modal";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/styles";

class ModalConfirm extends Component {
  hideModalConfirm(hideModalConfirm) {
    hideModalConfirm();
  }
  aceptSend(aceptSend) {
    aceptSend();
  }
  render() {
    const { hideModalConfirm, aceptSend } = this.props;
    return (
      <Modal
        style={styles.modal}
        swipeDirection="down"
        isVisible={this.props.isVisible}
        onBackButtonPress={() => {}}
        onBackdropPress={() => {}}
        onSwipeComplete={() => {}}
        animationInTiming={1000}
        animationOutTiming={1000}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0}
      >
        <View style={styles.modalConfirm}>
          <Text style={styles.titleConfirm}>¿Estás seguro?</Text>
          <View>
            <Text style={styles.subtitleConfirm}>
              Estás a punto de enviar: {"\n"}
            </Text>
            <Text style={styles.subtitleConfirmNum}>
              {this.props.bitcoin} BTC {"\n"}
              ARS {this.props.montoArs}
              {"\n"}
            </Text>
            <Text style={styles.addressConfirm}>
              Address: {"\n"}
              {this.props.clipboard}
            </Text>
            <View style={styles.feeContainer}>
              <Text style={styles.feeText}>Fee: 0.0002 BTC</Text>
            </View>
          </View>
          <View style={styles.confirmBtnContainer}>
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={() => {
                this.hideModalConfirm(hideModalConfirm);
              }}
            >
              <Text style={styles.buttonCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonConfirm}
              onPress={() => {
                this.hideModalConfirm(hideModalConfirm);
                this.aceptSend(aceptSend);
              }}
            >
              <Text style={styles.buttonConfirmText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default ModalConfirm;
