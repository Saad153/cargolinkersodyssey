import React from 'react';
import { Table } from 'react-bootstrap';
import { Select, Input, InputNumber  } from 'antd';

const EquipmentInfo = ({state, dispatch}) => {

  const width = '100%';

  return (
  <div>
    <hr/>
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
              if(e=='40HC'){// 1 * 2
                tempState[i].gross = 3900;
              }else if(e=='20HC') { // 1 * 1
                tempState[i].gross = 0; 
              }else if(e=='20SD'){// 1 * 1
                tempState[i].gross = 2350; 
              }else if(e=='20FR'){// 1 * 1
                tempState[i].gross = 2900; 
              }else if(e=='40SD'){ // 1 * 2
                tempState[i].gross = 3750; 
              }else if(e=='45HC'){ // 1 * 2
                tempState[i].gross = 4800; 
              }
              dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
            }}
            options={[
              {value:'40HC', label:'40HC'},
              {value:'20HC', label:'20HC'},
              {value:'20SD', label:'20SD'},
              {value:'20FR', label:'20FR'},
              {value:'40SD', label:'40SD'},
              {value:'45HC', label:'45HC'},
            ]}
          />
          </td>
          <td className='px-0'>
            <InputNumber placeholder="Basic usage" value={x.qty} style={{width:width}}
              min={1}
              onChange={(e)=>{
                let tempState = [...state.equipments];
                console.log(tempState[i].gross)
                tempState[i].qty = e;
                let value = 0;
                tempState[i].size=="40HC"?
                  value = 3900:
                  tempState[i].size=="20HC"?
                  value = 0:
                  tempState[i].size=="20SD"?
                  value = 2350:
                  tempState[i].size=="20FR"?
                  value = 2900:
                  tempState[i].size=="40SD"?
                  value = 3750:
                  value = 4800; // 45HC
                tempState[i].gross = value * tempState[i].qty;
                tempState[i].teu = tempState[i].qty*2;
                dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
              }} />
          </td>
          <td className='px-0'>
            {(state.selectedRecord.operation=="CSE"||state.selectedRecord.operation=="CAE")? 
              <Input placeholder="" style={{width:width}} value={x.gross} />:
              <Input placeholder="" style={{width:width}} disabled />
            }
          </td>
          <td className='px-0'>
            <Input placeholder="" style={{width:width}} value={x.teu} />
          </td>
        </tr>
      )})}
      </tbody>
    </Table>
  </div>
  )
}

export default React.memo(EquipmentInfo)