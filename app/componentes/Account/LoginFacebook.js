import React, {useState} from 'react';
import {SocialIcon} from 'react-native-elements';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import {FacebookApi} from '../../utils/Social';
import Loading from '../Loading';

export default function LoginFacbook(props){
    const {toastRef, navigation} = props;
    const [isLoading, setIsLoading] = useState(false);
    const login = async() =>{
        const {type, token} = await Facebook.logInWithReadPermissionsAsync(
            FacebookApi.application_id,
            {permissions : FacebookApi.permissions}
        );

        if(type === "succes"){
            setIsLoading(true);
            const credentials = firebase.auth.FacebookAuthProvider.credential(token);
            await firebase
            .auth()
            .signInWithCredential(credentials)
            .then(() => {
                navigation.navigate("MyAccount");
            })
            .catch(function(error){
                console.log(error);
                toastRef.current.show('Error acediendo con Facebook');
            })
        }else if(type === "cancel"){
            toastRef.current.show('Inicion cancelado');
            console.log('inicio de sesion cancelado');
        }
        else {
            toastRef.current.show('Error desconocido');
        }
        setIsLoading(false);
    };
    return(
        <>
            <SocialIcon
                title="Iniciar sesion con Facebook"
                button
                type="facebook"
                onPress={login}
             >

             </SocialIcon>
            <Loading isVisible={isLoading} text="iniciando sesion"></Loading>
        </>
    );
}