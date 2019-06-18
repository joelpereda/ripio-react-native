/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component } from "react";
import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator
} from "react-navigation";
import { Root } from "native-base";
import { Drawer } from "./src/components/drawer";
import { HomeScreen } from "./src/screens/homeScreen";
import { Provider } from "react-redux";
import { store } from "./src/helpers/store";

//Drawer
const DrawerStack = createDrawerNavigator(
  {
    Menu: {
      screen: HomeScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    contentComponent: Drawer,
    drawerWidth: 290,
    drawerPosition: "left",
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle",
    drawerBackgroundColor: "transparent"
  }
);

//Navigator
let RootStack = createStackNavigator({
  Home: {
    screen: DrawerStack,
    navigationOptions: {
      header: null
    }
  }
});

let Navigation = createAppContainer(RootStack);
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <Root>
        <Provider store={store}>
          <Navigation />
        </Provider>
      </Root>
    );
  }
}
