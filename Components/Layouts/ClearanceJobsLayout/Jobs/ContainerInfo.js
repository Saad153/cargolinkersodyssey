import React from 'react';
import { Table } from 'react-bootstrap';
import { Select, Input, InputNumber  } from 'antd';

const ContainerInfo = ({state, dispatch}) => {

  const width = '100%';

  return (
  <>
    <Table>
      <thead>
        <tr>
          <th>Size/Type</th>
          <th>Quantity</th>
          <th>Gross Weight</th>
          <th>VGM</th>
        </tr>
      </thead>
      <tbody>
      {state.equipments.map((x, i) => {
      return(
        <tr className='f' key={i}>
          <td className='px-0'>
          <Select style={{width:width}} value={x.size}
            onChange={(e)=>{
              let tempState = [...state.equipments];
              tempState[i].size = e;
              dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
            }}
            options={[
              {label:'40HC', value:'40HC'},
              {label:'20HC', value:'20HC'},
              {label:'30HC', value:'30HC'},
              {value:'20SD', label:'20SD'},
              {value:'20FR', label:'20FR'},
              {value:'40SD', label:'40SD'},
              {value:'45HC', label:'45HC'},
              {value:'40HV', label:'40HV'},
              {value:'45BK', label:'45BK'},
              {value:'45OT', label:'45OT'},
              {value:'45TK', label:'45TK'},
              {value:'45VH', label:'45VH'},
              {value:'M3', label:'M3'},
              {value:'40OT', label:'40OT'},
              {value:'20RE', label:'20RE'},
              {value:'20TK', label:'20TK'},
              {value:'40FR', label:'40FR'},
              {value:'40BK', label:'40BK'},
              {value:'40HCRF', label:'40HCRF'},
              {value:'20BK', label:'20BK'},
              {value:'20OT', label:'20OT'},
              {value:'20FT', label:'20FT'},
            ]}
          />
          </td>
          <td className='px-0'>
            <InputNumber placeholder="Basic usage" value={x.qty} style={{width:width}}
              min={1}
              onChange={(e)=>{
                let tempState = [...state.equipments];
                tempState[i].qty = e;
                dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
              }}
            />
          </td>
          <td className='px-0'>
            <InputNumber placeholder="" style={{width:width}} value={x.gross}
              onChange={(e)=>{
                let tempState = [...state.equipments];
                tempState[i].gross = e;
                dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
              }}
            />
          </td>
          <td className='px-0'>
            <InputNumber style={{width:width}} value={x.teu} 
              onChange={(e)=>{
                let tempState = [...state.equipments];
                tempState[i].teu = e;
                dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
              }}
            />
          </td>
        </tr>
      )})}
      </tbody>
    </Table>
  </>
  )
}

export default React.memo(ContainerInfo)