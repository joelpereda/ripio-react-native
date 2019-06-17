import React, { Component } from "react";
import { Text, View, Image } from "react-native";
import { Card, CardItem } from "native-base";
import { styles } from "../styles/styles";

class HistoryCard extends Component {
  press(press) {
    press();
  }
  render() {
    const { press } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Card style={styles.cardHistory}>
          <CardItem
            style={{
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              width: "100%"
            }}
            header={true}
          >
            {this.props.error ? (
              <Image
                source={require("../../assets/cross.png")}
                style={{
                  width: 35,
                  height: 35,
                  marginRight: 20,
                  marginTop: 5,
                  alignSelf: "flex-start"
                }}
              />
            ) : (
              <Image
                source={require("../../assets/check.png")}
                style={{
                  width: 35,
                  height: 35,
                  marginRight: 20,
                  marginTop: 5,
                  alignSelf: "flex-start"
                }}
              />
            )}
            <View style={{ justifyContent: "space-around" }}>
              <View
                style={{
                  marginBottom: 10,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <View style={{ marginBottom: 10 }}>
                  <Text style={styles.cardTitle}>Estado: </Text>
                  <Text style={styles.cardTitleBtc}>
                    {this.props.error ? "Fallido" : "Enviado"}
                  </Text>
                </View>
                <View style={{ marginBottom: 10 }}>
                  <Text style={styles.cardTitle}>Id: </Text>
                  <Text style={styles.cardTitleBtc}>{this.props.id}</Text>
                </View>
                <View style={{ marginBottom: 10, marginRight: 10 }}>
                  <Text style={styles.cardTitle}>Fee: </Text>
                  <Text style={styles.cardTitleBtc}>{this.props.fee}</Text>
                </View>
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.cardTitle}>Monto: </Text>
                <Text style={styles.cardTitleBtc}>{this.props.monto} BTC</Text>
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.cardTitle}>Address: </Text>
                <Text style={styles.cardTitleAddress}>
                  {this.props.address}
                </Text>
              </View>
            </View>
          </CardItem>
        </Card>
      </View>
    );
  }
}

export default HistoryCard;
