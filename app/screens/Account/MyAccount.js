import React, {useState, useEffect} from 'react';
import * as firebase from 'firebase';
import Loading from '../../componentes/Loading';
import UserGuest from './UserGuest';
import UserLogged from './UserLogged';



export default function MyAccount(){
   const[login, setLogin] = useState(null);

   useEffect(() =>{
        firebase.auth().onAuthStateChanged(user => {
            !user ? setLogin(false) : setLogin(true);
        })
   }, []);

   
   if(login === null){
       return(
            <Loading isVisible={true} text="cargando..."></Loading>
       );
   }

   return login ? <UserLogged/> : <UserGuest/>
  
}