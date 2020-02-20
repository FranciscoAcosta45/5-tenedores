import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, ScrollView, Text, Dimensions} from 'react-native';
import Corousel from '../../componentes/Carousel';
import {Rating, Icon, ListItem} from 'react-native-elements';
import Map from '../../componentes/Map';
import ListReviews from '../../componentes/Restaurants/ListReviews';
import Toast from 'react-native-easy-toast';

import {firebaseApp} from '../../utils/FireBase';
import firebase from 'firebase/app';
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

const screenWidth = Dimensions.get("window").width;
export default function Restaurant(props){
    const {navigation} = props;
    const {restaurant} = navigation.state.params;
    const [imagesRestaurant, setImagesRestaurant] = useState([]);
    const [rating, setRating] = useState(restaurant.rating);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userLogged, setUserLogged] = useState(false);
    const toastRef = useRef();

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false);
    })

    useEffect( () => {
        const arrayUrls = [];
        (async () => {
            await Promise.all(
                restaurant.images.map(async idImage => {
                    await firebase
                    .storage()
                    .ref(`restaurant-images/${idImage}`)
                    .getDownloadURL()
                    .then(imageUrl => {
                        arrayUrls.push(imageUrl);
                    });
                })
            );
            setImagesRestaurant(arrayUrls);
        })();
    },[]); 

    useEffect(() => {
        if(userLogged){
            db.collection("favorites").where("idRestaurant", "==", restaurant.id)
            .where("idUser", "==", firebase.auth().currentUser.uid).get().then(response => {
            if(response.docs.length === 1){
                setIsFavorite(true);
            }
        });
        }
    }, []);

    const addFavorite = () => {

        if(!userLogged){
            toastRef.current.show("Para usar el sistema de favoritos debes de estar Logeado",4000);
        }else {
            const payload = {
                idUser : firebase.auth().currentUser.uid,
                idRestaurant : restaurant.id
            };
            db.collection("favorites")
            .add(payload)
            .then(() => {
                setIsFavorite(true);
                toastRef.current.show("Restaurante añadido a favoritos");
            }).catch(() => {
                toastRef.current.show("Error al añadir a fovoritos");
            })
        }
    };
    const removeFavorite = () => {
        db.collection("favorites")
        .where("idRestaurant", "==", restaurant.id)
        .where("idUser", "==", firebase.auth().currentUser.uid )
        .get().then(response => {
            response.forEach(doc => {
                const idFavorite = doc.id;
                db.collection("favorites")
                .doc(idFavorite)
                .delete()
                .then(() => {
                    setIsFavorite(false);
                    toastRef.current.show("Eliminado de la lista de favoritos");
                }).catch(() => {
                    toastRef.current.show("Ha ocurrido un error");
                });
            });
        });
    };

    return(
        <ScrollView style={styles.viewBody}>
            <View style={styles.viewFavorite}>
            <Icon
                type="material-community"
                name = {isFavorite ? "heart" : "heart-outline"}
                onPress={isFavorite ? removeFavorite : addFavorite}
                color={isFavorite ? "#00a680" : "#000"}
                size={35}
                underlayColor="transparent"
            ></Icon>
            </View>
            <Corousel 
                arrayImages={imagesRestaurant}
                width={screenWidth}
                height={200}
            />
            <TitleRestaurant 
                name={restaurant.name}
                description={restaurant.description}
                rating={rating}
            />
            <RestaurantInfo 
                location={restaurant.location}
                name={restaurant.name}
                address={restaurant.address}
            />
            <ListReviews 
                navigation={navigation}
                idRestaurant={restaurant.id}
                setRating={setRating}
            />
            <Toast 
                ref={toastRef} 
                position="center"
                opacity={0.5}
            />
        </ScrollView>
    );
}

function TitleRestaurant(props){
    const {name, description, rating} = props;
    return(
        <View style={styles.vewRestaurantTitle}>
            <View style={{flexDirection : 'row'}}>
                <Text style={styles.nameRestaurant}>{name}</Text>
                <Rating 
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <Text style={styles.descriptionRestaurant}>{description}</Text>
        </View>
    );
}

function RestaurantInfo(props){
    const {location, name, address} = props;
    const listInfo = [
        {
            text: address,
            iconName : "map-marker",
            iconType : "material-community",
            action : null
        }
    ]
    return(
        <View style={styles.vewRestaurantInfo}>
            <Text style={styles.restaurantInfoTitle}>Infromacion sobre el restaurante</Text>
            <Map location={location} name={name} height={100}>
            </Map>
            {listInfo.map((item, index) => (
                <ListItem 
                    key={index}
                    title={item.text}
                    leftIcon={{
                        name : item.iconName,
                        type : item.iconType,
                        color : "#00a680"
                    }}
                    containerStyle={styles.containerListItem}
                />
            ))}
        </View>
    );
}
const styles = StyleSheet.create({
    viewBody : {
        flex : 1
    },
    vewRestaurantTitle : {
        margin : 15
    },
    nameRestaurant : {
        fontSize : 20,
        fontWeight : 'bold'
    },
    rating : {
        position : "absolute",
        right : 0
    },
    descriptionRestaurant : {
        marginTop : 5,
        color : "grey"
    },
    vewRestaurantInfo : {
        margin : 15,
        marginTop : 25
    },
    restaurantInfoTitle : {
        fontSize : 20,
        fontWeight : 'bold',
        marginBottom : 10
    },
    containerListItem : {
        borderBottomColor : "#d8d8d8",
        borderBottomWidth : 1
    },
    viewFavorite : {
        position : "absolute",
        top : 0,
        right : 0,
        zIndex : 2,
        backgroundColor : "#fff",
        borderBottomLeftRadius : 100,
        paddingTop : 5,
        paddingBottom : 5,
        paddingLeft : 15,
        paddingRight : 5
    }
})