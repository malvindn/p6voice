import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';

import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';

type Props = {};
type State = {
  pitch: string;
  error: string;
  end: string;
  started: string;
  results: string[];
  isStatusLight: boolean;
};

class App extends Component<Props, State> {
  state = {
    pitch: '',
    error: '',
    end: '',
    started: '',
    results: [],
    isStatusLight: false,
  };

  constructor(props: Props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart = (e: any) => {
    console.log('onSpeechStart: ', e);
    this.setState({
      started: '√',
    });
  };

  onSpeechEnd = (e: any) => {
    console.log('onSpeechEnd: ', e);
    this.setState({
      end: '√',
    });
  };

  onSpeechError = (e: SpeechErrorEvent) => {
    console.log('onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
    });
  };

  onSpeechResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechResults: ', e);
    this.setState({
      results: e.value,
    });
    e.value.map((result, index) => {
      if(result.toLowerCase() === 'nyalakan lampu'){
        this.setState({
          isStatusLight: true,
        });
      }
      if(result.toLowerCase() === 'matikan lampu'){
        this.setState({
          isStatusLight: false,
        });
      }
      if(result.toLowerCase() === 'on'){
        this.setState({
          isStatusLight: true,
        });
      }
      if(result.toLowerCase() === 'off'){
        this.setState({
          isStatusLight: false,
        });
      }
    });
  };

  onSpeechVolumeChanged = (e: any) => {
    console.log('onSpeechVolumeChanged: ', e);
    this.setState({
      pitch: e.value,
    });
  };

  _startRecognizing = async () => {
    this.setState({
      pitch: '',
      error: '',
      started: '',
      results: [],
      end: '',
    });

    try {
      await Voice.start('id-ID');
    } catch (e) {
      console.error(e);
    }
  };

  _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    this.setState({
      pitch: '',
      error: '',
      started: '',
      results: [],
      end: '',
      isStatusLight: false,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>React Native Voice Command</Text>
        <Text style={styles.instructions}>
          Tekan tombol dan mulai bersuara.
        </Text>
        <Text style={styles.stat}>{`Started: ${this.state.started}`}</Text>
        <Text style={styles.stat}>{`Pitch: ${this.state.pitch}`}</Text>
        <Text style={styles.stat}>{`Error: ${this.state.error}`}</Text>
        <Text style={styles.stat}>Results:</Text>
        {this.state.results.map((result, index) => {
          return (
            <Text key={`result-${index}`} style={styles.stat}>
              {result}
            </Text>
          );
        })}
        <Text style={styles.stat}>{`End: ${this.state.end}`}</Text>
        <TouchableHighlight onPress={this._startRecognizing}>
          <Image style={styles.button} source={require('./src/button.png')} />
        </TouchableHighlight>
        <TouchableHighlight onPress={this._stopRecognizing}>
          <Text style={styles.action}>Stop Recognizing</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._cancelRecognizing}>
          <Text style={styles.action}>Cancel</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._destroyRecognizer}>
          <Text style={styles.action}>Destroy</Text>
        </TouchableHighlight>
        {this.state.isStatusLight ? 
          <Image style={styles.light} source={require('./src/light_on.png')} /> 
          : 
          <Image style={styles.light} source={require('./src/light_off.png')} />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
  light: {
    marginTop: 50,
    width: 200,
  },
});

export default App;