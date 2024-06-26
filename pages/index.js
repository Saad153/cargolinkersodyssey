import React from 'react';
import axios from 'axios';
import Cookies from 'cookies';
import Main from '/Components/Layouts/Main/';

const index = ({sessionData}) => {
  return (
    <Main sessionData={sessionData} />
  )
}

export default index

export async function getServerSideProps({req,res}){
  
  const cookies = new Cookies(req, res)
  const sessionRequest = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_LOGIN_VERIFICATION,{
    headers:{"x-access-token": `${cookies.get('token')}`}
  }).then((x)=>x.data);

  return{
    props: { 
      sessionData:sessionRequest
    }
  }
}