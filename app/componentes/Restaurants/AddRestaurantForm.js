import React,{useState, useEffect} from 'react';
import {StyleSheet, View, ScrollView, Alert, Dimensions} from 'react-native';
import {Icon, Avatar, Image, Input, Button} from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import Modal from '../Modal';
import uuid from 'uuid/v4';

import {firebaseApp} from '../../utils/FireBase';
import firebase from 'firebase/app';
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props){
    const {toastRef, setIsLoading, navigation, setIsReloadRestaurants} = props;
    const [imagesSelected, setImagesSelected] = useState([]);
    const [restaurantName, setRestaurantName ] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantDescription, setRestaurantDescription] = useState("");
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);

    const addRestaurant = () => {
        if(!restaurantName || !restaurantAddress || !restaurantDescription){
            toastRef.current.show("Existen Campos Sin Llenar");
        }else if(imagesSelected.length === 0){
            toastRef.current.show("Debe de seleccionar una foto");
        }else if(!locationRestaurant){
            toastRef.current.show("Debe de seleccionar una ubicacion");
        }else{
            setIsLoading(true);
            uploadImagesStorage(imagesSelected).then(arrayImages => {
                db.collection("restaurants").add({
                    name : restaurantName,
                    address : restaurantAddress,
                    description : restaurantDescription,
                    location : locationRestaurant,
                    images : arrayImages,
                    rating : 0,
                    ratingTotal : 0,
                    quantityVoting : 0,
                    createAt : new Date(),
                    createBy : firebaseApp.auth().currentUser.uid
                }).then(() => {
                    setIsLoading(false);
                    setIsReloadRestaurants(true);
                    navigation.navigate("Restaurants");
                }).catch(error => {
                    setIsLoading(false);
                    toastRef.current.show("Error al crear el restaurante");
                    console.log(error);
                });
            });
        }
    };

    const uploadImagesStorage = async imageArray => {
        const imagesBlob = [];
        await Promise.all(
            imageArray.map(async image => {
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebase
                    .storage()
                    .ref("restaurant-images")
                    .child(uuid());
                await ref.put(blob).then(result => {
                    imagesBlob.push(result.metadata.name);
                });
            })
        );
        return imagesBlob;
    };

    return(
        
        <ScrollView>
            <ImageResturant  imageRestaurant={imagesSelected[0]}/>
            <UploadImagen imagesSelected={imagesSelected} setImagesSelected={setImagesSelected} toastRef={toastRef}/>
            <FormAdd setRestaurantName={setRestaurantName} setRestaurantAddress={setRestaurantAddress} setRestaurantDescription={setRestaurantDescription} setIsVisibleMap={setIsVisibleMap} locationRestaurant={locationRestaurant}/>
            <Button 
                title = "Crear Restaurante"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <Map isVisibleMap={isVisibleMap} setIsVisibleMap={setIsVisibleMap} setLocationRestaurant={setLocationRestaurant} toastRef={toastRef}/>
        </ScrollView>
    );
}

function ImageResturant(props){
    const {imageRestaurant} = props;
    return(
        <View style={styles.vewPhoto}>
            {imageRestaurant ? (
                <Image 
                    source={{uri : imageRestaurant}}
                    style={{width : widthScreen, height : 200}}
                />
            ) : (
                <Image 
                    source={require("../../../assets/img/no-image.png")}
                    style={{width : widthScreen, height : 200}}
                />
            )}
        </View>
    );
}

function UploadImagen(props){
    const {imagesSelected, setImagesSelected, toastRef} = props;

    const imageSelect = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const resultPermissionCamera = resultPermission.permissions.cameraRoll.status;

        if(resultPermissionCamera === "denied"){
            toastRef.current.show("No se tiene Permiso",3000);
        }else{
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing : true,
                aspect : [4,3]
            });
            if(result.cancelled){
                toastRef.current.show("Operacion Cancelada",2000);
            }else{
                setImagesSelected([...imagesSelected, result.uri]);
            }
        }
    };

    //console.log(imagesSelected);
    const removeImage = image => {
        const arrayImages = imagesSelected;
        Alert.alert(
            "Eliminar Imagen",
            "¿Estas seguro que quieres elimanar la imagen?",
            [
                {
                    text : "Cancel",
                    style : "cancel"
                },
                {
                    text : "Eliminar",
                    onPress : () => setImagesSelected(arrayImages.filter(imageUrl => imageUrl !== image))
                }
            ],
            {cancelable : false}
        );
    };
    return(
        <View style={styles.viewImage}>
            {imagesSelected.length < 4 && (
                <Icon 
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )}

            {imagesSelected.map(imageRestaurant => (
                  <Avatar 
                  key={imageRestaurant}
                  onPress={() => removeImage(imageRestaurant)}
                  style={styles.miniatureStyle}
                  source={{uri : imageRestaurant}}
              />
            ))}
        </View>
    );
}

function FormAdd(props){
    const {setRestaurantName, setRestaurantAddress, setRestaurantDescription, setIsVisibleMap, locationRestaurant} = props;
    return(
        <View style={styles.viewForm}>
            <Input 
                placeholder="Nombre del restaurante"
                containerStyle={styles.input}
                onChange={e => setRestaurantName(e.nativeEvent.text)}
            />
            <Input 
                placeholder="Direccion"
                containerStyle={styles.input}
                rightIcon={{
                    type : "material-community",
                    name : "google-maps",
                    color : locationRestaurant ? "#00a680" : "#c2c2c2",
                    onPress : () => setIsVisibleMap(true)
                }}
                onChange={e => setRestaurantAddress(e.nativeEvent.text)}
            />
            <Input 
                placeholder="Descripcion del restaurante"
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={e => setRestaurantDescription(e.nativeEvent.text)}
            />
        </View>
    );
}

function Map(props){
    const {isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef} = props;
    const [location, setLocation] = useState(null);
    useEffect(() => {
        (async () => {
            const resultPermissions = await Permissions.askAsync(Permissions.LOCATION);
            const stausPermissions = resultPermissions.permissions.location.status;
            if(stausPermissions !== "granted"){
                toastRef.current.show("No se tiene permiso para acceder a la localizacion",3000);
            }else {
                const loc = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude : loc.coords.latitude,
                    longitude : loc.coords.longitude,
                    latitudeDelta : 0.001,
                    longitudeDelta : 0.001
                });
            }
        })();
    }, [])

    const confirmLocation = () => {
        setLocationRestaurant(location);
        toastRef.current.show("Localizacion Guardada");
        setIsVisibleMap(false);
    }

    return (
        <Modal isVisible={isVisibleMap} setIsVisibleMap={setIsVisibleMap} >
            <View>
                {location && (
                    <MapView style={styles.mapStyle} initialRegion={location} showsUserLocation={true} onRegionChange={region => setLocation(region)}>
                        <MapView.Marker 
                            coordinate={{
                                latitude : location.latitude,
                                longitude : location.longitude
                            }}
                            draggable
                        />
                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                            <Button
                                title="Guardar Ubicacion"
                                onPress={confirmLocation}
                                containerStyle={styles.viewMapBtnContainerSave}
                                buttonStyle={styles.viewMapBtnSave}
                            >
                            </Button>
                            <Button 
                                title="Cancelar"
                                onPress={() => setIsVisibleMap(false)}
                                containerStyle={styles.viewMapBtnContainerCancel}
                                buttonStyle={styles.viewMapBtnCancel}
                            >
                            </Button>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    vewPhoto : {
        alignItems : "center",
        height : 200,
        marginBottom : 20
    },
    viewImage : {
        flexDirection : 'row',
        marginLeft : 20,
        marginRight : 20,
        marginTop : 30
    },
    containerIcon : {
        alignItems : "center",
        justifyContent : "center",
        marginRight : 10,
        height : 70,
        width : 70,
        backgroundColor : "#e3e3e3"
    },
    miniatureStyle : {
        width : 70,
        height : 70,
        marginRight : 10
    },
    viewForm : {
        marginLeft : 10,
        marginRight : 10
    },
    input : {
        marginBottom : 10
    },
    textArea : {
        height : 100,
        width : "100%",
        padding : 0,
        margin : 0
    },
    mapStyle : {
        width : "100%",
        height : 550
    },
    viewMapBtn : {
        flexDirection : "row",
        justifyContent : "center",
        marginTop : 10

    },
    viewMapBtnContainerSave : {
        paddingRight : 5
    },
    viewMapBtnSave : {
        backgroundColor : "#00a680"
    },
    viewMapBtnContainerCancel : {
        paddingLeft: 5
    },
    viewMapBtnCancel : {
        backgroundColor : "#a60d0d"
    },
    btnAddRestaurant : {
        backgroundColor : "#00a680",
        margin : 20
    }
});