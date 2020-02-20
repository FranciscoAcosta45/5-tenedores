import React, {useState ,useRef} from 'react';
import {View} from 'react-native';
import Toast from 'react-native-easy-toast';
import Loading from '../../componentes/Loading';
import AddRestaurantForm from '../../componentes/Restaurants/AddRestaurantForm';

export default function AddRestaurant(props){
    const {navigation} = props;
    const {setIsReloadRestaurants} = navigation.state.params;
    const toastRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    return(
        <View>
            <AddRestaurantForm 
                toastRef={toastRef}
                setIsLoading={setIsLoading} 
                navigation={navigation}
                setIsReloadRestaurants={setIsReloadRestaurants}
            />

            <Toast ref={toastRef} position="center" opacity={0.5}/>
            <Loading  isVisible={isLoading} text="Creando Restaurantes"/>
        </View>
    );
}
