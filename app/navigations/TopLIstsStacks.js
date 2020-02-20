import {createStackNavigator} from 'react-navigation-stack';
import TopRestaurantsScreen from '../screens/TopRestaurants';

const TopListScreenStacks = createStackNavigator({
    TopRestaurants:{
        screen: TopRestaurantsScreen,
        navigationOptions: () => ({
            title: "Los mejores top Restaurantes"
        })
    }
});

export default TopListScreenStacks;