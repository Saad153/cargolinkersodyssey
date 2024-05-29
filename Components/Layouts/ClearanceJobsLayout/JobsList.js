import { addValues } from '/redux/persistValues/persistValuesSlice';
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import React, { useEffect, useState } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { useQueryClient } from '@tanstack/react-query';
import Router from 'next/router';
import { Input } from 'antd';

const JobsList = ({ jobsData, sessionData, type }) => {

  const queryClient = useQueryClient();
  const changedValues = useSelector((state)=>state.persistValues);
  const companyId = useSelector((state) => state.company.value);
  const [records, setRecords] = useState([]);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const keys = ["jobNo","weight","Client","name","truck","container","gd","customerRef"]

  useEffect(() => {
    if(jobsData.status=="success"){
      console.log(jobsData.result)
      setRecords(jobsData.result);
    }
  }, []);

  const search = (data) => {
    return data?.filter(item => {
      return keys.some(key => {
        if (key === "Client" && item[key] && item[key].name) {
          return item[key].name.toLowerCase().includes(query.toLowerCase());
        } else if (item[key]) {
          return item[key].toLowerCase().includes(query.toLowerCase());
        } else {
          return false;
        }
      });
    });
  };

  useEffect(() => {
    const filteredData = search(jobsData.result);
    setRecords(filteredData)
  }, [jobsData, query])

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
          <Input type="text" placeholder="Search by Client, Job, Truck, Container, Invoice" size='sm' onChange={e => setQuery(e.target.value)} />
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
              dispatch(addValues(obj));
              dispatch(incrementTab({
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
            <th>Shipment Info</th>
            <th>Weight Info</th>
            <th>Other Info</th>
            <th>Status</th>
            <th>Created By</th>
          </tr>
        </thead>
        <tbody>
        {records?.map((x, index) => {
        return (
          <tr key={index} className='f row-hov' onClick={() => {
            queryClient.removeQueries({ queryKey: ['jobData',{ type }] })
            let obj = {...changedValues.value}
            obj[type] = ""
            dispatch(addValues(obj));
            dispatch(incrementTab({
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
              POL: <span className='grey-txt'>{x.pol}</span><br/>
              POD: <span className='grey-txt'>{x.pod}</span><br/>
              FLD: <span className='grey-txt'> {x.fd}</span>
            </td>
            <td>
              {/* Container: <span className='grey-txt'>{x.container}</span><br/> */}
              Weight: <span className='grey-txt'>{x.weight}</span><br/>
              No of Pcs: <span className='grey-txt'>{x.pcs} {x.pkgUnit}</span>
            </td>
            <td>
              Transportion: <span className='blue-txt fw-5'>{x.transportCheck!=''?'Yes':'No'}</span><br/>
              Container #: <span className='blue-txt fw-5'>{x.container}</span><br/>
              Invoice #: <span className='blue-txt fw-5'>{x.customerRef}</span><br/>
              Truck #: <span className='blue-txt fw-5'>{x.truck}</span>
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
)}

export default JobsList;