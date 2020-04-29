import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export const NavigationBar: React.FC = () => {
  return (
    <View style={styles.bar}>
      <Text style={styles.titleText}>
        RN4Web-Todo
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: "100%",
    height: 60,
    backgroundColor: "#191970",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 16,
    paddingRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fffafa",
  },
});
