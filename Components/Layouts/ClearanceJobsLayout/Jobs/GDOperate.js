import React, { useEffect } from 'react';
import { Popover, Tag, Modal } from "antd";
import SelectComp from '/Components/Shared/Form/SelectComp';
import SelectSearchComp from '/Components/Shared/Form/SelectSearchComp';
import CheckGroupComp from '/Components/Shared/Form/CheckGroupComp';
import DateComp from '/Components/Shared/Form/DateComp';
import { Row, Col } from 'react-bootstrap';
import CustomBoxSelect from '/Components/Shared/Form/CustomBoxSelect';
import Notes from "./Notes";
import ports from "/jsonData/ports";
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab, removeTab } from '/redux/tabs/tabSlice';
import { getStatus } from './states';
import Router from 'next/router';
import InputComp from '/Components/Shared/Form/InputComp';
import Weights from './WeightComp';
import airports from "/jsonData/airports";
import Carrier from './Carrier';
import polAir from "/jsonData/polAir.json";
import polSea from "/jsonData/polSea.json";

const GDOperate = ({handleSubmit, onEdit, companyId, register, control, errors, state, useWatch, dispatch, reset, id, type}) => {

  const tabs = useSelector((state)=>state.tabs.tabs)
  const dispatchNew = useDispatch();
  const vesselId = useWatch({control, name:"vesselId"});
  const VoyageId = useWatch({control, name:"VoyageId"});
  const ClientId = useWatch({control, name:"ClientId"});
  const customAgentId = useWatch({control, name:"customAgentId"});
  const commodityId = useWatch({control, name:"commodityId"});
  const consigneeId = useWatch({control, name:"consigneeId"});
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
      
    } else if(pageType=="commodity"){
      route=`/commodity`
      obj={"label":"Commodity", "key":"2-3"}
    };
    dispatchNew(incrementTab(obj));
    Router.push(route);
  };

  return (
  <>
    <Row style={{fontSize:12}}>
      <Col md={2} className='py-1'>     
        <InputComp register={register} name='gd' control={control} label='GD #' width={"100%"} disabled={getStatus(approved)} />
      </Col>
      <Col md={2} className='py-1'>
        <InputComp register={register} name='customerRef' control={control} label='Invoice #' width={"100%"} disabled={getStatus(approved)} />
      </Col>
      <Col md={2} className='py-1'>
        <InputComp register={register} name='fileNo' control={control} label='FORM E #' width={"100%"} disabled={getStatus(approved)} />
      </Col>
      <Col md={2} className='py-1'>     
        <DateComp register={register} name='gdDate' control={control} label='GD Date' disabled={getStatus(approved)} width={"100%"} />
      </Col>
    </Row>
    <hr />
    <Row style={{fontSize:12}}>
      <Col md={3}>
        <div className='custom-link mt-2' onClick={()=>pageLinking("client", ClientId)} >Client *</div>
        <SelectSearchComp register={register} name='ClientId' control={control} label='' disabled={getStatus(approved)} width={"100%"}
          options={state.fields.party.client} />
        <Space/>
        <div className='custom-link mt-2' onClick={()=>pageLinking("client", consigneeId)} >Consignee *</div>
        <SelectSearchComp register={register} name='consigneeId' control={control} label='' disabled={getStatus(approved)} width={"100%"}
          options={state.fields.party.consignee} /><Space/>
        <div style={{ marginTop: 13 }}></div>
          <Weights register={register} control={control} equipments={state.equipments}
            type={type} approved={approved} useWatch={useWatch}
          />
      </Col>
      <Col md={3}>
        <Space/>
        <div className='custom-link mt-2' onClick={()=>pageLinking("vendor", localVendorId)} >Local Vendor</div>
        <SelectSearchComp register={register} name='localVendorId' control={control} label='' 
          disabled={getStatus(approved)}options={state.fields.vendor.localVendor} width={"100%"} 
        />
        <div className='custom-link mt-2' onClick={()=>pageLinking("commodity", commodityId)} >Commodity</div>
        <SelectSearchComp register={register} name='commodityId' control={control} label='' disabled={getStatus(approved)} width={"100%"}
          options={state.fields.commodity} 
        />
        {/* <div className='my-2'></div> */}
        <InputComp register={register} name='airwayBill' control={control} label='Airway Bill#' width={"100%"} disabled={getStatus(approved)} />
        {/* <SelectSearchComp register={register} name='customAgentId' control={control} label='' width={"100%"}
          options={state.fields.vendor.chaChb} 
        />      */}
        <Carrier state={state} register={register} control={control} pageLinking={pageLinking} dispatch={dispatch}
          getStatus={getStatus} approved={approved} VoyageId={VoyageId} vesselId={vesselId} type={type} 
        />
      </Col>
      <Col md={3}>
        <Row>
          <Col md={12}>
            <SelectSearchComp register={register} name='pol' control={control} 
              label={(type=="CSE"||type=="CSI")?'Port Of Shipment':'Airport of Shipment'} 
              width={"100%"}
              options={(type=="CSE"||type=="CSI")?polSea.ports:polAir.ports}
            />
            <Space/>
          </Col>
          <Col md={12}>
            <SelectSearchComp register={register} name='pod' control={control} 
              label={(type=="CSE"||type=="CSI")?'Port Of Discharge':'Airport of Discharge'} width={"100%"}
              options={(type=="CSE"||type=="CSI")?ports.ports:airports}
            />
            <Space/>
          </Col>
          <Col md={12}>
            <SelectSearchComp 
              register={register} name='fd' control={control} label='Final Destination' width={"100%"}
              options={ports.ports}
            />
            <Space/>
          </Col>
          <Col md={12}>
            <SelectSearchComp register={register} name='terminal' control={control} label='Terminal/Shed' width={"100%"}
              options={[
                {id:`Gerry's Dnata`, name:`Gerry's Dnata`},
                {id:'Royal Airport Service', name:'Royal Airport Service'},
                {id:'Shaheen Air', name:'Shaheen Air'},
                {id:'Pakistan International Air', name:'Pakistan International Air'},
                             ]}
            />
            <Space/>
          </Col>
          <div style={{minHeight:158}}></div>
        </Row>
      </Col>
      <Col md={3}>
        {state.edit &&<Notes state={state} dispatch={dispatch} />}
        {approved=="1" && <img src={'/approve.png'} height={100} />}
        <div onClick={()=> dispatch({type:"set",payload:{isModalOpen : true,}}) }>
          <CheckGroupComp register={register} name='approved' control={control} label='' 
            options={[{ label:"Vessel Sailed", value:"1" }]} 
            disabled={true}
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
    {(state.voyageVisible && approved[0]!="1") && 
      <CustomBoxSelect reset={reset} useWatch={useWatch} control={control} state={state} dispatch={dispatch}/>
    }
    <Modal open={state.isModalOpen} onOk={handleOk} onCancel={handleCancel} maskClosable={false}>
      {approved=="1" ? "Mark Vessel Sailed? " : "Unmark Vessel Sailed? "}
    </Modal>
  </>
)}
export default React.memo(GDOperate)