import Cookies from "js-cookie";
import { incrementTab } from '/redux/tabs/tabSlice';
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { IoMdArrowDropleft } from "react-icons/io";
import { RiShipLine } from "react-icons/ri";
import { Router } from "next/router";
import { setAccesLevels } from '/functions/setAccesLevels';




function checkAccess(dispatch, pageName){
  // console.log(pageName);
  const items  = setAccesLevels(dispatch, true);
  let access = false;
  let newTemp = [];
  if(items.length > 0){
    items.forEach((x)=>{
      x.children.forEach((y)=>{
        if(y){
          newTemp.push(y)
        }
      })
    })
  }
  // console.log(newTemp);
  newTemp.forEach((x)=>{
    if(x.label === pageName){
      access = true;
      // console.log(access);
    }
  })
  
  


  return access
}

export { checkAccess }