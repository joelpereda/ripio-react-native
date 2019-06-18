import React, { Component } from "react";
import Modal from "react-native-modal";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/styles";
import { Form, Input, Item } from "native-base";

class ModalSend extends Component {
  hideModalSendBtc(hideModalSendBtc) {
    hideModalSendBtc();
  }
  changeInputBitcoin(changeInputBitcoin) {
    changeInputBitcoin();
  }
  getClipboard(getClipboard) {
    getClipboard();
  }
  sendBitcoin(sendBitcoin) {
    sendBitcoin();
  }
  render() {
    const {
      hideModalSendBtc,
      changeInputBitcoin,
      getClipboard,
      sendBitcoin
    } = this.props;
    return (
      <Modal
        style={styles.modal}
        swipeDirection="down"
        isVisible={this.props.isVisible}
        onBackButtonPress={() => {
          this.hideModalSendBtc(hideModalSendBtc);
        }}
        onBackdropPress={() => {
          this.hideModalSendBtc(hideModalSendBtc);
        }}
        onSwipeComplete={() => {
          this.hideModalSendBtc(hideModalSendBtc);
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
          <View style={styles.modalContainerSend}>
            <Text style={styles.modalTitleSend}>ENVIAR BTC</Text>
            <View style={styles.modalSendSaldo}>
              <View style={styles.modalHeaderSend}>
                <Text style={styles.saldoDisponible}>SALDO BTC</Text>
                <Text style={styles.cardText}>{this.props.balanceBtc}</Text>
              </View>
              <View style={styles.modalHeaderSend}>
                <Text style={styles.saldoDisponible}>SALDO AR$</Text>
                <Text style={styles.cardText}>{this.props.balanceArs}</Text>
              </View>
            </View>
            <View style={styles.inputCard}>
              <Form style={{ width: "100%" }}>
                <Item
                  style={{
                    borderWidth: 0,
                    borderColor: "rgba(255,255,255,0.0)"
                  }}
                  stackedLabel
                >
                  <Input
                    style={{
                      fontFamily: "ProductSans-Regular",
                      borderWidth: 0
                    }}
                    placeholderStyle={{ fontFamily: "ProductSans-Regular" }}
                    placeholder="Introduzca el monto"
                    value={this.props.bitcoin}
                    onChangeText={this.props.onChangeTextBtc}
                    keyboardType="numeric"
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      this.props.onSubmitEditing;
                    }}
                  />
                </Item>
                <Item
                  style={{
                    borderWidth: 0,
                    borderColor: "rgba(255,255,255,0.0)"
                  }}
                  stackedLabel
                >
                  <Input
                    ref="bitcoinAddress"
                    style={{
                      fontFamily: "ProductSans-Regular",
                      borderWidth: 0,
                      width: "96%"
                    }}
                    placeholderStyle={{ fontFamily: "ProductSans-Regular" }}
                    placeholder="Introduzca la dirección de BTC"
                    value={this.props.clipboard}
                    onChangeText={this.props.onChangeTextAddress}
                  />
                </Item>
              </Form>
              <TouchableOpacity onPress={() => this.getClipboard(getClipboard)}>
                <Text style={styles.sendClipboardText}>
                  Pegar dirección desde el portapapeles
                </Text>
              </TouchableOpacity>
              <Text style={styles.feeText}>Fee 0.0002</Text>
            </View>
            <TouchableOpacity
              style={styles.buttonSend}
              onPress={() => {
                this.sendBitcoin(sendBitcoin);
              }}
            >
              <Text style={styles.buttonSendText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default ModalSend;
