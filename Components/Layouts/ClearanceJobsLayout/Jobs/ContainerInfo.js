import React from 'react';
import { Table } from 'react-bootstrap';
import { Select, Input, InputNumber  } from 'antd';

const ContainerInfo = ({state, dispatch}) => {

  const width = '100%';
  const addEquipment = () => {
    let tempState = [...state.container];
    tempState.push({truck:'', container:''});
    dispatch({type:'toggle', fieldName:'container', payload:tempState});
  }

  return (
  <>
    <hr/>
    <Table borderless>
      <thead>
        <tr>
          <th>#</th>
          <th>Container #</th>
          <th>Truck #</th>
        </tr>
      </thead>
      <tbody>
      {state.container?.map((x, i) => {
      return(
        <tr className='p-0' key={i}>
          <td className=''>{i+1}</td>
          <td className='px-0 py-0'>
          <Input placeholder="truck #" value={x.truck} style={{width:width}}
              onChange={(e)=>{
                let tempState = [...state.container];
                tempState[i].truck = e.target.value;
                dispatch({type:'toggle', fieldName:'container', payload:tempState})
              }}
            />
          </td>
          <td className='px-0 py-0'>
            <Input placeholder="container #" value={x.container} style={{width:width}}
              onChange={(e)=>{
                let tempState = [...state.container];
                tempState[i].container = e.target.value;
                dispatch({type:'toggle', fieldName:'container', payload:tempState})
              }}
            />
          </td>
        </tr>
      )})}
      </tbody>
    </Table>
    <button type='button' className='btn-custom-blue fw-8' onClick={addEquipment}>Add +</button>
  </>
  )
}

export default React.memo(ContainerInfo)