import { View, Text, StyleSheet } from 'react-native';

export default function Inbox() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Inbox Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  text: {
    fontFamily: 'Jakarta-Bold', fontSize: 20
  }
});
