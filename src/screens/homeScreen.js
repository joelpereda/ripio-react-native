import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  Clipboard,
  RefreshControl,
  Alert,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { Tabs, Tab, TabHeading, Toast } from "native-base";
import { styles } from "../styles/styles";
import { stylesDark } from "../styles/stylesDark";
import { connect } from "react-redux";
import { getPrices, loading } from "../actions/price.actions";
import { getWallet, sendBtc } from "../actions/wallet.actions";
import { getHistory, postHistory } from "../actions/history.actions";
import { withNavigation } from "react-navigation";
import { ScrollView } from "react-native-gesture-handler";
import { Styles } from "../styles/styles";

import TabOverview from "../components/tabOverview";
import TabActivity from "../components/tabActivity";
import Footer from "../components/footer";
import Modal from "react-native-modal";
import coinAddressValidator from "coin-address-validator";
import HistoryCard from "../components/historyCard";
import moment from "moment";
import SplashScreen from "react-native-splash-screen";
import ModalBitcoin from "../components/modalBitcoin";
import ModalSend from "../components/modalSend";
import ModalReceive from "../components/modalReceive";
import ModalConfirm from "../components/modalConfirm";
import Balance from "../components/balance";
import Header from "../components/header";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: false,
      isModalVisible: false,
      modalSendBtc: false,
      modalReceiveBtc: false,
      modalConfirm: false,
      modalLoading: false,
      modalOk: false,
      modalErrorSend: false,
      loadingSend: false,
      activity: true,
      chart: false,
      refreshing: false,
      bitcoin: "",
      montoArs: 0,
      btcBuy: "-",
      btcSell: "-",
      variation: "-",
      clipboard: "",
      wallet: {},
      history: []
    };
  }

  componentDidMount() {
    this.props.onLoadPrices(true);
    this._getPrices();
    this._getWallet();
    this._getHistory();
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }
  _getPrices() {
    this.props.getPrices().then(prices => {
      this.setState({
        btcBuy: prices.data.rates.ARS_BUY,
        btcSell: prices.data.rates.ARS_SELL,
        variation: prices.data.variation.ARS.toString()
      });
    });
  }

  _getWallet() {
    this.props.getWallet().then(wallet => {
      this.setState({
        wallet: wallet.data
      });
    });
  }
  _getHistory() {
    this.props.getHistory().then(history => {
      this.setState({
        history: history.data
      });
    });
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.getPrices().then(prices => {
      this.setState({
        btcBuy: prices.data.rates.ARS_BUY,
        btcSell: prices.data.rates.ARS_SELL,
        variation: prices.data.variation.ARS.toString(),
        refreshing: false
      });
    });
    this.props.getWallet().then(wallet => {
      this.setState({
        wallet: wallet.data,
        refreshing: false
      });
    });
    this.props.getHistory().then(history => {
      this.setState({
        history: history.data,
        refreshing: false
      });
    });
  };

  /* MODAL HANDLES */
  showModalCard() {
    this.setState({
      isModalVisible: true
    });
  }

  hideModalCard() {
    this.setState({
      isModalVisible: false
    });
  }

  showModalSendBtc() {
    this.setState({
      modalSendBtc: true
    });
  }

  hideModalSendBtc() {
    this.setState({
      clipboard: "",
      bitcoin: "",
      modalSendBtc: false
    });
  }

  showModalReceiveBtc() {
    this.setState({
      modalReceiveBtc: true
    });
  }

  hideModalReceiveBtc() {
    this.setState({
      modalReceiveBtc: false
    });
  }

  showModalConfirm() {
    this.setState({
      modalConfirm: true
    });
  }

  hideModalConfirm() {
    this.setState({
      modalConfirm: false
    });
  }

  showModalLoading() {
    this.setState({
      modalLoading: true
    });
  }

  loadingSend(value) {
    this.setState({
      loadingSend: value
    });
  }

  hideModalLoading() {
    this.setState({
      modalLoading: false
    });
  }

  showModalOk() {
    this.setState({
      modalOk: true
    });
  }

  hideModalOk() {
    this.setState({
      modalOk: false
    });
  }

  showModalErrorSend() {
    this.setState({
      modalErrorSend: true
    });
  }

  hideModalErrorSend() {
    this.setState({
      modalErrorSend: false
    });
  }

  handleActivityModal() {
    if (!this.state.activity) {
      this.setState({ activity: true, chart: false });
    }
  }

  handleChartModal() {
    if (!this.state.chart) {
      this.setState({ chart: true, activity: false });
    }
  }
  /* END MODAL HANDLES */

  /* BOTON ENVIAR */
  sendBitcoin() {
    /* sendBitcoin() valida que tanto el MONTO como el ADDRESS sean correctos */
    let btcSell = this.state.btcSell;
    let { wallet } = this.props;
    let balanceBtc = wallet.isLoading ? 0 : wallet.data[0].balance;
    let fee = 0.0002;
    let bitcoin = this.state.bitcoin;
    let bitcoinBudget = parseFloat(bitcoin);
    let montoArs = bitcoinBudget * btcSell;
    montoArs = montoArs.toString().substr(0, 9);

    this.setState({ montoArs: montoArs });
    const isBtcAddress = coinAddressValidator.validate(
      this.state.clipboard,
      "btc",
      "prod"
    );
    let montoandfee = parseFloat(this.state.bitcoin) + parseFloat(fee);
    let montoValidado = montoandfee <= balanceBtc;
    if (montoValidado) {
      if (isBtcAddress) {
        if (this.state.clipboard != "" && this.state.bitcoin != 0) {
          this.showModalConfirm();
        } else {
          Alert.alert(
            "Completar ambos cambos",
            "Debe completar ambos campos para continuar.",
            [{ text: "Aceptar" }],
            { cancelable: false }
          );
        }
      } else {
        Alert.alert(
          "Direccion",
          "Introduzca una dirección correcta.",
          [{ text: "Aceptar" }],
          { cancelable: false }
        );
      }
    } else {
      Alert.alert(
        "¡Atención!",
        "El monto no puede superar a tu balance actual. Tené en cuenta la comisión (Fee 0.0002).",
        [{ text: "Aceptar" }],
        { cancelable: false }
      );
    }
  }

  /* BOTON ACEPTAR */
  aceptSend(address, budget) {
    /* aceptSend() primero setea el momento en el que se está enviando bitcoins,
    luego setea el fee y calcula el monto para actualizar el balance en /wallet
    hace PUT en /wallet con el monto (balanceBtc - budget) y hace POST en /history 
    con el intento válido o no de envío */
    let myAddress = "5d05323b035a093b24cc1c1c";
    const date = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
    let fecha = date;
    let fee = 0.0002;
    let { wallet } = this.props;
    let balanceBtc = wallet.isLoading ? 0 : wallet.data[0].balance;
    let monto = balanceBtc - budget;
    console.log("address :", address);
    console.log("fecha :", fecha);
    console.log("budget :", budget);
    console.log("fee :", fee);
    this.props
      .sendBtc(myAddress, monto)
      .then(data => {
        if (data.data == "TypeError: Network request failed") {
          this.props.postHistory(address, fecha, budget, fee, true);
          this.props.getHistory().then(history => {
            this.setState({
              history: history.data,
              refreshing: false
            });
          });
          this.loadingSend(true);
          this.showModalOk();
          setTimeout(() => {
            this.loadingSend(false);
            this.showModalErrorSend();
          }, 2000);
        } else {
          this.hideModalErrorSend();
          this.showModalOk();
          this.loadingSend(true);
          this.props.postHistory(address, fecha, budget, fee, false);
          setTimeout(() => {
            this.props.getWallet().then(wallet => {
              this.setState({
                wallet: wallet.data,
                refreshing: false
              });
            });
            this.props.getHistory().then(history => {
              this.setState({
                history: history.data,
                refreshing: false
              });
            });
            this.hideModalSendBtc();
            this.loadingSend(false);
            this._onRefresh();
          }, 2500);
        }
      })
      .catch(err => {
        alert("Error envío");
      });
  }

  copyToClipboard(value) {
    /* Metodo para copiar al portapapeles el address en el modal de recibir btc */
    Clipboard.setString(value);
    Toast.show({
      text: "Copiado al portapapeles",
      buttonText: "X",
      position: "top",
      textStyle: { fontFamily: "ProductSans-Regular" },
      duration: 2000
    });
  }
  async getClipboard() {
    /* Metodo para pegar lo que está en el portapapeles */
    var content = await Clipboard.getString();
    this.setState({
      clipboard: content
    });
  }

  changeInputBitcoin(value) {
    /* Setea en this.state.bitcoin el value en el input de "Itroduzca el monto". */
    this.setState({
      bitcoin: value
    });
  }

  changeInput(value) {
    /* Setea en this.state.clipboard (address) el value en el 
    input de "Introduzca la dirección de btc". */
    this.setState({
      clipboard: value
    });
  }

  //FLAT LIST BITCOIN HISTORY CARD
  _keyExtractor = (item, index) => item._id;

  _renderItem = ({ item, index }) => (
    /* Es el render del FlatList del historial */
    <HistoryCard
      id={index + 200}
      address={item.address}
      date={item.date}
      monto={item.monto}
      fee={item.fee}
      error={item.error}
    />
  );

  render() {
    let { price, wallet } = this.props;
    let btcSell = this.state.btcSell;
    let btcBuy = this.state.btcBuy;
    let variation = this.state.variation.substr(0, 6);
    let balanceBtc = wallet.isLoading ? 0 : wallet.data[0].balance;
    let balanceArs = balanceBtc * btcSell;
    let darkMode = price.darkMode;
    balanceArs = balanceArs.toString().substr(0, 9);
    balanceBtc = balanceBtc.toString().substr(0, 14);
    return (
      <View style={darkMode ? stylesDark.container : styles.container}>
        <StatusBar
          backgroundColor={darkMode ? "#000" : "#fff"}
          barStyle={darkMode ? "light-content" : "dark-content"}
        />
        <Styles />
        {/* LOGO RIPIO Y BOTÓN DEL DRAWER */}
        <Header
          darkMode={darkMode}
          drawer={() => this.props.navigation.openDrawer()}
        />

        {/* BALANCE HEADER */}
        <Balance
          darkmode={darkMode}
          balanceBtc={balanceBtc}
          balanceArs={balanceArs}
        />
        {/* TABS RESUMEN & ACTIVIDAD */}
        <Tabs
          style={styles.tabContainer}
          tabBarPosition="top"
          tabBarUnderlineStyle={{
            backgroundColor: "#0187d0"
          }}
        >
          <Tab
            activeTextStyle={styles.textStyle}
            activeTabStyle={styles.activeTabStyle}
            tabStyle={styles.activeTabStyle}
            textStyle={styles.textStyle}
            heading={
              <TabHeading
                style={{ backgroundColor: darkMode ? "#000" : "#fff" }}
              >
                <Text
                  style={{
                    fontFamily: "ProductSans-Bold",
                    fontSize: 17,
                    color: darkMode ? "#fff" : "#000"
                  }}
                >
                  Resumen
                </Text>
              </TabHeading>
            }
          >
            <ScrollView
              style={{ backgroundColor: darkMode ? "#000" : "#fff" }}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
            >
              {/* OVERVIEW TAB COMPONENT */}
              <TabOverview
                style={{ backgroundColor: darkMode ? "#000" : "#fff" }}
                variationText="Variación"
                press={() => this.showModalCard()}
                variation={`${variation}`}
                styleVariation={
                  variation <= 0 ? styles.variationRed : styles.variationBlue
                }
                iconName={
                  variation <= 0 ? "md-arrow-dropdown" : "md-arrow-dropup"
                }
                iconType="Ionicons"
                cardText="Card text"
                btcBuy={price.isLoading ? "-" : `${btcBuy}`}
                btcSell={price.isLoading ? "-" : `${btcSell}`}
              />
            </ScrollView>
          </Tab>
          <Tab
            activeTextStyle={styles.textStyle}
            activeTabStyle={styles.activeTabStyle}
            tabStyle={styles.activeTabStyle}
            textStyle={styles.textStyle}
            heading={
              <TabHeading
                style={{
                  backgroundColor: darkMode ? "#000" : "#fff"
                }}
              >
                <Text
                  style={{
                    fontFamily: "ProductSans-Bold",
                    fontSize: 17,
                    color: darkMode ? "#fff" : "#000"
                  }}
                >
                  Actividad
                </Text>
              </TabHeading>
            }
          >
            {/* ACTIVITY TAB COMPONENT */}
            <TabActivity
              style={{ backgroundColor: darkMode ? "#000" : "#fff" }}
              onRefresh={this._onRefresh}
              refreshing={this.state.refreshing}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
              data={this.state.history}
            />
          </Tab>
        </Tabs>

        {/* FOOTER COMPONENT */}
        <Footer
          iconStyle={{
            textAlignVertical: "center",
            fontSize: 35,
            color: darkMode ? "#fff" : "#000"
          }}
          pressReceive={() => this.showModalSendBtc()}
          pressSend={() => this.showModalReceiveBtc()}
        />

        {/* BITCOIN CARD MODAL */}
        <ModalBitcoin
          balanceBtc={balanceBtc}
          balanceArs={balanceArs}
          btcSell={btcSell}
          btcBuy={btcBuy}
          price={price.isLoading}
          isModalVisible={this.state.isModalVisible}
          hideModalCard={() => this.hideModalCard()}
        />

        {/* SEND BTC MODAL */}
        <ModalSend
          isVisible={this.state.modalSendBtc}
          balanceBtc={balanceBtc}
          balanceArs={balanceArs}
          bitcoin={this.state.bitcoin}
          onChangeTextBtc={value => this.changeInputBitcoin(value)}
          onChangeTextAddress={value => this.changeInput(value)}
          onSubmitEditing={() => {
            this.refs["bitcoinAddress"]._root.focus();
          }}
          getClipboard={() => this.getClipboard()}
          sendBitcoin={() => this.sendBitcoin()}
          clipboard={this.state.clipboard}
          hideModalSendBtc={() => this.hideModalSendBtc()}
        />

        {/* RECEIVE MODAL */}
        <ModalReceive
          isVisible={this.state.modalReceiveBtc}
          balanceBtc={balanceBtc}
          copyToClipboard={() =>
            this.copyToClipboard("1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX")
          }
          hideModalReceiveBtc={() => this.hideModalReceiveBtc()}
        />
        <ModalConfirm
          isVisible={this.state.modalConfirm}
          montoArs={this.state.montoArs}
          bitcoin={this.state.bitcoin}
          clipboard={this.state.clipboard}
          hideModalConfirm={() => this.hideModalConfirm()}
          aceptSend={() =>
            this.aceptSend(this.state.clipboard, this.state.bitcoin)
          }
        />

        {/* SUCCESS & ERROR MODAL */}
        <Modal
          style={styles.modal}
          swipeDirection="down"
          isVisible={this.state.modalOk}
          onBackButtonPress={() => {
            this.hideModalOk();
          }}
          onBackdropPress={() => {
            this.hideModalOk();
          }}
          onSwipeComplete={() => {
            this.hideModalOk();
          }}
          animationInTiming={500}
          animationOutTiming={500}
          backdropOpacity={0}
        >
          <View>
            <View style={styles.modalHeaderTop}>
              <Text> </Text>
            </View>
            <View
              style={
                this.state.modalErrorSend && this.state.loadingSend == false
                  ? styles.modalErrorContainer
                  : styles.modalOk
              }
            >
              {this.state.loadingSend ? (
                <View
                  style={{
                    height: 300,
                    width: "90%",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    marginTop: 20
                  }}
                >
                  <Text style={[styles.title, { marginBottom: 25 }]}>
                    Cargando...
                  </Text>
                  <ActivityIndicator size="large" color="#0187d0" />
                </View>
              ) : (
                <View>
                  {this.state.modalErrorSend ? (
                    <View>
                      <Text style={styles.modalErrorTitle}>
                        Error al enviar bitcoins
                      </Text>
                      <Text style={styles.subtitleError}>
                        Por favor vuelve a intentarlo mas tarde
                      </Text>
                      <Text style={[styles.modalErrorTitle, { marginTop: 15 }]}>
                        :(
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.modalOkContainer}>
                      <Text style={styles.modalOkTitle}>
                        ¡Transferencia realizada con éxito!
                      </Text>
                      <Image
                        source={require("../../assets/checked.png")}
                        style={{
                          width: 100,
                          height: 100,
                          marginTop: 30,
                          marginBottom: 30
                        }}
                        resizeMode="center"
                      />
                      <Text style={styles.title}>Tu nuevo balance {"\n"}</Text>
                      <Text style={styles.modalOkBalances}>
                        BTC {balanceBtc} {"\n"}
                        AR$ {balanceArs}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { price, wallet } = state;
  return {
    price,
    wallet
  };
}

const mapDispachToProps = dispatch => {
  return {
    onLoadPrices: data => dispatch(loading(data)),
    getPrices: data => dispatch(getPrices(data)),
    getWallet: data => dispatch(getWallet(data)),
    getHistory: data => dispatch(getHistory(data)),
    postHistory: (address, fecha, monto, fee, error) =>
      dispatch(postHistory(address, fecha, monto, fee, error)),
    sendBtc: (address, monto) => dispatch(sendBtc(address, monto))
  };
};

const connectedHomeScreen = connect(
  mapStateToProps,
  mapDispachToProps
)(withNavigation(HomeScreen));
export { connectedHomeScreen as HomeScreen };
