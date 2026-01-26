import { StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>SPLASH SCREEN TEST</Text>
      <Text style={styles.text}>If you see this, routing works!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  text: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
  },
});
