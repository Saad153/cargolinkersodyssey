import React, { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Select, Input, InputNumber } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import PopConfirm from '../../../Shared/PopConfirm';

const EquipmentInfo = ({state, dispatch}) => {
  
  const width = '100%';
  
  const addEquipment = () => {
    let tempState = [...state.equipments];
    tempState.push({size:'', qty:'', dg:'', container:''});
    dispatch({type:'toggle', fieldName:'equipments', payload:tempState});
  };
// console.log(state.equipments)
  return (
    <div style={{border:'1px solid silver', padding:'10px'}}>
      <div >
      <button type='button' className='btn-custom-blue fw-6 px-3' onClick={addEquipment}>Add +</button>
      </div>
      <div style={{maxHeight:170, overflowY:'auto', overflowX:'hidden'}}>
        <Table className='mt-2' borderless>
          <thead>
            <tr>
              <th>Size</th>
              <th>Container #</th>
              <th>Truck #</th>
              {/*<th>DG/Non-DG</th>*/}
              {/* <th>Gross Weight</th>
              <th>VGM</th> */}
              <th> </th>
            </tr>
          </thead>
          <tbody>
          {state.equipments.map((x, i) => {
          return(
            <tr className='p-0' key={i}>
              <td className='p-0 m-0'>
                <Select style={{width:width}} value={x.size}
                  className='p-0 m-0'
                  onChange={(e)=>{
                    let tempState = [...state.equipments];
                    tempState[i].size = e;
                    dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
                  }}
                  options={[
                    {value:'20FT', label:'20FT'},
                    {value:'40FT', label:'40FT'},
                    {value:'40HC', label:'40HC'},
                    {value:'45HC', label:'45HC'},
                    {value:'Reef 20', label:'Reef 20'},
                    {value:'Reef 40', label:'Reef 40'},
                  ]}
                />
              </td>
              <td className='p-0'>
                <Input placeholder="Container #" value={x.container} style={{width:width}}
                  min={1}
                  onChange={(e)=>{
                    let tempState = [...state.equipments];
                    tempState[i].container = e.target.value;
                    dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
                  }} />
              </td>
              <td className='p-0'>
                <Input placeholder="truck #" value={x.qty} style={{width:width}}
                  min={1}
                  onChange={(e)=>{
                    let tempState = [...state.equipments];
                    tempState[i].qty = e.target.value;
                    dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
                  }} />
              </td>
              {/*<td className='p-0'>
                <Select style={{ width: width }} value={x.dg}
                  onChange={(e)=>{
                    let tempState = [...state.equipments];
                    tempState[i].dg = e;
                    dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
                  }} 
                  options={[
                    {value:'non-DG', label:'non-DG'},
                    {value:'DG', label:'DG'},
                  ]}
                />
              </td>*/}
              {/* <td className='p-0'>
                <InputNumber placeholder="Weight" style={{width:width}} value={x.gross}
                  defaultValue={0.01}
                  min={0.01}
                  onChange={(e)=>{
                    let tempState = [...state.equipments];
                    tempState[i].gross = e!=null?e:0.01;
                    dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
                  }} 
                />
              </td> */}
              {/* <td className='p-0'>
                <InputNumber placeholder="VGM" style={{width:width}} value={x.teu} 
                  defaultValue={0.01}
                  min={0.01}
                  onChange={(e)=>{
                    let tempState = [...state.equipments];
                    tempState[i].teu = e!=null?e:0.01;
                    dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
                  }} 
                />
              </td> */}
              <td className='p-0 pt-2'>
                <CloseCircleOutlined className='mx-3 cross-icon' onClick={()=>{
                  PopConfirm(
                    "Confirmation",
                    "Are You Sure To Remove This Container",
                    ()=>{
                      let tempState = [...state.equipments];
                      tempState.splice(i, 1);
                      dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
                    })
                  }}
                />
              </td>
            </tr>
          )})}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default React.memo(EquipmentInfo)