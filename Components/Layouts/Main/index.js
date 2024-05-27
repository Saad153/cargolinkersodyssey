"use client"

import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getJobValues } from '/apis/jobs';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Router from 'next/router';
const DynamicComponent = dynamic(() => import("./ChartComp"), {
  loading: () => <p>Loading..</p>,
});

const Main = ({sessionData, chartData}) => {

  const companyId = useSelector((state) => state.company.value);
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