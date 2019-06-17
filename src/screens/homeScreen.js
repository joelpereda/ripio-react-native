import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Linking,
  Image,
  Clipboard,
  RefreshControl,
  Alert,
  StatusBar
} from "react-native";
import {
  Icon,
  Tabs,
  Tab,
  TabHeading,
  Toast,
  Form,
  Item,
  Input,
  Spinner
} from "native-base";
import { styles } from "../styles/styles";
import { stylesDark } from "../styles/stylesDark";
import { connect } from "react-redux";
import { getPrices, loading } from "../actions/price.actions";
import { getWallet, sendBtc } from "../actions/wallet.actions";
import { getHistory, postHistory } from "../actions/history.actions";
import { withNavigation } from "react-navigation";
import { LineChart } from "react-native-chart-kit";
import TabOverview from "../components/tabOverview";
import TabActivity from "../components/tabActivity";
import Footer from "../components/footer";
import Modal from "react-native-modal";
import coinAddressValidator from "coin-address-validator";
import { ScrollView } from "react-native-gesture-handler";
import { Styles } from "../styles/styles";
import HistoryCard from "../components/historyCard";
import moment from "moment";
import SplashScreen from "react-native-splash-screen";
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
      history: [],
      currentDate: new Date(),
      markedDate: moment(new Date()).format("DD/MM/YYYY HH:MM")
    };
  }

  componentDidMount() {
    SplashScreen.hide();
    this.props.onLoadPrices(true);
    this._getPrices();
    this._getWallet();
    this._getHistory();
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

  sendBitcoin() {
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

  aceptSend(address, budget) {
    const date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
    let fecha = date;
    let fee = 0.0002;
    let { wallet } = this.props;
    let balanceBtc = wallet.isLoading ? 0 : wallet.data[0].balance;
    let monto = balanceBtc - budget;

    this.props
      .sendBtc(address, monto)
      .then(data => {
        if (data.data == "TypeError: Network request failed") {
          this.props.postHistory(address, fecha, budget, fee, true);
          this.loadingSend(true);
          this.showModalOk();
          setTimeout(() => {
            this.loadingSend(false);
            this.showModalErrorSend();
          }, 2000);
        } else {
          this.hideModalErrorSend();
          this.loadingSend(true);
          this.showModalOk();
          this.props.postHistory(address, fecha, budget, fee, false);
          setTimeout(() => {
            this.props.getWallet().then(wallet => {
              this.setState({
                wallet: wallet.data,
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

  copyToClipboard(value) {
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
    var content = await Clipboard.getString();
    this.setState({
      clipboard: content
    });
  }

  changeInputBitcoin(value) {
    this.setState({
      bitcoin: value
    });
  }

  changeInput(value) {
    this.setState({
      clipboard: value
    });
  }

  _onPressItemCard = () => {
    console.log("object");
  };
  //FLAT LIST BITCOIN HISTORY CARD
  _keyExtractor = (item, index) => item._id;

  _renderItem = ({ item, index }) => (
    <HistoryCard
      id={index + 200}
      address={item.address}
      date={item.date}
      monto={item.monto}
      fee={item.fee}
      press={this._onPressItemCard}
      error={item.error}
    />
  );

  render() {
    const today = this.state.currentDate;
    const day = moment(today).format("dddd");
    const date = moment(today).format("MMMM D, YYYY");
    let { price, wallet } = this.props;
    let btcSell = this.state.btcSell;
    let btcBuy = this.state.btcBuy;
    let variation = this.state.variation.substr(0, 6);
    let balanceBtc = wallet.isLoading ? 0 : wallet.data[0].balance;
    let balanceArs = balanceBtc * btcSell;
    balanceArs = balanceArs.toString().substr(0, 9);
    balanceBtc = balanceBtc.toString().substr(0, 14);
    let darkMode = price.darkMode;
    return (
      <View style={darkMode ? stylesDark.container : styles.container}>
        <StatusBar
          backgroundColor={darkMode ? "#000" : "#fff"}
          barStyle={darkMode ? "light-content" : "dark-content"}
        />
        <Styles />
        <View style={styles.rowContainer}>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://ripio.com/es/")}
          >
            {/* <Text style={styles.title}>ripio.</Text> */}
            <Image
              source={
                darkMode
                  ? require("../../assets/ripio-white.png")
                  : require("../../assets/ripio-dark.png")
              }
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
            <Icon
              name="menu"
              type="MaterialIcons"
              style={[
                styles.icon,
                { color: darkMode ? "#fff" : "#000", marginTop: 5 }
              ]}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.balanceContainer}>
          <Text
            style={
              darkMode ? stylesDark.balanceTextTitle : styles.balanceTextTitle
            }
          >
            MI BALANCE
          </Text>
          <Text
            style={
              darkMode ? stylesDark.balanceTextValue : styles.balanceTextValue
            }
          >
            AR$ {balanceArs ? balanceArs : 0}
          </Text>
          <Text
            style={darkMode ? stylesDark.balanceBtcText : styles.balanceBtcText}
          >
            BTC {balanceBtc ? balanceBtc : 0}
          </Text>
        </View>

        <Tabs
          style={styles.tabContainer}
          tabBarPosition="top"
          tabBarUnderlineStyle={{
            backgroundColor: "#0187d0"
          }}
        >
          <Tab
            activeTextStyle={{
              color: darkMode ? "#000" : "#fff",
              fontFamily: "ProductSans-Bold"
            }}
            activeTabStyle={{
              backgroundColor: "transparent",
              shadowColor: "transparent",
              shadowOpacity: 0
            }}
            tabStyle={{
              backgroundColor: "transparent",
              shadowColor: "transparent",
              shadowOpacity: 0
            }}
            textStyle={{ fontFamily: "ProductSans-Bold" }}
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
            activeTextStyle={{
              color: darkMode ? "#fff" : "#000",
              fontFamily: "ProductSans-Bold"
            }}
            activeTabStyle={{
              backgroundColor: darkMode ? "#000" : "#fff",
              shadowColor: "transparent",
              shadowOpacity: 0
            }}
            tabStyle={{
              backgroundColor: darkMode ? "#000" : "#fff",
              shadowColor: "transparent",
              shadowOpacity: 0,
              elevation: 0
            }}
            textStyle={{
              fontFamily: "ProductSans-Bold"
            }}
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
        <Footer
          iconStyle={{
            textAlignVertical: "center",
            fontSize: 35,
            color: darkMode ? "#fff" : "#000"
          }}
          pressReceive={() => this.showModalSendBtc()}
          pressSend={() => this.showModalReceiveBtc()}
        />
        {/* MODAL CUANDO APRETAS EL CARD */}
        <Modal
          style={styles.modal}
          isVisible={this.state.isModalVisible}
          onBackButtonPress={() => {
            this.hideModalCard();
          }}
          onBackdropPress={() => {
            this.hideModalCard();
          }}
          onSwipeComplete={() => {
            this.hideModalCard();
          }}
          swipeDirection="down"
          animationInTiming={1000}
          animationOutTiming={1000}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropOpacity={0}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>MI BALANCE</Text>
              <Text style={styles.modalBalanceBtc}>{balanceBtc} BTC</Text>
              <Text style={styles.modalBalanceArs}>AR$ {balanceArs}</Text>
            </View>
            <View style={styles.modalActivity}>
              <View style={styles.chartViewModal}>
                <Text style={styles.title}>Cotización del Bitcoin</Text>
                <Text style={styles.subtitleChart}>
                  1 BTC = {price.isLoading ? "-" : `AR$ ${btcSell}`}
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
                          btcBuy.toString().substr(0, 6)
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
        </Modal>

        {/* MODAL CUANDO APRETAS ENVIAR BTC */}
        <Modal
          style={styles.modal}
          swipeDirection="down"
          isVisible={this.state.modalSendBtc}
          onBackButtonPress={() => {
            this.hideModalSendBtc();
          }}
          onBackdropPress={() => {
            this.hideModalSendBtc();
          }}
          onSwipeComplete={() => {
            this.hideModalSendBtc();
          }}
          animationInTiming={1000}
          animationOutTiming={1000}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropOpacity={0}
        >
          <View style={styles.modalContainerSend}>
            <Text style={styles.modalTitleSend}>ENVIAR BTC</Text>
            <View style={styles.modalSendSaldo}>
              <View style={styles.modalHeaderSend}>
                <Text style={styles.saldoDisponible}>SALDO BTC</Text>
                <Text style={styles.cardText}>{balanceBtc}</Text>
              </View>
              <View style={styles.modalHeaderSend}>
                <Text style={styles.saldoDisponible}>SALDO AR$</Text>
                <Text style={styles.cardText}>{balanceArs}</Text>
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
                    value={this.state.bitcoin}
                    onChangeText={value => this.changeInputBitcoin(value)}
                    keyboardType="numeric"
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      this.refs["bitcoinAddress"]._root.focus();
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
                    value={this.state.clipboard}
                    onChangeText={value => this.changeInput(value)}
                  />
                </Item>
              </Form>
              <TouchableOpacity onPress={() => this.getClipboard()}>
                <Text style={styles.sendClipboardText}>
                  Pegar dirección desde el portapapeles
                </Text>
              </TouchableOpacity>
              <Text style={styles.feeText}>Fee 0.0002</Text>
            </View>
            <TouchableOpacity
              style={styles.buttonSend}
              onPress={() => {
                this.sendBitcoin();
              }}
            >
              <Text style={styles.buttonSendText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* MODAL CUANDO APRETAS ENVIAR BTC */}
        <Modal
          style={styles.modal}
          swipeDirection="down"
          isVisible={this.state.modalReceiveBtc}
          onBackButtonPress={() => {
            this.hideModalReceiveBtc();
          }}
          onBackdropPress={() => {
            this.hideModalReceiveBtc();
          }}
          onSwipeComplete={() => {
            this.hideModalReceiveBtc();
          }}
          animationInTiming={1000}
          animationOutTiming={1000}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropOpacity={0}
        >
          <View style={styles.modalContainerReceive}>
            <Text style={styles.modalTitleReceive}>RECIBIR BTC</Text>
            <View style={styles.modalHeaderReceive}>
              <Text style={styles.saldoDisponible}>Saldo disponible</Text>
              <Text style={styles.cardText}>{balanceBtc} BTC</Text>
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
                  onPress={() =>
                    this.copyToClipboard("1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX")
                  }
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
        </Modal>
        <Modal
          style={styles.modal}
          swipeDirection="down"
          isVisible={this.state.modalConfirm}
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
                {this.state.bitcoin} BTC {"\n"}
                ARS {this.state.montoArs}
                {"\n"}
              </Text>
              <Text style={styles.addressConfirm}>
                Address: {"\n"}
                {this.state.clipboard}
              </Text>
              <View style={styles.feeContainer}>
                <Text style={styles.feeText}>Fee: 0.0002 BTC</Text>
              </View>
            </View>
            <View style={styles.confirmBtnContainer}>
              <TouchableOpacity
                style={styles.buttonCancel}
                onPress={() => {
                  this.hideModalConfirm();
                }}
              >
                <Text style={styles.buttonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonConfirm}
                onPress={() => {
                  this.hideModalConfirm();
                  this.aceptSend(this.state.clipboard, this.state.bitcoin);
                }}
              >
                <Text style={styles.buttonConfirmText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* <Modal
          style={styles.modalLoad}
          swipeDirection="down"
          isVisible={this.state.modalLoading}
          onBackButtonPress={() => {}}
          onBackdropPress={() => {}}
          onSwipeComplete={() => {}}
          animationInTiming={1000}
          animationOutTiming={1000}
          animationIn="fadeIn"
          animationOut="fadeOut"
          backdropOpacity={0}
        >
          <View style={styles.modalLoading}>
            <Spinner />
          </View>
        </Modal> */}
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
          <View
            style={
              this.state.modalErrorSend && this.state.loadingSend == false
                ? styles.modalErrorContainer
                : styles.modalOk
            }
          >
            {/* <View style={styles.modalOkHeader}>
              <TouchableOpacity onPress={() => this.hideModalOk()}>
                <Icon
                  name="md-close"
                  type="Ionicons"
                  style={{ color: "#000" }}
                />
              </TouchableOpacity>
            </View> */}
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
                {/* <Placeholder isReady={!this.state.loadingSend} animation="fade">
                  <Line width="70%" />
                  <Line />
                  <Line />
                  <Line width="30%" />
                  <Line />
                  <Line />
                  <Line width="70%" />
                  <Line />
                  <Line width="30%" />
                  <Line width="50%" />
                </Placeholder> */}
                <Spinner />
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
