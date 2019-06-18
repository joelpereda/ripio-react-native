import React, { Component } from "react";
import Modal from "react-native-modal";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { styles } from "../styles/styles";

class ModalBitcoin extends Component {
  hideModalCard(hideModalCard) {
    hideModalCard();
  }
  render() {
    const { hideModalCard } = this.props;
    return (
      <Modal
        style={styles.modal}
        isVisible={this.props.isModalVisible}
        onBackButtonPress={() => {
          this.hideModalCard(hideModalCard);
        }}
        onBackdropPress={() => {
          this.hideModalCard(hideModalCard);
        }}
        onSwipeComplete={() => {
          this.hideModalCard(hideModalCard);
        }}
        swipeDirection="down"
        animationInTiming={1000}
        animationOutTiming={1000}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0}
      >
        <View style={{ margin: 0, marginBottom: -50 }}>
          <View style={styles.modalHeaderTop}>
            <Text> </Text>
          </View>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>MI BALANCE</Text>
              <Text style={styles.modalBalanceBtc}>
                {this.props.balanceBtc} BTC
              </Text>
              <Text style={styles.modalBalanceArs}>
                AR$ {this.props.balanceArs}
              </Text>
            </View>
            <View style={styles.modalActivity}>
              <View style={styles.chartViewModal}>
                <Text style={styles.title}>Cotización del Bitcoin</Text>
                <Text style={styles.subtitleChart}>
                  1 BTC = {this.props.price ? "-" : `AR$ ${this.props.btcSell}`}
                </Text>
                <LineChart
                  data={{
                    labels: [
                      "Enero",
                      "Febrero",
                      "Marzo",
                      "Abril",
                      "Mayo",
                      "Junio"
                    ],
                    datasets: [
                      {
                        data: [
                          128848,
                          151706,
                          177448,
                          232382,
                          299465,
                          this.props.btcBuy.toString().substr(0, 6)
                        ]
                      }
                    ]
                  }}
                  width={Dimensions.get("window").width + 1}
                  height={300}
                  yAxisLabel={"$"}
                  chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#ff9951",
                    backgroundGradientTo: "#ff6a00",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
                  }}
                  style={{
                    marginTop: 30
                  }}
                  bezier
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default ModalBitcoin;
