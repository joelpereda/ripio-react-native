import React, { Component } from "react";
import { View, Text } from "react-native";
import { styles } from "../styles/styles";
import { stylesDark } from "../styles/stylesDark";

class Balance extends Component {
  render() {
    return (
      <View style={styles.balanceContainer}>
        <Text
          style={
            this.props.darkmode
              ? stylesDark.balanceTextTitle
              : styles.balanceTextTitle
          }
        >
          MI BALANCE
        </Text>
        <Text
          style={
            this.props.darkmode
              ? stylesDark.balanceTextValue
              : styles.balanceTextValue
          }
        >
          AR$ {this.props.balanceArs != NaN ? this.props.balanceArs : 0}
        </Text>
        <Text
          style={
            this.props.darkmode
              ? stylesDark.balanceBtcText
              : styles.balanceBtcText
          }
        >
          BTC {this.props.balanceBtc ? this.props.balanceBtc : 0}
        </Text>
      </View>
    );
  }
}

export default Balance;
