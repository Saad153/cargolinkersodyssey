"use client"

import { useQuery } from '@tanstack/react-query';
import { getJobValues } from '/apis/jobs';
import React, { useEffect } from 'react';
import Router from 'next/router';

const Main = ({sessionData}) => {

  const { data, status, error, refetch } = useQuery({
    queryKey:['values'],
    queryFn:getJobValues
  });

  useEffect(() => {
    if(sessionData.isLoggedIn==false){
      Router.push('/login')
    }
    data;
  }, [sessionData]);

  useEffect(() => {
    console.log(data)
  }, [data]);

  return (
  <div className='home-styles'>
  </div>
  )
}

export default Main