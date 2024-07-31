import { addValues } from '/redux/persistValues/persistValuesSlice';
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import React, { useEffect, useState, useReducer  } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { useQueryClient } from '@tanstack/react-query';
import Router from 'next/router';
import { Input } from 'antd';
import { Popover, Tag, Modal } from "antd";
import { recordsReducer,initialState } from './Jobs/states';
import { checkAccess } from '/functions/checkAccess';

const JobsList = ({ jobsData, sessionData, type }) => {
  
 const [ state, dispatch ] = useReducer(recordsReducer, initialState);

  const queryClient = useQueryClient();
  const dispatchNew = useDispatch();

  const changedValues = useSelector((state)=>state.persistValues);
  const companyId = useSelector((state) => state.company.value);

  const [records, setRecords] = useState([]);
  const [query, setQuery] = useState("");

 

  useEffect(() => {
    if(jobsData.status=="success"){
      let temp = [...jobsData.result];
      temp = temp.map((x)=>{
        return {
          ...x,
          containers:x.SE_Equipments.map((y)=>{ return `${y.container}` }).join(",")
        }
      });
      setRecords(temp);
    }

    
  }, []);
  if(checkAccess(dispatch, "Sea Export Jobs List") && type=="CSE"){
    return(
      <>
        {companyId!='' &&
        <div className='base-page-layout'>
          <Row>
            <Col md={7}>
              <h5>
                {type=="CSE"?"SEA Export ":type=="CSI"?"SEA Import ":type=="CAE"?"AIR Export ":type=="CAI"?"AIR Import ":""}
                Job List
              </h5>
            </Col>
            <Col md={3}>
              <Input type="text" placeholder="Search by Client, Job, Invoice" size='sm' onChange={e => setQuery(e.target.value)} />
            </Col>
            <Col md={1}>
            <button className='btn-custom right px-4'
              onClick={()=>{
                Router.push(`/seaJobs/jobList`)
              }}
            >List</button>
            </Col>
            <Col md={1}>
              <button className='btn-custom right px-4'
                onClick={()=>{
                  queryClient.removeQueries({ queryKey: ['jobData',{ type }] })
                  let obj = {...changedValues.value}
                  obj[type] = ""
                  dispatchNew(addValues(obj));
                  dispatchNew(incrementTab({
                    "label":type=="CSE"?"SE JOB":
                            type=="CSI"?"SI JOB":
                            type=="CAE"?"AE JOB":
                            "AI JOB",
                    "key":type=="CSE"?"8-4":type=="CSI"?"9-4":type=="CAE"?"8-2":"9-2",
                    "id":"new"
                  }));
                  Router.push(
                    type=="CSE"?`/clearanceJobs/export/sea/new`:
                    type=="CSI"?`/clearanceJobs/import/sea/new`:
                    type=="CAE"?`/clearanceJobs/export/air/new`:
                    `/clearanceJobs/import/air/new`
                  )
                }}
              >Create</button>
            </Col>
          </Row>
          <hr className='my-2' />
          <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
          <Table className='tableFixHead'>
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Basic Info</th>
                <th>Container Info</th>
                <th>Shipment Info</th>
                <th>Weight Info</th>
                <th>Other Info</th>
                <th>Status</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
            {records.filter((x)=>{
             return x?.Client?.name?.toLowerCase().includes(query.toLowerCase()) ||
                    x?.jobNo?.toLowerCase().includes(query.toLowerCase()) ||
                    x?.gd?.toLowerCase().includes(query.toLowerCase()) ||
                    x?.containers?.toLowerCase().includes(query.toLowerCase()) ||
                    x?.pcs?.includes(query) ||
                    x?.customerRef?.includes(query) ||
                    x?.created_by?.name?.includes(query)
            })?.map((x, index) => {
            return (
              <tr key={index} className='f row-hov' onClick={() => {
                queryClient.removeQueries({ queryKey: ['jobData',{ type }] })
                let obj = {...changedValues.value}
                obj[type] = ""
                dispatchNew(addValues(obj));
                dispatchNew(incrementTab({
                  "label":type=="CSE"?"SE JOB":type=="CSI"?"SI JOB":type=="CAE"?"AE JOB":"AI JOB",
                  "key":type=="CSE"?"8-4":type=="CSI"?"9-4":type=="CAE"?"8-2":"9-2",
                  "id":x.id
                }))
                Router.push(
                  type=="CSE"?`/clearanceJobs/export/sea/${x.id}`:
                  type=="CSI"?`/clearanceJobs/import/sea/${x.id}`:
                  type=="CAE"?`/clearanceJobs/export/air/${x.id}`:
                  `/clearanceJobs/import/air/${x.id}`
                )
              }}>
                <td>{index + 1}</td>
                <td>
                  Job #<span className='blue-txt fw-7'> {x.jobNo}</span><br/>
                  GD #<span className='blue-txt fw-7'> {x.gd}</span><br/>
                  Party:<span className='blue-txt fw-5'> {x.Client===null?"":x.Client.name}</span>
                </td>
                <td>
                  {x.SE_Equipments.length>0 &&
                    x.SE_Equipments.map((y, j)=>{
                      return(
                        <div key={j} className='blue-txt'>{y.container}</div>
                      )
                    })
                  }
                  {x.SE_Equipments.length==0 && <div className='grey-txt'>{"(Empty)"}</div>}
                </td>
                <td>
                  POL: <span className='grey-txt'>{x.pol}</span><br/>
                  POD: <span className='grey-txt'>{x.pod}</span><br/>
                  {/* FLD: <span className='grey-txt'> {x.fd}</span><br/> */}
                  Type: <span className='grey-txt'>{x.subType}</span>
                </td>
                <td>
                  {/* Container: <span className='grey-txt'>{x.container}</span><br/> */}
                  Weight: <span className='grey-txt'>{x.weight}</span><br/>
                  No of Pcs: <span className='grey-txt'>{x.pcs} {x.pkgUnit}</span><br/>
               
                </td>
                <td>
                  Transportion: <span className='blue-txt fw-5'>{x.transportCheck!=''?'Yes':'No'}</span><br/>
                  {/* Container #: <span className='blue-txt fw-5'>{x.container}</span><br/> */}
                  Invoice #: <span className='blue-txt fw-5'>{x.customerRef}</span><br/>
                  {/* <div>
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
              </div> */}
                  {/* Truck #: <span className='blue-txt fw-5'>{x.truck}</span> */}
                </td>
                <td>
                  {x.approved=="true"?<img src={'/approve.png'} height={70} className='' />:"Not Approved"}
                </td>
                <td className='blue-txt fw-6'>
                  {x.created_by?.name}
                </td>
              </tr>
              )
            })}
            </tbody>
          </Table>
          </div>
        </div>
        }
      </>
    )
  }
  if(checkAccess(dispatch, "Sea Import") && type=="CSI"){
    return(
      <>
        {companyId!='' &&
        <div className='base-page-layout'>
          <Row>
            <Col md={7}>
              <h5>
                {type=="CSE"?"SEA Export":type=="CSI"?"SEA Import":type=="CAE"?"AIR Export":type=="CAI"?"AIR Import":""}
                Job List
              </h5>
            </Col>
            <Col md={3}>
              <Input type="text" placeholder="Search by Client, Job, Invoice" size='sm' onChange={e => setQuery(e.target.value)} />
            </Col>
            <Col md={1}>
            <button className='btn-custom right px-4'
              onClick={()=>{
                Router.push(`/seaJobs/jobList`)
              }}
            >List</button>
            </Col>
            <Col md={1}>
              <button className='btn-custom right px-4'
                onClick={()=>{
                  queryClient.removeQueries({ queryKey: ['jobData',{ type }] })
                  let obj = {...changedValues.value}
                  obj[type] = ""
                  dispatchNew(addValues(obj));
                  dispatchNew(incrementTab({
                    "label":type=="CSE"?"SE JOB":
                            type=="CSI"?"SI JOB":
                            type=="CAE"?"AE JOB":
                            "AI JOB",
                    "key":type=="CSE"?"8-4":type=="CSI"?"9-4":type=="CAE"?"8-2":"9-2",
                    "id":"new"
                  }));
                  Router.push(
                    type=="CSE"?`/clearanceJobs/export/sea/new`:
                    type=="CSI"?`/clearanceJobs/import/sea/new`:
                    type=="CAE"?`/clearanceJobs/export/air/new`:
                    `/clearanceJobs/import/air/new`
                  )
                }}
              >Create</button>
            </Col>
          </Row>
          <hr className='my-2' />
          <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
          <Table className='tableFixHead'>
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Basic Info</th>
                <th>Container Info</th>
                <th>Shipment Info</th>
                <th>Weight Info</th>
                <th>Other Info</th>
                <th>Status</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
            {records.filter((x)=>{
             return x?.Client?.name?.toLowerCase().includes(query.toLowerCase()) ||
                    x?.jobNo?.toLowerCase().includes(query.toLowerCase()) ||
                    x?.gd?.toLowerCase().includes(query.toLowerCase()) ||
                    x?.containers?.toLowerCase().includes(query.toLowerCase()) ||
                    x?.pcs?.includes(query) ||
                    x?.customerRef?.includes(query) ||
                    x?.created_by?.name?.includes(query)
            })?.map((x, index) => {
            return (
              <tr key={index} className='f row-hov' onClick={() => {
                queryClient.removeQueries({ queryKey: ['jobData',{ type }] })
                let obj = {...changedValues.value}
                obj[type] = ""
                dispatchNew(addValues(obj));
                dispatchNew(incrementTab({
                  "label":type=="CSE"?"SE JOB":type=="CSI"?"SI JOB":type=="CAE"?"AE JOB":"AI JOB",
                  "key":type=="CSE"?"8-4":type=="CSI"?"9-4":type=="CAE"?"8-2":"9-2",
                  "id":x.id
                }))
                Router.push(
                  type=="CSE"?`/clearanceJobs/export/sea/${x.id}`:
                  type=="CSI"?`/clearanceJobs/import/sea/${x.id}`:
                  type=="CAE"?`/clearanceJobs/export/air/${x.id}`:
                  `/clearanceJobs/import/air/${x.id}`
                )
              }}>
                <td>{index + 1}</td>
                <td>
                  Job #<span className='blue-txt fw-7'> {x.jobNo}</span><br/>
                  GD #<span className='blue-txt fw-7'> {x.gd}</span><br/>
                  Party:<span className='blue-txt fw-5'> {x.Client===null?"":x.Client.name}</span>
                </td>
                <td>
                  {x.SE_Equipments.length>0 &&
                    x.SE_Equipments.map((y, j)=>{
                      return(
                        <div key={j} className='blue-txt'>{y.container}</div>
                      )
                    })
                  }
                  {x.SE_Equipments.length==0 && <div className='grey-txt'>{"(Empty)"}</div>}
                </td>
                <td>
                  POL: <span className='grey-txt'>{x.pol}</span><br/>
                  POD: <span className='grey-txt'>{x.pod}</span><br/>
                  {/* FLD: <span className='grey-txt'> {x.fd}</span><br/> */}
                  Type: <span className='grey-txt'>{x.subType}</span>
                </td>
                <td>
                  {/* Container: <span className='grey-txt'>{x.container}</span><br/> */}
                  Weight: <span className='grey-txt'>{x.weight}</span><br/>
                  No of Pcs: <span className='grey-txt'>{x.pcs} {x.pkgUnit}</span><br/>
               
                </td>
                <td>
                  Transportion: <span className='blue-txt fw-5'>{x.transportCheck!=''?'Yes':'No'}</span><br/>
                  {/* Container #: <span className='blue-txt fw-5'>{x.container}</span><br/> */}
                  Invoice #: <span className='blue-txt fw-5'>{x.customerRef}</span><br/>
                  {/* <div>
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
              </div> */}
                  {/* Truck #: <span className='blue-txt fw-5'>{x.truck}</span> */}
                </td>
                <td>
                  {x.approved=="true"?<img src={'/approve.png'} height={70} className='' />:"Not Approved"}
                </td>
                <td className='blue-txt fw-6'>
                  {x.created_by?.name}
                </td>
              </tr>
              )
            })}
            </tbody>
          </Table>
          </div>
        </div>
        }
      </>
    )
  }
  if(checkAccess(dispatch, "Air Export Jobs List") && type=="CAE"){
    return(
      <>
        {companyId!='' &&
        <div className='base-page-layout'>
          <Row>
            <Col md={7}>
              <h5>
                {type=="CSE"?"SEA Export":type=="CSI"?"SEA Import":type=="CAE"?"AIR Export":type=="CAI"?"AIR Import":""}
                Job List
              </h5>
            </Col>
            <Col md={3}>
              <Input type="text" placeholder="Search by Client, Job, Invoice" size='sm' onChange={e => setQuery(e.target.value)} />
            </Col>
            <Col md={1}>
            <button className='btn-custom right px-4'
              onClick={()=>{
                Router.push(`/seaJobs/jobList`)
              }}
            >List</button>
            </Col>
            <Col md={1}>
              <button className='btn-custom right px-4'
                onClick={()=>{
                  queryClient.removeQueries({ queryKey: ['jobData',{ type }] })
                  let obj = {...changedValues.value}
                  obj[type] = ""
                  dispatchNew(addValues(obj));
                  dispatchNew(incrementTab({
                    "label":type=="CSE"?"SE JOB":
                            type=="CSI"?"SI JOB":
                            type=="CAE"?"AE JOB":
                            "AI JOB",
                    "key":type=="CSE"?"8-4":type=="CSI"?"9-4":type=="CAE"?"8-2":"9-2",
                    "id":"new"
                  }));
                  Router.push(
                    type=="CSE"?`/clearanceJobs/export/sea/new`:
                    type=="CSI"?`/clearanceJobs/import/sea/new`:
                    type=="CAE"?`/clearanceJobs/export/air/new`:
                    `/clearanceJobs/import/air/new`
                  )
                }}
              >Create</button>
            </Col>
          </Row>
          <hr className='my-2' />
          <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
          <Table className='tableFixHead'>
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Basic Info</th>
                <th>Container Info</th>
                <th>Shipment Info</th>
                <th>Weight Info</th>
                <th>Other Info</th>
                <th>Status</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
            {records.filter((x)=>{
             return x?.Client?.name?.toLowerCase().includes(query.toLowerCase()) ||
                    x?.jobNo?.toLowerCase().includes(query.toLowerCase()) ||
                    x?.gd?.toLowerCase().includes(query.toLowerCase()) ||
                    x?.containers?.toLowerCase().includes(query.toLowerCase()) ||
                    x?.pcs?.includes(query) ||
                    x?.customerRef?.includes(query) ||
                    x?.created_by?.name?.includes(query)
            })?.map((x, index) => {
            return (
              <tr key={index} className='f row-hov' onClick={() => {
                queryClient.removeQueries({ queryKey: ['jobData',{ type }] })
                let obj = {...changedValues.value}
                obj[type] = ""
                dispatchNew(addValues(obj));
                dispatchNew(incrementTab({
                  "label":type=="CSE"?"SE JOB":type=="CSI"?"SI JOB":type=="CAE"?"AE JOB":"AI JOB",
                  "key":type=="CSE"?"8-4":type=="CSI"?"9-4":type=="CAE"?"8-2":"9-2",
                  "id":x.id
                }))
                Router.push(
                  type=="CSE"?`/clearanceJobs/export/sea/${x.id}`:
                  type=="CSI"?`/clearanceJobs/import/sea/${x.id}`:
                  type=="CAE"?`/clearanceJobs/export/air/${x.id}`:
                  `/clearanceJobs/import/air/${x.id}`
                )
              }}>
                <td>{index + 1}</td>
                <td>
                  Job #<span className='blue-txt fw-7'> {x.jobNo}</span><br/>
                  GD #<span className='blue-txt fw-7'> {x.gd}</span><br/>
                  Party:<span className='blue-txt fw-5'> {x.Client===null?"":x.Client.name}</span>
                </td>
                <td>
                  {x.SE_Equipments.length>0 &&
                    x.SE_Equipments.map((y, j)=>{
                      return(
                        <div key={j} className='blue-txt'>{y.container}</div>
                      )
                    })
                  }
                  {x.SE_Equipments.length==0 && <div className='grey-txt'>{"(Empty)"}</div>}
                </td>
                <td>
                  POL: <span className='grey-txt'>{x.pol}</span><br/>
                  POD: <span className='grey-txt'>{x.pod}</span><br/>
                  {/* FLD: <span className='grey-txt'> {x.fd}</span><br/> */}
                  Type: <span className='grey-txt'>{x.subType}</span>
                </td>
                <td>
                  {/* Container: <span className='grey-txt'>{x.container}</span><br/> */}
                  Weight: <span className='grey-txt'>{x.weight}</span><br/>
                  No of Pcs: <span className='grey-txt'>{x.pcs} {x.pkgUnit}</span><br/>
               
                </td>
                <td>
                  Transportion: <span className='blue-txt fw-5'>{x.transportCheck!=''?'Yes':'No'}</span><br/>
                  {/* Container #: <span className='blue-txt fw-5'>{x.container}</span><br/> */}
                  Invoice #: <span className='blue-txt fw-5'>{x.customerRef}</span><br/>
                  {/* <div>
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
              </div> */}
                  {/* Truck #: <span className='blue-txt fw-5'>{x.truck}</span> */}
                </td>
                <td>
                  {x.approved=="true"?<img src={'/approve.png'} height={70} className='' />:"Not Approved"}
                </td>
                <td className='blue-txt fw-6'>
                  {x.created_by?.name}
                </td>
              </tr>
              )
            })}
            </tbody>
          </Table>
          </div>
        </div>
        }
      </>
    )
  }
  if(checkAccess(dispatch, "Air Import") && type=="CAI"){
    return(
      <>
        {companyId!='' &&
        <div className='base-page-layout'>
          <Row>
            <Col md={7}>
              <h5>
                {type=="CSE"?"SEA Export":type=="CSI"?"SEA Import":type=="CAE"?"AIR Export":type=="CAI"?"AIR Import":""}
                Job List
              </h5>
            </Col>
            <Col md={3}>
              <Input type="text" placeholder="Search by Client, Job, Invoice" size='sm' onChange={e => setQuery(e.target.value)} />
            </Col>
            <Col md={1}>
            <button className='btn-custom right px-4'
              onClick={()=>{
                Router.push(`/seaJobs/jobList`)
              }}
            >List</button>
            </Col>
            <Col md={1}>
              <button className='btn-custom right px-4'
                onClick={()=>{
                  queryClient.removeQueries({ queryKey: ['jobData',{ type }] })
                  let obj = {...changedValues.value}
                  obj[type] = ""
                  dispatchNew(addValues(obj));
                  dispatchNew(incrementTab({
                    "label":type=="CSE"?"SE JOB":
                            type=="CSI"?"SI JOB":
                            type=="CAE"?"AE JOB":
                            "AI JOB",
                    "key":type=="CSE"?"8-4":type=="CSI"?"9-4":type=="CAE"?"8-2":"9-2",
                    "id":"new"
                  }));
                  Router.push(
                    type=="CSE"?`/clearanceJobs/export/sea/new`:
                    type=="CSI"?`/clearanceJobs/import/sea/new`:
                    type=="CAE"?`/clearanceJobs/export/air/new`:
                    `/clearanceJobs/import/air/new`
                  )
                }}
              >Create</button>
            </Col>
          </Row>
          <hr className='my-2' />
          <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
          <Table className='tableFixHead'>
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Basic Info</th>
                <th>Container Info</th>
                <th>Shipment Info</th>
                <th>Weight Info</th>
                <th>Other Info</th>
                <th>Status</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
            {records.filter((x)=>{
             return x?.Client?.name?.toLowerCase().includes(query.toLowerCase()) ||
                    x?.jobNo?.toLowerCase().includes(query.toLowerCase()) ||
                    x?.gd?.toLowerCase().includes(query.toLowerCase()) ||
                    x?.containers?.toLowerCase().includes(query.toLowerCase()) ||
                    x?.pcs?.includes(query) ||
                    x?.customerRef?.includes(query) ||
                    x?.created_by?.name?.includes(query)
            })?.map((x, index) => {
            return (
              <tr key={index} className='f row-hov' onClick={() => {
                queryClient.removeQueries({ queryKey: ['jobData',{ type }] })
                let obj = {...changedValues.value}
                obj[type] = ""
                dispatchNew(addValues(obj));
                dispatchNew(incrementTab({
                  "label":type=="CSE"?"SE JOB":type=="CSI"?"SI JOB":type=="CAE"?"AE JOB":"AI JOB",
                  "key":type=="CSE"?"8-4":type=="CSI"?"9-4":type=="CAE"?"8-2":"9-2",
                  "id":x.id
                }))
                Router.push(
                  type=="CSE"?`/clearanceJobs/export/sea/${x.id}`:
                  type=="CSI"?`/clearanceJobs/import/sea/${x.id}`:
                  type=="CAE"?`/clearanceJobs/export/air/${x.id}`:
                  `/clearanceJobs/import/air/${x.id}`
                )
              }}>
                <td>{index + 1}</td>
                <td>
                  Job #<span className='blue-txt fw-7'> {x.jobNo}</span><br/>
                  GD #<span className='blue-txt fw-7'> {x.gd}</span><br/>
                  Party:<span className='blue-txt fw-5'> {x.Client===null?"":x.Client.name}</span>
                </td>
                <td>
                  {x.SE_Equipments.length>0 &&
                    x.SE_Equipments.map((y, j)=>{
                      return(
                        <div key={j} className='blue-txt'>{y.container}</div>
                      )
                    })
                  }
                  {x.SE_Equipments.length==0 && <div className='grey-txt'>{"(Empty)"}</div>}
                </td>
                <td>
                  POL: <span className='grey-txt'>{x.pol}</span><br/>
                  POD: <span className='grey-txt'>{x.pod}</span><br/>
                  {/* FLD: <span className='grey-txt'> {x.fd}</span><br/> */}
                  Type: <span className='grey-txt'>{x.subType}</span>
                </td>
                <td>
                  {/* Container: <span className='grey-txt'>{x.container}</span><br/> */}
                  Weight: <span className='grey-txt'>{x.weight}</span><br/>
                  No of Pcs: <span className='grey-txt'>{x.pcs} {x.pkgUnit}</span><br/>
               
                </td>
                <td>
                  Transportion: <span className='blue-txt fw-5'>{x.transportCheck!=''?'Yes':'No'}</span><br/>
                  {/* Container #: <span className='blue-txt fw-5'>{x.container}</span><br/> */}
                  Invoice #: <span className='blue-txt fw-5'>{x.customerRef}</span><br/>
                  {/* <div>
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
              </div> */}
                  {/* Truck #: <span className='blue-txt fw-5'>{x.truck}</span> */}
                </td>
                <td>
                  {x.approved=="true"?<img src={'/approve.png'} height={70} className='' />:"Not Approved"}
                </td>
                <td className='blue-txt fw-6'>
                  {x.created_by?.name}
                </td>
              </tr>
              )
            })}
            </tbody>
          </Table>
          </div>
        </div>
        }
      </>
    )
  }else{
    return(
      <div>No Access</div>
    )
  }



  console.log(records);
  }

export default JobsList;