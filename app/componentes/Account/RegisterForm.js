import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native'; 
import {Input, Icon, Button} from 'react-native-elements';
import {validateEmail} from '../../utils/Validation';
import * as firebase from 'firebase';
import {withNavigation} from 'react-navigation';
import Loading from '../Loading';


function RegisterForm(props){
    const {toastRef, navigation} = props;
    const [hidePassword, setHidePassword] = useState(true);
    const [hideRepeatPassword, setHideRepeatPassword] = useState(true);
    const [isVisibleLoading, setIsVisibleLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const register = async () => {
        setIsVisibleLoading(true);
        if(!email || !password || !repeatPassword){
            toastRef.current.show("todos los campos son obligatorios");
        }else{
            if(!validateEmail(email)){
                toastRef.current.show("El email no es valido");
            }else{
                if(password !== repeatPassword){
                    toastRef.current.show("las contraseñas no son iguales");
                }else{
                   await firebase.
                   auth()
                   .createUserWithEmailAndPassword(email, password)
                   .then(() => {
                        navigation.navigate("MyAccount");
                   })
                   .catch(function(error){
                    toastRef.current.show("ha ucurrido un error con el servidor");
                       console.log(error);
                   });
                }
            }
        }

        setIsVisibleLoading(false);
    };

    return(
        <View style={styles.fromContainer}>
            <Input
                placeholder="correo electronico"
                containerStyle={styles.inputForm}
                onChange={e => setEmail(e.nativeEvent.text) }
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}
                    >
                    </Icon>
                }
            >
            </Input>
            <Input
                placeholder={"contraseña"}
                password={true}
                secureTextEntry={hidePassword}
                containerStyle={styles.inputForm}
                onChange={e => setPassword(e.nativeEvent.text) }
                rightIcon={
                    <Icon
                        type="material-community"
                        name={hidePassword ? "eye-outline" : "eye-off-outline"}
                        iconStyle={styles.iconRight}
                        onPress={()=>setHidePassword(!hidePassword)}
                    >
                    </Icon>
                }
            >
            </Input>
            <Input
                placeholder={"Repetir contraseña"}
                password={true}
                secureTextEntry={hideRepeatPassword}
                containerStyle={styles.inputForm}
                onChange={e => setRepeatPassword(e.nativeEvent.text) }
                rightIcon={
                    <Icon
                        type="material-community"
                        name={hideRepeatPassword ? "eye-outline" : "eye-off-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() =>  setHideRepeatPassword(!hideRepeatPassword)}
                    >
                    </Icon>
                }
            >
            </Input>
            <Button
                title="unirse"
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={register}
           >
            </Button>
            <Loading text="Creando cuenta" isVisible={isVisibleLoading}/>
        </View>
    )
}

export default withNavigation(RegisterForm);

 const styles = StyleSheet.create({
    fromContainer : {
        flex: 1,
        alignItems : "center",
        justifyContent : "center",
        marginTop : 30
    },
    inputForm : {
        width : "100%",
        marginTop : 20,
    },
    iconRight : {
        color : "#c1c1c1"
    },
    btnContainerRegister : {
        marginTop : 20,
        width: "95%",

    },
    btnRegister : {
        backgroundColor : "#00a680"
    }

 })