import React, { useEffect } from 'react';
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InputNumber } from "antd";
import InputComp from '/Components/Shared/Form/InputComp';
import InputNumComp from '/Components/Shared/Form/InputNumComp';
import SelectComp from '/Components/Shared/Form/SelectComp';
import RadioComp from '/Components/Shared/Form/RadioComp';
import { Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import openNotification from '/Components/Shared/Notification';
import { getJobValues } from '/apis/jobs';
import { useQuery } from '@tanstack/react-query';
import uuidv4 from "/functions/uuidv4";
import { CloseCircleOutlined } from '@ant-design/icons';

const SignupSchema = yup.object().shape({
  // code: yup.string().required('Required'),
  currency: yup.string().required('Required'),
  name: yup.string().required('Required'),
  short: yup.string().required('Required'),
  calculationType: yup.string().required('Required'),
  defaultPaybleParty: yup.string().required('Required'),
  defaultRecivableParty: yup.string().required('Required')
});

const CreateOrEdit = ({state, dispatch, baseValues}) => {

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(SignupSchema),
    defaultValues:state.values
  });

  const taxApply = useWatch({control, name:"taxApply"});
  const calculationType = useWatch({control, name:"calculationType"});

  const { refetch } = useQuery({
    queryKey:['values'],
    queryFn:getJobValues
  });

  useEffect(() => {
    if(state.edit){
      let tempState = {...state.selectedRecord};
      reset(tempState);
      if(state.selectedRecord?.pricing){
        let tempPricing = [...state.selectedRecord?.pricing];
        tempPricing.forEach((x)=>{
          x.id = uuidv4()
        })
        //generateUuid
        dispatch({type:'toggle', fieldName:'pricing', payload:tempPricing});
      }
    }
    if(!state.edit){
      reset(baseValues);
    }
  }, [state.selectedRecord])

  const onSubmit = async(fields) => {
    dispatch({type:'toggle', fieldName:'load', payload:true});
    let data = {
      ...fields,
      pricing:state?.pricing||null
    }
    setTimeout(async() => {
      await axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_CHARGE,{
        data
      }).then((x)=>{
        if(x.data.status=='success'){
          let tempRecords = [...state.records];
          tempRecords.unshift(x.data.result);
          dispatch({type:'toggle', fieldName:'records', payload:tempRecords});
          dispatch({type:'modalOff'});
          reset(baseValues);
          openNotification('Success', `Charge ${x.data.result.name} Created!`, 'green');
          refetch();
        }else if(x.data.status="exists"){
          openNotification('Error', `Charge with same code already exists Created!`, 'red')
        }else{
          openNotification('Error', `Some Error Occured, Try Again!`, 'red')
        }
        dispatch({type:'toggle', fieldName:'load', payload:false});
      })
    }, 2000);
  };

  const onEdit = async(fields) => {
    dispatch({type:'toggle', fieldName:'load', payload:true});
    // console.log(data)
    let data = {
      ...fields,
      pricing:state?.pricing||null
    }
    setTimeout(async() => {
      await axios.post(process.env.NEXT_PUBLIC_CLIMAX_EDIT_CHARGE,{
        data
      }).then((x)=>{
        if(x.data.status=='success'){
                let tempRecords = [...state.records];
                let i = tempRecords.findIndex((y=>data.id==y.id));
                tempRecords[i] = x.data.result;
                dispatch({type:'toggle', fieldName:'records', payload:tempRecords});
                dispatch({type:'modalOff'});
                reset(baseValues)
                openNotification('Success', `Charge ${x.data.result.name} Updated!`, 'green');
                refetch();
        }else if(x.data.status="exists"){
                openNotification('Error', `Charge with same code already exists Created!`, 'red')
        }else{
                openNotification('Error', `Some Error Occured, Try Again!`, 'red')
        }
        dispatch({type:'toggle', fieldName:'load', payload:false});
      })
    }, 2000);
  };

  const onError = (errors) => console.log(errors);

  return (
  <div className='client-styles' style={{maxHeight:620, overflowY:'auto', overflowX:'hidden'}}>
    <h6>{state.edit?'Edit':'Create'}</h6>
    <form onSubmit={handleSubmit(state.edit?onEdit:onSubmit, onError)}>
      <Row>
        <Col md={3} className='py-1'>
          <InputComp register={register} disabled name='code' control={control} label='Code' />
          {errors.code && <div className='error-line'>{errors.code.message}</div>}
        </Col>
        <Col md={3} className='py-1'>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <InputComp register={register} name='name' control={control} label='Name' />
          {errors.name && <div className='error-line'>{errors.name.message}*</div>}
        </Col>
        <Col md={4}>
          <InputComp register={register} name='short' control={control} label='Short Name' />
          {errors.short && <div className='error-line'>{errors.short.message}*</div>}
        </Col>
        <Col md={12} className="my-2">
          <RadioComp register={register} name='calculationType' control={control} label='Calculation Type'
            options={[
              { label: "Per Container", value: "Per Container" },
              { label: "Per Gd", value: "Per Gd" },
              { label: "Per Package", value: "Per Package" },
            ]}
          />
          {errors.calculationType && <div className='error-line'>{errors.calculationType.message}*</div>}
        </Col>
        <Col md={4} className='my-2'>
          {calculationType=="Per Package"?
          <>
          <hr/>
          <button className='btn-custom-blue' type='button'
            onClick={()=> {
              let temp = [...state.pricing];
              temp.push({ minimum:0, amount:0.00, id:uuidv4()});
              dispatch({type:'toggle', fieldName:'pricing', payload:temp})
            }}
          >
            Add
          </button>
          <div className='mt-2'></div>
            {state.pricing.map((price, index)=>{
              return(
              <Row key={price.id} className='mt-2'>
                <Col md={'auto'} className='mx-0'>
                  Charge<br/>
                  <InputNumber value={price.amount} style={{width:100}}
                    onChange={(e)=> {
                      let temp = [...state.pricing];
                      temp[index].amount = e;
                      dispatch({type:'toggle', fieldName:'pricing', payload:temp})
                    }}
                  />
                </Col>
                <Col md={2} className='mx-0 px-0 '>
                  Range<br/>
                  <div className='mt-2 text-end mx-2 grey-txt'>
                    {index==0?0:state.pricing[index-1].minimum+1} --
                  </div>
                </Col>
                <Col md={'auto'} className='mx-0 px-0'>
                  <br/>
                  {(state.pricing.length != index + 1) &&
                    <InputNumber value={price.minimum} style={{width:100}} min={index==0?1:state.pricing[index-1].minimum+2}
                    onChange={(e)=> {
                      let temp = [...state.pricing];
                      temp[index].minimum = e;
                      dispatch({type:'toggle', fieldName:'pricing', payload:temp})
                    }}
                  />
                  }
                  {(state.pricing.length == index + 1) && <div className='mt-2 grey-txt'>So on</div>}
                </Col>
                <Col md={1} className='mx-0 px-1'>
                  <br/>
                  <CloseCircleOutlined className='mx-3 cross-icon mt-2' 
                    onClick={()=>{
                      let tempState = [...state.pricing];
                      tempState.splice(index, 1);
                      dispatch({type:'toggle', fieldName:'pricing', payload:tempState})
                    }}
                  />
                </Col>
                <hr className='mt-2' />
              </Row>
            )})}
          
          </>
          :
          <>
            <InputNumComp register={register} name='fixAmount' control={control} label='Fixed Charge Amount' />
          </>
          }
        </Col>
        <Col md={12} className="my-2">
          <RadioComp register={register} name='taxApply' control={control} label='Tax'
            options={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
          />
          {errors.taxApply && <div className='error-line'>{errors.taxApply.message}*</div>}
        </Col>
        <Col md={2} className="my-2">
          <InputNumComp register={register} name='taxPerc' control={control} label='Tax Percentage' disabled={taxApply=="No"?true:false} />
          {errors.taxPerc && <div className='error-line'>{errors.taxPerc.message}*</div>}
        </Col>
        <Col md={8}></Col>
        <Col md={3} className="my-2">
          <SelectComp register={register} name='defaultPaybleParty' control={control} label='Default Payble Party Type' width={180}
            options={[
              {id:'Client', name:'Client'},
              {id:'Local-Agent', name:'Local-Agent'},
              {id:'Overseas-Agent', name:'Overseas-Agent'},
              {id:'Transport-Agent', name:'Transport-Agent'},
              {id:'Forwarding-Agent', name:'Forwarding-Agent'},
              {id:'Custom-Agent', name:'Custom-Agent'},
              {id:'Shipping-Line', name:'Shipping-Line'},
            ]}
          />
          {errors.defaultPaybleParty && <div className='error-line'>{errors.defaultPaybleParty.message}*</div>}
        </Col>
        <Col md={4} className="my-2">
          <SelectComp register={register} name='defaultRecivableParty' control={control} label='Default Receivable Party Type' width={180}
            options={[
              {id:'Terminal', name:'Terminal'},
              {id:'Local-Agent', name:'Local-Agent'},
              {id:'Overseas-Agent', name:'Overseas-Agent'},
              {id:'Transport-Agent', name:'Transport-Agent'},
              {id:'Forwarding-Agent', name:'Forwarding-Agent'},
              {id:'Custom-Agent', name:'Custom-Agent'},
              {id:'Shipping-Line', name:'Shipping-Line'},
            ]} 
          />
          {errors.defaultPaybleParty && <div className='error-line'>{errors.defaultPaybleParty.message}*</div>}
        </Col>
      </Row>
      <div style={{height:16}}></div>
    <hr/>
    <button type="submit" disabled={state.load?true:false} className='btn-custom'>
      {state.load?<Spinner animation="border" size='sm' className='mx-3' />:'Submit'}
    </button>
    </form>
  </div>
  )
}

export default React.memo(CreateOrEdit)