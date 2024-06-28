import React from 'react';
import { Popover, Input } from "antd";
import { Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';
import openNotification from '/Components/Shared/Notification';
import moment from 'moment';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';

const Notes = ({state, dispatch, type}) => {
  
  const handleSubmit = async() => {

    if(state.title!=""&&state.note!=""){
      dispatch({type:'toggle', fieldName:'load', payload:true});
      setTimeout(async() => {
        await axios.post(process.env.NEXT_PUBLIC_CLIMAX_ADD_SEAJOB_NOTE,{
            title:state.title, note:state.note, recordId:state.selectedRecord.id, opened: "0", 
            recordId: state.selectedRecord.id,
            type: type,
            createdBy:Cookies.get('username')
        }).then((x)=>{
        if(x.data.status=='success'){
          const data = {opened : 1, recordId: x.recordId}
          openNotification('Success', `Note Added!`, 'green')
        }
        else{
          openNotification('Error', `An Error occured Please Try Again!`, 'red')
        }
        dispatch({type:"set",payload:{
          title : "",
          note : "",
          load : false
        }})
        })
      }, 3000);
    }
  };
  const getNotes = async() => {
    dispatch({type:'toggle', fieldName:'load', payload:true});
    setTimeout(async() => {
      await axios.post(process.env.NEXT_PUBLIC_CLIMAX_GET_SEAJOB_NOTES,{
        id: state.selectedRecord.id, type :state.selectedRecord.operation
      }).then((x)=>{
        if(x.data.status=='success'){
          const data = {
            opened : "1",
            recordId : x.data.result[0]?.recordId
          };
          updateNote(data);
          let tempNotes = x.data.result.map((x)=>{
            return{
              ...x,
              edit:false
            }
          })
          dispatch({type:'toggle', fieldName:'notes', payload:tempNotes});
        }
        dispatch({type:'toggle', fieldName:'load', payload:false})
      })
    }, 2000);
  };
  const updateNote = async(data) => {
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_UPDATE_SEAJOB_NOTES, {data})
  };

  return (
    <div className='my-2' >
      <p className='fs-16'>Tracing Notes</p>
      <Popover trigger="click"
        content={
          <div className='p-2 m-0' style={{border:'1px solid silver'}}>
            <h5>Add A Note</h5>
            <Input placeholder='title' value={state.title} 
              onChange={(e)=>dispatch({type:'toggle', fieldName:'title', payload:e.target.value})}
            />
            <Input.TextArea rows={4} placeholder='description' className='my-2' 
              value={state.note} 
              onChange={(e)=>dispatch({type:'toggle', fieldName:'note', payload:e.target.value})} 
            />
            <div className='div-btn px-3' style={{maxWidth:62}}  onClick={!state.load?handleSubmit:null}>
              {state.load?<Spinner size='sm' className='mx-2'/>:'Save'}
            </div>
          </div>
        }
      >
      <div className='div-btn px-3' style={{maxWidth:110}}>Add Notes</div>
      </Popover>
      <Popover trigger="click" 
        content={
          <div className='p-2 m-0' style={{border:'1px solid silver'}}>
            {state.load && 
              <div style={{minWidth:400, maxHeight:100, textAlign:'center'}}>
                <Spinner size='sm' color='dark'/>
              </div>
            }
            {!state.load && 
              <>
              <Row style={{minWidth:400, maxWidth:401, height:250, overflowY:'auto'}}>
                {state.notes.length<1 && <div style={{minWidth:400, maxHeight:100, textAlign:'center' ,color:'silver'}}>Empty</div>}
                {state.notes.map((x, i)=>{
                return(
                  <Col md={12} key={i}>
                    <Row className='mt-3'>
                      <Col md={9}>
                        <div>
                          <strong>Title:</strong>
                          <span className='mx-1'>{!x.edit && x.title}</span>
                          {x.edit && 
                            <input
                              value={x.title}
                              onChange={(e)=>{
                                let temp = [...state.notes];
                                temp[i].title = e.target.value;
                                dispatch({type:'toggle', fieldName:'notes', payload:temp});
                              }}
                            />
                          }
                        </div>
                        <div className='mt-2' style={{lineHeight:1.3, whiteSpace: 'pre-wrap'}}>
                          {!x.edit && x.note}
                          {x.edit && 
                            <textarea  
                              style={{width:'100%'}}
                              value={x.note}
                              cols={30}
                              onChange={(e)=>{
                                let temp = [...state.notes];
                                temp[i].note = e.target.value;
                                dispatch({type:'toggle', fieldName:'notes', payload:temp});
                              }}
                            />
                          }
                        </div>
                        <br/>
                        <span style={{fontSize:12, color:'grey'}}>Updated {moment(x.updatedAt).fromNow()}</span><br/>
                        <span style={{fontSize:12, color:'grey'}}>Updated {moment(x.createdAt).fromNow()}</span>
                      </Col>
                      <Col md={3} className='mx-0 px-0'>
                        <strong>By:</strong> {x.createdBy}<br/>
                        {!x.edit && <EditOutlined className='edit-icon'
                          style={{float:'right', marginRight:20}}
                          onClick={()=>{
                            let temp = [...state.notes];
                            temp[i].edit = true;
                            dispatch({type:'toggle', fieldName:'notes', payload:temp});
                          }}
                        />}
                        {x.edit && <SaveOutlined className='edit-icon'
                          style={{float:'right', marginRight:20}}
                          onClick={()=>{
                            let temp = [...state.notes];
                            temp[i].edit = false;
                            dispatch({type:'toggle', fieldName:'notes', payload:temp});
                            axios.post(process.env.NEXT_PUBLIC_CLIMAX_EDIT_SEAJOB_NOTES,{
                              notes:state.notes
                            })
                          }}
                        />}
                      </Col>
                    </Row>
                    <hr className='my-1' />
                  </Col>
                )})}
              </Row>
              </>
            }
          </div>
        }
      >
      <div className='div-btn px-3 mt-2' style={{maxWidth:110}} onClick={()=>getNotes()}>View Notes</div>
      </Popover>
    </div>
  )
}
export default Notes