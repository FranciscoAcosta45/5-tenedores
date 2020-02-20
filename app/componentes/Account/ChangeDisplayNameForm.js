import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Input, Button} from 'react-native-elements';
import * as firebase from 'firebase';

export default function ChangeDisplayNameForm(props) {
    const {displayName, setIsVisibleModal, setReloadData, toastRef} = props;
    const [newDisplayName, setNewDisplayName] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const upDateDisplayName = () => {
        setError(null);
        if(!newDisplayName){
            setError("El nombre del usuario no ha cambiado");
        }else{
            setIsLoading(true);
            const update = {
                displayName: newDisplayName
            }
            firebase
                .auth().currentUser.updateProfile(update).then(() => {
                    setIsLoading(false);
                    setReloadData(true);
                    toastRef.current.show("nombre actualizado");
                    setIsVisibleModal(false);
                })
                .catch(function(error){
                    setError("Error al actualizar el nombre");
                    console.log(error);
                    toastRef.current.show('Error al cambiar el nombre');
                    setIsLoading(false);
                })
        }
    }
    return(
        <View style={styles.view}>
            <Input
                placeholder="Nombre"
                containerStyle={styles.input}
                defaultValue={displayName && displayName}
                onChange={e => setNewDisplayName(e.nativeEvent.text)}
                rightIcon={{
                    type : "material-community",
                    name : "account-circle-outline",
                    color : "#c2c2c2"
                }}
                errorMessage={error}
            />
            <Button
                title="Cambiar Nombre"
                containerStyle={styles.btnContaiiner}
                buttonStyle={styles.btn}
                onPress={upDateDisplayName}
                loading={isLoading}
            />
        </View>
    )

};

const styles = StyleSheet.create({
    view: {
        alignItems : "center",
        paddingTop : 10,
        paddingBottom: 10
    },
    input :{
        marginBottom : 10
    },
    btnContaiiner : {
        marginTop : 20,
        width : "100%"
    },
    btn :{
        backgroundColor : "#00a680"
    }
})