import React, { Component } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Icon } from "native-base";
import { styles } from "../styles/styles";

class Header extends Component {
  drawer(drawer) {
    drawer();
  }
  render() {
    const { drawer } = this.props;
    return (
      <View style={styles.rowContainer}>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://ripio.com/es/")}
        >
          <Image
            source={
              this.props.darkMode
                ? require("../../assets/ripio-white.png")
                : require("../../assets/ripio-dark.png")
            }
            style={{ width: 50, height: 50 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.drawer(drawer)}>
          <Icon
            name="menu"
            type="MaterialIcons"
            style={[
              styles.icon,
              { color: this.props.darkMode ? "#fff" : "#000", marginTop: 5 }
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

export default Header;
