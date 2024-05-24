import React, { useEffect } from 'react';
import { Popover, Tag, Modal } from "antd";
import SelectComp from '/Components/Shared/Form/SelectComp';
import SelectSearchComp from '/Components/Shared/Form/SelectSearchComp';
import CheckGroupComp from '/Components/Shared/Form/CheckGroupComp';
import DateComp from '/Components/Shared/Form/DateComp';
import TimeComp from '/Components/Shared/Form/TimeComp';
import { Row, Col } from 'react-bootstrap';
import CustomBoxSelect from '/Components/Shared/Form/CustomBoxSelect';
import Notes from "./Notes";
import ports from "/jsonData/ports";
import destinations from "/jsonData/destinations";
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab, removeTab } from '/redux/tabs/tabSlice';
import { getStatus } from './states';
import Router from 'next/router';
import InputComp from '/Components/Shared/Form/InputComp';
import { addBlCreationId } from '/redux/BlCreation/blCreationSlice';
import Weights from './WeightComp';
import BLInfo from './BLInfo';
import airports from "/jsonData/airports";
import Carrier from './Carrier';
import EquipmentInfo from './EquipmentInfo';

const GDOperate = ({handleSubmit, onEdit, companyId, register, control, errors, state, useWatch, dispatch, reset, id, type}) => {

  const tabs = useSelector((state)=>state.tabs.tabs)
  //const companyId = useSelector((state) => state.company.value);
  const dispatchNew = useDispatch();
  const transportCheck = useWatch({control, name:"transportCheck"});
  const transporterId = useWatch({control, name:"transporterId"});
  const customCheck = useWatch({control, name:"customCheck"});
  const customAgentId = useWatch({control, name:"customAgentId"});
  const vesselId = useWatch({control, name:"vesselId"});
  const VoyageId = useWatch({control, name:"VoyageId"});
  const ClientId = useWatch({control, name:"ClientId"});
  const shipperId = useWatch({control, name:"shipperId"});
  const consigneeId = useWatch({control, name:"consigneeId"});
  const overseasAgentId = useWatch({control, name:"overseasAgentId"});
  const airLineId = useWatch({control, name:"airLineId"});
  const forwarderId = useWatch({control, name:"forwarderId"});
  const shippingLineId = useWatch({control, name:"shippingLineId"});
  const localVendorId = useWatch({control, name:"localVendorId"});
  const approved = useWatch({control, name:"approved"});
  let allValues = useWatch({control});
  const Space = () => <div className='mt-2'/>

  useEffect(() => {
    if(allValues.freightType=="Prepaid"){
      reset({...allValues, freightPaybleAt:'Karachi, Pakistan'});
    } else {
      reset({...allValues, freightPaybleAt:'Destination'});
    }
  }, [allValues.freightType])
  
  const handleOk = () => {
    allValues.approved = approved
    handleSubmit(onEdit(allValues))
    dispatch({type:"set",payload:{
      isModalOpen : false,
    }})
  };

  const handleCancel = () => {
    dispatch({type:"set",payload:{
      isModalOpen : false,
    }})
    reset({...allValues, approved:approved[0]!=1?['1']:[]})
  };

  const pageLinking = (pageType, value) => {
    let route= "";
    let obj = {}
    if(pageType=="client"){
      route=`/setup/client/${(value!="" && value!==null)?value:"new"}`
      obj={"label":"Client", "key":"2-7", "id":(value!="" && value!==null)?value:"new"}

    } else if(pageType=="vendor"){
      route=`/setup/vendor/${(value!="" && value!==null)?value:"new"}`
      obj={"label":"Vendor", "key":"2-8", "id":(value!="" && value!==null)?value:"new"}
      
    } else if(pageType="vessel"){
      route=`/setup/voyage/`
      obj={"label":"Voyages", "key":"2-4"}
    }
    //dispatchNew(incrementTab({ "label":label, "key":key, "id":(value!="" && value!==null)?value:"new" }));
    dispatchNew(incrementTab(obj));
    Router.push(route);
  }

  const ShipperComp = () => {
    return(
    <>
      <div className='custom-link mt-2' onClick={()=>pageLinking("client",shipperId)}>
        Shipper *
      </div>
      <SelectSearchComp register={register} name='shipperId' control={control} label='' 
        disabled={getStatus(approved)} width={"100%"}
        options={state.fields.party.shipper} 
      />
      <Space/>
    </>
    )
  }
  
  return (
  <>
    <Row style={{fontSize:12}}>
      <Col md={2} className='py-1'>     
        <DateComp register={register} name='gd' control={control} label='GD #' width={"100%"} disabled={getStatus(approved)} />
        {errors.registerDate && <div className='error-line'>Required*</div>}
      </Col>
      <Col md={2} className='py-1'>
        <InputComp register={register} name='customerRef' control={control} label='Invoice #' width={"100%"} disabled={getStatus(approved)} />
      </Col>
      <Col md={2} className='py-1'>
        <InputComp register={register} name='fileNo' control={control} label='FORM E #' width={"100%"} disabled={getStatus(approved)} />
      </Col>
      <Col md={2} className='py-1'>     
          <DateComp register={register} name='shipDate' control={control} label='GD Date' disabled={getStatus(approved)} width={"100%"} />
          {errors.registerDate && <div className='error-line'>Required*</div>}
      </Col>
    </Row>
    <hr className='' />
    <Row style={{fontSize:12}}>
      <Col md={3} className=''>
        <div className='custom-link mt-2' onClick={()=>pageLinking("client", ClientId)} >Client *</div>
        <SelectSearchComp register={register} name='ClientId' control={control} label='' disabled={getStatus(approved)} width={"100%"}
          options={state.fields.party.client} />
        {/* {(type=="SE" || type=="AE") && <ShipperComp/>} */}
        <Space/>
        <div className='custom-link mt-2' onClick={()=>pageLinking("client", consigneeId)} >Consignee *</div>
        <SelectSearchComp register={register} name='consigneeId' control={control} label='' disabled={getStatus(approved)} width={"100%"}
          options={state.fields.party.consignee} /><Space/>
      </Col>
      <Col md={3}>
        <Space/>
        <div className='custom-link mt-2' onClick={()=>pageLinking("vendor", localVendorId)} >Local Vendor *</div>
        <SelectSearchComp register={register} name='localVendorId' control={control} label='' 
          disabled={getStatus(approved)}options={state.fields.vendor.localVendor} width={"100%"} 
        />
        <div className='my-2'></div>
        <SelectSearchComp register={register} name='commodityId' control={control} label='Commodity *' disabled={getStatus(approved)} width={"100%"}
          options={state.fields.commodity} 
        />
        <div className='my-2'></div>
        <SelectSearchComp register={register} name='customAgentId' control={control} label='Freight Forwarder' width={"100%"}
          options={state.fields.vendor.chaChb} 
        />
        {(type=="CSE"||type=="CSI") &&<>
          <div className='custom-link mt-2' onClick={()=>pageLinking("vendor", shippingLineId)} >Sline/Carrier</div>
          <SelectSearchComp register={register} name='shippingLineId' control={control} label='' disabled={getStatus(approved)} options={state.fields.vendor.sLine} width={"100%"} />
        </>
        }        
        {/* <Carrier state={state} register={register} control={control} pageLinking={pageLinking} dispatch={dispatch}
          getStatus={getStatus} approved={approved} VoyageId={VoyageId} vesselId={vesselId} type={type} 
        /> */}
      </Col>
      
      <Col md={3}><Space />
          <div className='mt-2' />
          <Row>
            <Col md={1}>
              <CheckGroupComp register={register} name='transportCheck' control={control} label='' disabled={getStatus(approved)}
                options={[{ label: "", value: "Transport" }]} />
            </Col>
            <Col md={3}>
              <div className='custom-link' onClick={() => pageLinking("vendor", transporterId)} >Transport</div>
            </Col>
            <Col>.</Col>
          </Row>
          <SelectSearchComp register={register} name='transporterId' control={control} label=''
            options={state.fields.vendor.transporter} disabled={getStatus(approved) || transportCheck.length == 0} width={"100%"} 
          />
          <div style={{ marginTop: 13 }}></div>
          <Weights register={register} control={control} equipments={state.equipments}
            type={type} approved={approved} useWatch={useWatch}
          />
        </Col>
      <Col md={3}>
      {state.edit &&<Notes state={state} dispatch={dispatch} />}
        {approved=="1" && <img src={'/approve.png'} height={100} />}
        <div onClick={()=> dispatch({type:"set",payload:{isModalOpen : true,}}) }>
          <CheckGroupComp register={register} name='approved' control={control} label='' 
            options={[{ label:"Approve Job", value:"1" }]} 
          />
        </div>
        <hr className='' />
        <div>
        <Popover
          content={
          <>{state.InvoiceList?.map((x, i) => 
            (<div key={i} className='my-1'>
              <Tag color="geekblue" style={{fontSize:15, cursor:"pointer", width:130, textAlign:'center'}}
                onClick={()=>{
                dispatch({ type:'set',
                  payload:{ selectedInvoice:x.invoice_No, tabState:"5" }
                })
              }}>
                {x.invoice_No}
              </Tag>
            </div>))}
          </>}>
          <button type="button" className="btn-custom">Invoice/Bills {`(${state.InvoiceList.length})`}</button>
        </Popover>
      </div>
      </Col>
    </Row>
    <hr className='' />
    <EquipmentInfo state={state} dispatch={dispatch} />
    {(state.voyageVisible && approved[0]!="1") && 
      <CustomBoxSelect reset={reset} useWatch={useWatch} control={control} state={state} dispatch={dispatch}/>
    }
    <Modal open={state.isModalOpen} onOk={handleOk} onCancel={handleCancel} maskClosable={false}>
      {approved=="1" ? "Are You Sure You Want To Approve This Job? " : "Are You Sure You Want To Disapprove This Job?"}
    </Modal>
  </>
)}
export default React.memo(GDOperate)