import React from 'react';
import {
  Text,
  StyleSheet,
} from 'react-native';
import { 
  Link,
} from 'react-router-dom';

export const LinkToRoot: React.FC = () => {
  return (
    <Link to="/">
      <Text style={styles.linkToRootText}>
        Go back to root page
      </Text>
    </Link>
  );
}

const styles = StyleSheet.create({
  linkToRootText: {
    fontSize: 16,
  }
});
