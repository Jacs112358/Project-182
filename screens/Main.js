import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	StatusBar,
	Platform,
	ScrollView,
	TouchableOpacity,
	Image,
} from 'react-native';

import * as Permissions from 'expo-permissions';

import * as FaceDetector from 'expo-face-detector';
import { Camera } from 'expo-camera';

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

import Filter1 from '../components/Filter1'

export default class Main extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermissions: null,
      faces: [],
    };
    this.onCameraPermission = this.onCameraPermission.bind(this);
		this.onFacesDetected = this.onFacesDetected.bind(this);
		this.onFaceDetectionError = this.onFaceDetectionError.bind(this);
  }

  componentDidMount() {
    Permissions.askAsync(Permissions.CAMERA).then(this.onCameraPermission);
  }

  onCameraPermission({ status }) {
		this.setState({ hasCameraPermission: status === 'granted' });
	}

  onFacesDetected({faces}) {
    this.setState({faces: faces})
  }

  onFaceDetectionError(error) {
		console.log(error);
	}

  render() {
    const hasCameraPermissions = this.state;
    if (hasCameraPermissions === null) {
      return <View/>
    }
    if (hasCameraPermissions === false) {
      return(
        <View style={{flex: 1}}>
          <Text>No access to Camera</Text>
        </View>
      )  
    }
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={styles.droidSafeArea} />
        <View style={styles.upperContainer}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <Text style={styles.titleText}>Look At Me</Text>
          </View>  
        </View>
        <View style={styles.middleContainer}>
          <Camera 
            style={{ flex: 1 }}
					  	type={Camera.Constants.Type.front}
					  	faceDetectorSettings={{
					  		mode: FaceDetector.FaceDetectorMode.fast,
					  		detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
					  		runClassifications: FaceDetector.FaceDetectorClassifications.all,
					  	}}
					  	onFacesDetected={this.onFacesDetected}
					  	onFacesDetectionError={this.onFacesDetectionError}
          />
          {this.state.faces.map((face) => (
            <Filter1 key = {`face-id-${face.faceID}`} face={face}/>
          ))}
        </View>
        <View style={styles.lowerContainer}>
          
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  droidSafeArea: {
		marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
	},
  upperContainer: {
    flex: 0.15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ababab'
  },
  middleContainer: {
    flex: 1,
  },
  lowerContainer: {
    backgroundColor: '#ababab',
    flex: 0.15
  },
  titleText: {
    fontSize: RFValue(25),

  }
})