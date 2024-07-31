import Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';

function checkDesignation(pageName){
  // console.log(pageName);


  
  //getting the token from cookies and decoding it to get the access level array.
  let token = null;
  
  if(Cookies.get("token") != null){
    token = jwt_decode(Cookies.get("token")).designation;
  }
  let access = false;
  let newTemp = [];
  
//   console.log(token);
//   console.log(pageName.toLowerCase());
    if(token === pageName.toLowerCase()){
      access = true;
    }
  
  
  


  return access
}

export { checkDesignation }