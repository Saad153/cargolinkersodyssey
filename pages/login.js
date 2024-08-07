import React from 'react';
import Login from '../Components/Layouts/Login';
import axios from 'axios';
import Cookies from 'cookies';
import jwt_decode from 'jwt-decode';


const login = ({sessionData}) => {
  return (
    <div>
      <Login sessionData={sessionData} />
    </div>
  )
}

export default login

export async function getServerSideProps({req,res}){
  const cookies = new Cookies(req, res)
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);
  return{
      props: { sessionData:sessionRequest }
  }
}