import { Checkbox } from "antd";
import { useController } from "react-hook-form";
import { memo } from "react";

//const CheckGroupComp = ({ control, name, label, ...rest }) => {
const CheckGroupComp = (props) => {
  const { control, name } = props;
  const { field: { onChange, onBlur, value, name: fieldName, ref } } = useController({ control, name });
  // console.log(useController({ control, name }))
  // console.log(value)
  let access = false
  if(value == "1"){
    access = true;
  }

  return (
    <>
      <div>{props.label}</div>
      <Checkbox.Group  name={fieldName} onChange={onChange} value={value} ref={ref} onBlur={onBlur} 
        {...props.rest}
        disabled={props.disabled && access}
        options={props.options}
        style={{width:props.width, fontSize:12}}
      />
    </>
  )
}

export default memo(CheckGroupComp)