import React, {useState, useEffect } from 'react';
import { Popover, Tag, Modal } from "antd";
import SelectComp from '/Components/Shared/Form/SelectComp';
import SelectSearchComp from '/Components/Shared/Form/SelectSearchComp';
import CheckGroupComp from '/Components/Shared/Form/CheckGroupComp';
import DateComp from '/Components/Shared/Form/DateComp';
import InputNumComp from "/Components/Shared/Form/InputNumComp";
import { Row, Col } from 'react-bootstrap';
import Notes from "./Notes";
import ports from "/jsonData/ports";
import destinations from "/jsonData/destinations";
import { useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import { getStatus } from './states';
import Router from 'next/router';
import InputComp from '/Components/Shared/Form/InputComp';
import airports from "/jsonData/airports";
import polAir from "/jsonData/polAir.json";
import polSea from "/jsonData/polSea.json";
import EquipmentInfo from './EquipmentInfo';

const BookingInfo = ({handleSubmit, onEdit, register, control, errors, state, useWatch, dispatch, reset, id, type}) => {

  // console.log("state from se job booking info",state)

  const dispatchNew = useDispatch();

  let allValues = useWatch({control});

  const transportCheck = useWatch({control, name:"transportCheck"});
  const transporterId = useWatch({control, name:"transporterId"});
  const ClientId = useWatch({control, name:"ClientId"});
  const shippingLineId = useWatch({control, name:"shippingLineId"});
  const airlineId = useWatch({control, name:"airlineId"});
  const customAgentId = useWatch({control, name:"customAgentId"});
  const commodityId = useWatch({control, name:"commodityId"});
  const localVendorId = useWatch({control, name:"localVendorId"});
  const approved = useWatch({control, name:"approved"});
  const Space = () => <div className='mt-2'/>

  useEffect(() => {
    if (approved === '1') {
      setDisabled(true);
    } else if (approved === '0') {
      setDisabled(false);
    }
  }, [approved]);

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
      route=`/commodity/`
      obj={"label":"commodity", "key":"2-3"}
    };
    dispatchNew(incrementTab(obj));
    Router.push(route);
  };

  const packages = [
    {id:'BAGS', value:'BAGS'},
    {id:'BALES', value:'BALES'},
    {id:'BARRELS', value:'BARRELS'},
    {id:'CARTONS', value:'CARTONS'},
    {id:'BLOCKS', value:'BLOCKS'},
    {id:'BOATS', value:'BOATS'},
    {id:'BOBBIN', value:'BOBBIN'},
    {id:'BOTTLES', value:'BOTTLES'},
    {id:'BOXES', value:'BOXES'},
    {id:'BRIQUETTES', value:'BRIQUETTES'},
    {id:'BUNDLES', value:'BUNDLES'},
    {id:'CABLE DRUM', value:'CABLE DRUM'},
    {id:'CANS', value:'CANS'},
    {id:'CARBOY', value:'CARBOY'},
    {id:'CARTONS', value:'CARTONS'},
    {id:'CASE', value:'CASE'},
    {id:'CASKS', value:'CASKS'},
    {id:'COILS', value:'COILS'},
    {id:'COLLI', value:'COLLI'},
    {id:'CRATES', value:'CRATES'},
    {id:'CYLINDERS', value:'CYLINDERS'},
    {id:'DOZENS', value:'DOZENS'},
    {id:'DRUMS', value:'DRUMS'},
    {id:'FUBRE DRUMS', value:'FUBRE DRUMS'},
    {id:'ITEMS', value:'ITEMS'},
    {id:'JOTTAS', value:'JOTTAS'},
    {id:'KEGS', value:'KEGS'},
    {id:'LOOSE', value:'LOOSE'},
    {id:'METAL DRUMS', value:'METAL DRUMS'},
    {id:'METERS', value:'METERS'},
    {id:'MODULES', value:'MODULES'},
    {id:'PACKETS', value:'PACKETS'},
    {id:'PACKAGES', value:'PACKAGES'},
    {id:'PAILS', value:'PAILS'},
    {id:'PALLETS', value:'PALLETS'},
    {id:'PARCELS', value:'PARCELS'},
    {id:'PIECES', value:'PIECES'},
    {id:'PLASTIC DRUMS', value:'PLASTIC DRUMS'},
    {id:'REELS', value:'REELS'},
    {id:'ROLLS', value:'ROLLS'},
    {id:'SACKS', value:'SACKS'},
    {id:'SETS', value:'SETS'},
    {id:'SHEETS', value:'SHEETS'},
    {id:'SKIDS', value:'SKIDS'},
    {id:'SLABS', value:'SLABS'},
    {id:'STEEL PACKAGES', value:'STEEL PACKAGES'},
    {id:'STEEL PLATES', value:'STEEL PLATES'},
    {id:'STEEL TRUNKS', value:'STEEL TRUNKS'},
    {id:'TES CHESTS', value:'TES CHESTS'},
    {id:'TONS', value:'TONS'},
    {id:'UNIT', value:'UNIT'}
  ];

  // console.log(getStatus());


  return (
  <>
    <Row style={{fontSize:12}}>
      <Col md={2} className=''>
        <div className="mt-1">Job No.</div>
        <div className="dummy-input" style={{fontSize:14}}>
          {state.edit?(state.selectedRecord?.jobNo):<span style={{color:'white'}}>.</span>}
        </div>
      </Col>
      <Col md={2} className='py-1'>     
        <DateComp register={register} name='jobDate' control={control} label='Job Date' width={"100%"} disabled />
      </Col>
      <Col md={2} className='py-1'>     
        <DateComp register={register} name='shipDate' control={control} label='Sailing/Flight Date'  width={"100%"} />
      </Col>
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='jobType' control={control} label='Job Type' width={"100%"} 
          options={[  
            {id:'Clearing Only', name:'Clearing Only'},
            {id:'Clearing + Tpt', name:'Clearing + Tpt'},
            {id:'Tpt Only', name:'Tpt Only'},
          ]}
        />
      </Col>
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='subType' control={control} label='Shipment Type' width={"100%"} 
          options={[
            {id:'FCL', name:'FCL'},
            {id:'LCL', name:'LCL'},
            {id:'PART', name:'PART'},
            {id:'EPZ', name:'EPZ'},
          ]}
        />
      </Col>
      <Col md={2} className='py-1'>
        <InputComp register={register} name='customerRef' control={control} label='Invoice #' width={"100%"}  />
      </Col>
    </Row>
    <hr />
    <Row style={{fontSize:12}}>
      <Col md={6}>
        <Row>
          <Col md={6} className=''>
            <div className='custom-link mt-2' onClick={()=>pageLinking("client", ClientId)} >Client *</div>
            <SelectSearchComp register={register} name='ClientId' control={control} label=''  width={"100%"}
              options={state.fields.party.client} />
            <Space/>

            {(type=="CSE" || type=="CSI") && <>
            <SelectSearchComp register={register} name='pol' control={control} label='Port Of Shipment'  width={"100%"}
              options={polSea.ports} /><Space/>
            <SelectSearchComp register={register} name='pod' control={control} label='Port Of Discharge'  width={"100%"}
              options={ports.ports} /><Space/>
            </>
            }
            {(type=="CAE" || type=="CAI") &&<>
            <SelectSearchComp register={register} name='pol' control={control} label='Airport Of Shipment'  width={"100%"}
              options={polAir.ports} /><Space/>
            <SelectSearchComp register={register} name='pod' control={control} label='Airport Of Discharge'  width={"100%"}
              options={airports} /><Space/>
            </>}
            <SelectSearchComp register={register} name='fd' control={control} label='Final Destination'  width={"100%"}
              options={destinations} 
            />
            <Space/>
          </Col>
          <Col md={6}>
            <Space/>
            <div className='custom-link mt-2' onClick={()=>pageLinking("vendor", localVendorId)} >Local Vendor</div>
            <SelectSearchComp register={register} name='localVendorId' control={control} label='' 
              options={state.fields.vendor.localVendor} width={"100%"} 
            />
            <div className='custom-link mt-2' onClick={()=>pageLinking("commodity", commodityId)} >Commodity</div>
            <SelectSearchComp register={register} name='commodityId' control={control} label='' width={"100%"}
              options={state.fields.commodity} 
            />
            {/* <div className='my-2'></div> */}
            {(type=="CSE"||type=="CSI") &&<>
            <div className='custom-link mt-2' onClick={()=>pageLinking("vendor", customAgentId)} >Freight Forwarder {"(CHA/CHB)"}</div>
            <SelectSearchComp register={register} name='customAgentId' control={control} label=''  width={"100%"}
              options={state.fields.vendor.chaChb} 
            />
                 </>
            }
              {(type=="CAE" || type=="CAI") &&<> 
            <InputComp register={register} name='airwayBill' control={control} label='Airway Bill#' width={"100%"}  />
            </> }
            {(type=="CAE" || type=="CAI") &&<>
            <div className='custom-link mt-2' onClick={()=>pageLinking("vendor", airlineId)} >Airline</div>
            <SelectSearchComp register={register} name='airlineId' control={control} label='' width={"100%"}
              options={state.fields.vendor.airLine} 
            />
                 </>
            }
            {(type=="CSE"||type=="CSI") &&<>
              <div className='custom-link mt-2' onClick={()=>pageLinking("vendor", shippingLineId)} >Sline/Carrier</div>
              <SelectSearchComp register={register} name='shippingLineId' control={control} label=''  options={state.fields.vendor.sLine} width={"100%"} />
            </>
            }
          </Col>
        </Row>
      </Col>
      <Col md={6}>
        <Row>
          <Col md={7}><Space />
            <div className='mt-2' />
            <Row>
              <Col md={1}>
                <CheckGroupComp register={register} name='transportCheck' control={control} label='' 
                  options={[{ label: "", value: "Transport" }]}
                />
              </Col>
              <Col md={3}>
                <div className='custom-link' onClick={() => pageLinking("vendor", transporterId)}>Transporter</div>
              </Col>
              <Col>.</Col>
            </Row>
            <SelectSearchComp register={register} name='transporterId' control={control} label=''
              options={state.fields.vendor.transporter} disabled={getStatus() || transportCheck.length == 0} width={"100%"} 
            />
            <Row>
              <Col md={4} className='mt-2'>
                <InputNumComp register={register} name='pcs' control={control}  label='No of Pkgs' width={"120%"}  />
              </Col>
              <Col md={8} className='mt-2'>
                <SelectComp register={register} name='pkgUnit' control={control} label='.' width={"100%"}  options={packages}  />
              </Col>
            </Row>
          </Col>
          <Col md={5}>
          {state.edit &&<Notes state={state} dispatch={dispatch} type={type} />}
            {approved=="1" && <img src={'/approve.png'} height={100} />}
          <div onClick={()=> dispatch({type:"set",payload:{isModalOpen : true}}) }>
                       <CheckGroupComp register={register} name='approved' control={control} label='' 
                options={[{ label:"Vessel Sailed", value:"1" }]}     
                
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
      </Col>
      {(type=="CSE"||type=="CSI") &&<>
      <Col md={7}>
        <EquipmentInfo state={state} dispatch={dispatch} />
      </Col>
      </> }
    </Row>
    <Modal open={state.isModalOpen} onOk={handleOk} onCancel={handleCancel} maskClosable={false}>
      {approved=="1" ? "Mark Vessel Sailed? " : "Unmark Vessel Sailed? "}
    </Modal>
  </>
)}
export default React.memo(BookingInfo)