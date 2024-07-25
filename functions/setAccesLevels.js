import Cookies from "js-cookie";
import { incrementTab } from '/redux/tabs/tabSlice';
import { AccountBookOutlined, HomeOutlined, SettingOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { IoMdArrowDropleft } from "react-icons/io";
import { RiShipLine } from "react-icons/ri";
import jwt_decode from 'jwt-decode';


function setAccesLevels(dispatch, collapsed){
  let items = [];
  let levels = JSON.stringify(jwt_decode(Cookies.get("token")).access);
  // let levels = Cookies.get("access");

//getParentItem only returns the section data as objects to store in items array.
  const dashboard = getParentItem('Dashboard', '1', <HomeOutlined />,[

    //getItem only returns the subsection data as objects to store in parents children array.
    getItem('Home', '1-1',<></>, null, {
      label: `Home`,
      key: '1-1',
      children: `Content of Tab Pane 2`,
    }),
    getItem('Requests', '1-2',<></>, null, {
      label: `Requests`,
      key: '1-2',
      children: `Content of Tab Pane 2`,
    }),
  ])
  const setup = getParentItem('Setup', '2', <SettingOutlined />,
  [
    //checks whether the given strings are part of the access level array or not, and includes the subsection into the children array of the parent section.
    (levels?.includes("Employees")||levels?.includes("admin"))?getItem('Employees', '2-1', <></>, null, {
      label: 'Employees',
      key: '2-1',
      children: 'Content of Tab Pane 2',
    }):null,
    (levels?.includes("VendorList")||levels?.includes("admin"))?getItem('Vendor List', '2-5',<></>, null, {
      label: `Vendor List`,
      key: '2-5',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("NonGLParties")||levels?.includes("admin"))?getItem('Non-GL Parties', '2-9',<></>, null, {
      label: `Non-GL Parties`,
      key: '2-9',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("Commodity")||levels?.includes("admin"))?getItem('Commodity', '2-3',<></>, null, {
      label: `Commodity`,
      key: '2-3',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("Voyage")||levels?.includes("admin"))?getItem('Voyage', '2-4',<></>, null, {
      label: `Voyage`,
      key: '2-4',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("Charges")||levels?.includes("admin"))?getItem('Charges', '2-6',<></>, null, {
      label: `Charges`,
      key: '2-6',
      children: `Content of Tab Pane 2`,
    }):null,
  ]
  )
  const accounts = getParentItem('Accounts', '3', <AccountBookOutlined />,
  [
    (levels?.includes("ChartOfAccount")||levels?.includes("admin"))?getItem('Chart Of Account', '3-1',<></>, null, {
      label: `Chart Of Account`,
      key: '3-1',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("Invoice/Bills")||levels?.includes("admin"))?getItem('Invoice / Bills', '3-3',<></>, null, {
      label: `Invoice / Bills`,
      key: '3-3',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("Payment/Reciept")||levels?.includes("admin"))?getItem('Payment / Receipt', '3-4',<></>, null, {
      label: `Payment / Receipt`,
      key: '3-4',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("Voucher")||levels?.includes("admin"))?getItem('Voucher', '3-5',<></>, null, {
      label: `Voucher`,
      key: '3-5',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("VoucherList")||levels?.includes("admin"))?getItem('Voucher List', '3-6',<></>, null, {
      label: `Voucher List`,
      key: '3-6',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("OfficeVoucherList")||levels?.includes("admin"))?getItem('Office Voucher List', '3-7',<></>, null, {
      label: `Office Voucher List`,
      key: '3-7',
      children: `Content of Tab Pane 3-7`,
    }):null,
    (levels?.includes("OpeningBalances")||levels?.includes("admin"))?getItem('Opening Balances', '3-9',<></>, null, {
      label: `Opening Balances`,
      key: '3-9',
      children: `Content of Tab Pane 3-7`,
    }):null,
    (levels?.includes("OpeningInvoises")||levels?.includes("admin"))?getItem('Opening Invoices', '3-11',<></>, null, {
      label: `Opening Invoices`,
      key: '3-11',
      children: `Content of Tab Pane 3-11`,
    }):null   
  ]
  )
  const reports = getParentItem('Reports', '5', <HiOutlineDocumentSearch/>,
  [
    (levels?.includes("JobBalancing")||levels?.includes("admin"))?getItem('Job Balancing', '5-1',<></>, null, {
      label: `Job Balancing`,
      key: '5-1',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("AccountActivity")||levels?.includes("admin"))?getItem('Account Activity', '5-2',<></>, null, {
      label: `Account Activity`,
      key: '5-2',
      children: `Content of Tab Pane 2`,
    }):null,
    (levels?.includes("BalanceSheet")||levels?.includes("admin"))?getItem('Balance Sheet', '5-3',<></>, null, {
      label: `Balance Sheet`,
      key: '5-3',
      children: `Content of Tab Pane 3`,
    }):null,
    (levels?.includes("JobProfit/Loss")||levels?.includes("admin"))?getItem('Job Profit/Loss', '5-4',<></>, null, {
      label: `Job Profit/Loss`,
      key: '5-4',
      children: `Content of Tab Pane 3`,
    }):null,
    (levels?.includes("Ledger")||levels?.includes("admin"))?getItem('Ledger', '5-5',<></>, null, {
      label: `Ledger`,
      key: '5-5',
      children: `Content of Tab Pane 3`,
    }):null,
    (levels?.includes("AgentInvBalance")||levels?.includes("admin"))?getItem('Agent Inv. Balance', '5-6',<></>, null, {
      label: `Agent Invoice Balancing`,
      key: '5-6',
      children: `Content of Tab Pane 3`,
    }):null,
    (levels?.includes("TrialBalance")||levels?.includes("admin"))?getItem('Trial Balance', '5-9',<></>, null, {
      label: `Trial Balance`,
      key: '5-9',
      children: `Content of Tab Pane 3`,
    }):null,
    (levels?.includes("IncomeStatement")||levels?.includes("admin"))?getItem('Income statement', '5-11',<></>, null, {
      label: `Income statement`,
      key: '5-11',
      children: `Content of Tab Pane 3`,
    }):null    
  ]
  )
  const tasks = getParentItem('Tasks', '6', <UnorderedListOutlined  />,
    [
      getItem('Riders List', '6-1',<></>, null, {
        label: `Riders List`,
        key: '6-1',
        children: `Content of Tab Pane 2`,
      }),
      getItem('Task List', '6-3',<></>, null, {
        label: `Task List`,
        key: '6-3',
        children: `Content of Tab Pane 2`,
      }),
    ]
  )
  const exportJobs = getParentItem('Export Jobs', '8', <span className=''><RiShipLine /><IoMdArrowDropleft className='flip' /></span>,
    [
      (levels?.includes("ExAir")||levels?.includes("admin"))?getItem('Air Export Jobs List', '8-1',<></>, null, {
        label: `Air Export Jobs List`,
        key: '8-1',
        children: `Content of Tab Pane 2`,
      }):null, 
      (levels?.includes("ExSea")||levels?.includes("admin"))?getItem('Sea Export Jobs List', '8-3',<></>, null, {
        label: `Sea Export Jobs List`,
        key: '8-3',
        children: `Content of Tab Pane 2`,
      }):null
    ]
  )
  const importJobs = getParentItem('Import Jobs', '9', <span className=''><RiShipLine /><IoMdArrowDropleft className='flip' /></span>,
    [
      (levels?.includes("ImAir")||levels?.includes("admin"))?getItem('Air Import', '9-1',<></>, null, {
        label: `Air Import`,
        key: '9-1',
        children: `Content of Tab Pane 2`,
      }):null, 
      (levels?.includes("ImSea")||levels?.includes("admin"))?getItem('Sea Import', '9-3',<></>, null, {
        label: `Sea Import`,
        key: '9-3',
        children: `Content of Tab Pane 2`,
      }):null,
    ]
  )

  //functions to generate objects from the parent and children data and rearranging the data within the object.
  function getParentItem(label, key, icon, children) {
    return { key, icon, children, label}
  }
  function getItem(label, key, icon, children, tab) {
    return { key, icon, children, label,
    onClick:()=>{
      if(!collapsed){ dispatch(incrementTab(tab)); }
    }
  }}

  //Adds the related parents into the items array by checking if the user has access to any of the children.
  if(levels){
    levels = levels.slice(0, -1)
    levels = levels.substring(1);
    levels = levels.split(", ")
    levels.forEach(x => {
      switch (x) {
        case "ExSea"||"ExAir":
          items.indexOf(exportJobs) === -1 ? items.push(exportJobs) : null;
          break;
        case "ImAir"||"ImSea":
          items.indexOf(importJobs) === -1 ? items.push(importJobs) : null;
          break;
        case "Employees"||"ClientList"||"VendorList"||"NonGLParties"||"Commodity"||"Voyage":
          items.indexOf(setup) === -1 ? items.push(setup) : null;
          break;
          case "Charges"||"ChartOfAccount"||"Invoice/Bills"||"Payment/Reciept"||"Voucher"||"VoucherList"||"OfficeVoucherList"||"OpeningBalances"||"OpeningInvoises":
            items.indexOf(accounts) === -1 ? items.push(accounts) : null;
            break;
          case "JobBalancing"||"AccountActivity"||"BalanceSheet"||"JobProfit/Loss"||"Ledger"||"AgentInvBalance"||"TrialBalance"||"IncomeStatement":
            items.indexOf(reports) === -1 ? items.push(reports) : null;
            break;
        case "admin":
          items = [
            exportJobs,
            importJobs,
            setup,
            accounts,
            reports
        ]
          break;
        default:
          break;
      }
    });
    
  }

  items.unshift(dashboard)
  items.push(tasks)
  return items
}

export { setAccesLevels }