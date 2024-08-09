import { Table } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tag, Switch, Input, Select } from 'antd';
import { CheckCircleOutlined } from "@ant-design/icons"

const PartySearch = ({state, dispatch, reset, useWatch, control}) => {

  const [partyType, setPartyType] = useState('vendor');
  const [searchTerm, setSearchTerm] = useState('');
  const chargeList = useWatch({ control, name: 'chargeList' });
  
  const getClients = async() => {
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CLIENTS)
    .then((x) => {
      dispatch({type:'toggle', fieldName:'clientParties', payload:x.data.result});
    })
  }
  
  const getVendors = async() => {
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_VENDOR_FOR_PARTY_SEARCH)
    .then((x) => {
      // console.log(x.data.result)
      let data = [];
      x.data.result.forEach(x => {
        data.push({...x, check:false})
      });
      dispatch({type:'toggle', fieldName:'vendorParties', payload:data});
    })
  }

  const getEmpAccount = async() => {
    axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CHILD_ACCOUNTS,{
      headers:{ companyid: 2 }
    }).then((x) => {
      // console.log(x.data.result)
      let data = x.data.result.filter((x)=>{
        if(x.Parent_Account.AccountId=="1"){ return x }
      })
      // console.log(data)
      let data2 = [];
      data.forEach((x)=>{
        data2.push({...x, check:false})
      })
      // console.log(data2)
      dispatch({type:'toggle', fieldName:'employeeParties', payload:data2});
    })
  }

// console.log(state.employeeParties)
  useEffect(() => {
    getClients();
    getVendors();
    getEmpAccount();
  }, [])

  const RenderEmployeeAccount = ((props) => {
    return(
      <>
        {
        props.data.filter((x)=>{
          if(
            x.title.toLowerCase().includes(searchTerm.toLowerCase())||
            x.id.includes(searchTerm)||
            x.Parent_Account.title.toLowerCase().includes(searchTerm.toLowerCase())

          ){ return x }
          if(searchTerm == ""){ return x }
        }).map((x, i)=> {
          return(
            <tr
            key={i}
            className='table-select-list'
            onClick={()=>{
              
              if(!x.check){
                let temp = state.employeeParties;
                temp.forEach((y, i2)=>{
                  if(y.id==x.id){ y.check=true
                  } else { y.check=false }
                })
                
                dispatch({type:'toggle', fieldName:'employeeParties', payload:temp});
              } else {
                let temp = [];
                temp = chargeList;
                temp[state.headIndex] = {
                  ...temp[state.headIndex], 
                  name:x.title, 
                  partyId:x.id, 
                  partyType:partyType
                }
                reset({ chargeList: temp });
                let tempOne = [...state.vendorParties];
                let tempTwo = [...state.clientParties];
                let tempThree = [...state.employeeParties];
                tempOne.forEach((y, i1)=>{
                  tempOne[i1].check=false
                })
                tempTwo.forEach((y, i1)=>{
                  tempTwo[i1].check=false
                })
                tempThree.forEach((y, i1)=>{
                  console.log(tempThree[i1])
                  tempThree[i1].check=false
                })
                dispatch({ type:'set', payload:{headIndex:"", headVisible:false, vendorParties:tempOne, clientParties:tempTwo, employeeParties:tempThree} })
              }
            }}
            >
              <td className='pt-1 text-center px-3'> {x.check?<CheckCircleOutlined style={{color:'green', position:'relative', bottom:2}} />:i+1 } </td>
              <td className='pt-1' style={{whiteSpace:"nowrap"}}><strong>{x.title}</strong></td>
              <td className='pt-1 text-center'>
                {x.Parent_Account.title?.split(", ").map((y, i2)=>{
                  return <Tag key={i2} color="purple" className='mb-1'>{y}</Tag>
                })}
              </td>
            </tr>
          )
        })
        }
      </>
    )
    
  })

  const RenderData = ((props) => {
    return(
    <>
      {props.data.filter((x)=>{
        
        if(
          x.name.toLowerCase().includes(searchTerm.toLowerCase())||
          x.code.toLowerCase().includes(searchTerm.toLowerCase())||
          x.types?.toLowerCase().includes(searchTerm.toLowerCase())
        ){ return x }
        
        if(searchTerm==""){ return x }
      }).map((x, i)=> {
      return(
      <tr key={i} className={`${x.check?"table-select-list-selected":"table-select-list"}`}
        onClick={()=>{
          if(!x.check){
            let temp = props.type=="vendors"?[...state.vendorParties]:[...state.clientParties];
            temp.forEach((y, i2)=>{
              if(y.id==x.id){ temp[i2].check=true
              } else { temp[i2].check=false }
            })
            dispatch({type:'toggle', fieldName:props.type=="vendors"?'vendorParties':'clientParties', payload:temp});
          } else {
            let temp = [];
            temp = chargeList;
            if(state.chargesTab=='1'){
              temp[state.headIndex].invoiceType = x.types?.includes("Overseas Agent")?"Agent Bill":"Job Invoice" ;
            }
            else {
              temp[state.headIndex].invoiceType = x.types.includes("Overseas Agent")?"Agent Invoice":"Job Bill" ;
            }
            temp[state.headIndex] = {
              ...temp[state.headIndex], 
              name:x.name, 
              partyId:x.id, 
              partyType:partyType
            }
            reset({ chargeList: temp });
            let tempOne = [...state.vendorParties];
            let tempTwo = [...state.clientParties];
            tempOne.forEach((y, i1)=>{
              tempOne[i1].check=false
            })
            tempTwo.forEach((y, i1)=>{
              tempTwo[i1].check=false
            })
            dispatch({ type:'set', payload:{headIndex:"", headVisible:false, vendorParties:tempOne, clientParties:tempTwo} })
          }
        }}
      >
        <td className='pt-1 text-center px-3'> {x.check?<CheckCircleOutlined style={{color:'green', position:'relative', bottom:2}} />:i+1 } </td>
        <td className='pt-1' style={{whiteSpace:"nowrap"}}><strong>{x.name}</strong></td>
        <td className='pt-1 text-center'>
          {x.types?.split(", ").map((y, i2)=>{
            return <Tag key={i2} color="purple" className='mb-1'>{y}</Tag>
          })}
        </td>
        <td className='pt-1 text-center'>{x.city}</td>
        <td className='pt-1 text-center'>
          <Tag color="geekblue" className='mb-1'>{x.person1}</Tag>
        </td>
        <td className='pt-1 text-center'><Tag color="cyan" className='mb-1'>{x.mobile1}</Tag></td>
      </tr>
      )})}
    </>
    )
  })
  // console.log(state)

  return(
    <>
    <h5>Party Selection</h5>
    <hr/>
    <Select defaultValue="vendor" style={{width:150}} onChange={(e)=>setPartyType(e)}>
      <option value="vendor">Vendor</option>
      <option value="client">Client</option>
      <option value="employee accounts">Employee Accounts</option>
      </Select>
    <span className='mx-2'><b>{partyType}</b></span>
    <Input style={{width:200}} placeholder='Type Name' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
    <div className='table-sm-1 mt-4' style={{minHeight:300, maxHeight:300, overflowY:'auto'}}>
      <Table className='tableFixHead'>
        {partyType!="employee accounts" &&
          
      <thead>
        <tr>
          <th className='text-center'>#</th>
          <th className='text-center'>Name</th>
          <th className='text-center'>Types</th>
          <th className='text-center'>City</th>
          <th className='text-center'>Contact Persons</th>
          <th className='text-center'>Mobile</th>
        </tr>
      </thead>
        }
        {partyType=="employee accounts" &&
        <thead>
          <tr>
            <th className='text-center'>#</th>
            <th className='text-center'>Title</th>
            <th className='text-center'>Parent Account</th>
          </tr>
        </thead>
        }
      <tbody>
      {partyType != "employee accounts" &&
      <RenderData 
      data={
        partyType=="vendor"?state.vendorParties:state.clientParties
        } type={partyType=="vendor"?'vendors':'clients'} searchTerm={searchTerm} />
      }
      {partyType == "employee accounts" &&
      <RenderEmployeeAccount data={state.employeeParties} type={'employee accounts'} searchTerm={searchTerm} />

      }
      </tbody>
      </Table>
    </div>
    <div>
    </div>
    </>
  )
}

export default React.memo(PartySearch)