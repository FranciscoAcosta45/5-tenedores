import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import  {Button} from 'react-native-elements';
import * as firebase from 'firebase';
import InfoUser from '../../componentes/Account/InfoUser';
import Toast from 'react-native-easy-toast';
import Loading from '../../componentes/Loading';
import AccountOptions from '../../componentes/Account/AccountOptions';

export default function UserLogged(){
    const [userInfo, setUserInfo] = useState({});
    const [reloadData, setReloadData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [textLoading, setTextLoading] = useState("");
    const toastRef = useRef();
    useEffect ( ()=> {
        (async () => {
            const user = await firebase.auth().currentUser;
            setUserInfo(user.providerData[0]);
        })();
        setReloadData(false);
    }, [reloadData]);

    return(
        <View style={styles.viewUserInfo}>
            <InfoUser userInfo={userInfo} setReloadData={setReloadData} toastRef={toastRef} setIsLoading={setIsLoading} setTextLoading={setTextLoading}>
                
            </InfoUser>
            <AccountOptions userInfo={userInfo} setReloadData={setReloadData} toastRef={toastRef}></AccountOptions>
            <Button 
                title="Cerrar Sesion"
                buttonStyle={styles.btnCloseSesion}
                titleStyle={styles.btnCloseSesionText}
                onPress={() => firebase.auth().signOut()}
            />
            <Toast ref={toastRef} position="center" opacity={0.5}></Toast>
            <Loading text={textLoading} isVisible={isLoading}></Loading>
        </View>
    );
}

const styles = StyleSheet.create({
    viewUserInfo : {
        minHeight : "100%",
        backgroundColor : "#f2f2f2"
    },
    btnCloseSesion : {
        marginTop : 30,
        borderRadius : 0,
        backgroundColor : "#fff",
        borderTopWidth : 1,
        borderTopColor : "#e3e3e3",
        borderEndWidth : 1,
        borderBottomColor : "#e3e3e3",
        paddingTop : 10,
        paddingBottom : 10

    },
    btnCloseSesionText : {
        color : "#00a680"
    }
});