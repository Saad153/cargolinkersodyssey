import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Row, Col, Table } from 'react-bootstrap';
import inWords from '/functions/numToWords';

const CLPrint = ({ records, invoice }) => {
    const [values, setValues] = useState({
        tax: 0,
        taxPercent:0.00,
        serviceCharges:0,
        total: 0,
        netBalance: 0,
    });
    const commas = (a) => { return parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") }
    const Line = () => <div style={{ backgroundColor: "black", height: 3, position: 'relative', top: 12 }}></div>
    const border = "1px solid black";

    useEffect(() => {
        console.log("incvoice", invoice)
        let result = 0;
        let temptax = 0;
        let taxPercent = 0;
        let netBalance = 0;
        let tempServiceCharges = 0;
        records.forEach((x) => {
          if(x.charge!='57'){
            temptax = temptax + parseFloat(x.tax_amount);
            taxPercent = parseFloat(x.taxPerc)
            result = result + parseFloat(x.local_amount);
          } else {
            tempServiceCharges = tempServiceCharges + parseFloat(x.local_amount);
          }
          netBalance = netBalance + parseFloat(x.local_amount) + parseFloat(x.tax_amount)
        });
        setValues({
            tax: temptax,
            total: result,
            netBalance: netBalance,
            taxPercent: taxPercent,
            serviceCharges: tempServiceCharges
        });
    }, [records])
    const totalFloat = values.total;
    const taxFloat = values.taxPercent;
    const serviceFloat = values.serviceCharges
    // + values.serviceCharges;
    const sum = totalFloat+serviceFloat+taxFloat;
    console.log("sum", sum)
    return (
    <div className='pb-5 px-5 pt-2'>
      <Row>
        <Col>
            <header className='justify-content-center text-center'>
            {/* <span className='fs-6'><strong>CARGO LINKERS</strong></span> <br /> */}
            <img src={'/cargolinkers-logo.png'} style={{filter:"invert(1)"}} className='my-2' height={80} />
            <br/>
            <span className='fs-12' style={{ lineHeight: "-20px" }}>F-50 BLOCK-6 SHAHRAH-E-FAISAL KARACHI</span>
            </header>
        </Col>
      </Row>
      <Row>
        <Col>
            <header className='justify-content-center text-center'>
                <span className='fs-17'>NTN.5322935-2</span> <br />
            </header>
        </Col>
      </Row>
      <Row>
        <Col md={5}><Line /></Col>
        <Col md={2}>
            <div className='text-center fs-17' style={{ whiteSpace: 'nowrap' }}>
                <strong>Invoice</strong>
            </div>
        </Col>
        <Col md={5}><Line /></Col>
      </Row>
      <Row style={{ paddingLeft: 12, paddingRight: 12, marginTop: "10px" }}>
        <Col md="6" style={{ borderTop: border, borderRight: border, borderLeft: border, borderBottom: border, }}>
            <div className='d-flex'>
                <div className='fs-12 pe-3 fw-bold'>M/S:</div>
                <div className='fs-12'>
                    <span className='fs-12'>{invoice?.SE_Job?.Client ? invoice?.SE_Job?.Client?.name : ""}</span> <br />
                    <span className='fs-12'>{invoice?.SE_Job?.Client ? invoice?.SE_Job?.Client?.address1 : ""}</span> <br />
                </div>
            </div>
        </Col>
        <Col md="6" style={{ borderTop: border, borderRight: border, borderLeft: border, borderBottom: border, textAlign: "center" }}>
            <div className='d-flex justify-content-start'>
                <div className='text-start' style={{ lineHeight: "-20px" }}>
                    <span className='fs-12 pe-3 fw-bold'>Invoice No :</span><br />
                    <span className='fs-12 pe-3 fw-bold'>Invoice Date :</span><br />
                    <span className='fs-12 pe-3 fw-bold'>GST Invoice # :</span><br />
                    <span className='fs-12 pe-3 fw-bold'>Job Type :</span><br />
                </div>
                <div className='text-start' style={{ lineHeight: "-20px" }}>
                    <span className='fs-12'>{invoice.invoice_No ? invoice.invoice_No : ""}</span><br />
                    <span className='fs-12'>{invoice.createdAt ? moment(invoice.createdAt).format('DD MMM, YYYY') : ""}</span><br />
                    <span className='fs-12'></span><br />
                    <span className='fs-12'>{invoice?.SE_Job?.subType || ""}</span><br />
                </div>
            </div>
        </Col>
      </Row>
      <Row style={{ paddingLeft: 12, paddingRight: 12, }}>
      <Col md="6" style={{ borderLeft: border, borderBottom: border }}>
        <div className='d-flex justify-content-start'>
            <div className='text-start'>
                <span className='fs-11 pe-3 fw-bold'>Client Ref # :</span><br />
                <span className='fs-11 pe-3 fw-bold mt-6'>GD:</span><br />
                <span className='fs-11 pe-3 fw-bold'>No Of Packages :</span><br />
                <span className='fs-11 pe-3 fw-bold'>Description # :</span><br />
                <span className='fs-10 pe-3 fw-bold'>FORM {"'E'"} #:</span><br />
               
            </div>
            <div className='text-start'>
                <span className='fs-12'></span><br />
                <span className='fs-12 mt-6'>{invoice?.SE_Job?.gd}</span><br />
                <span className='fs-12'>{invoice.SE_Job.pcs ? invoice.SE_Job.pcs : ""} Cartons</span><br />
                <span className='fs-12'>{invoice.SE_Job.commodity ? invoice.SE_Job.commodity.name : ""}</span><br />
                <span className='fs-12'>{invoice?.SE_Job?.fileNo}</span><br />
                <span className='fs-12'></span><br />
                <span className='fs-12'></span><br />
                <span className='fs-12 mt-6'></span><br />
                <span className='fs-12'></span>
         
            </div>
        </div>
      </Col>

      <Col md="6" style={{ borderRight: border, borderBottom: border }}>
            <div className='d-flex justify-content-start'>
                <div className='text-start'>
                    <span className='fs-11 pe-3 fw-bold'>Job # :</span><br />
                    <span className='fs-11 pe-3 fw-bold'>Shipment From #:</span><br />
                    <span className='fs-11 pe-3 fw-bold'>Terminal:</span><br />
                    <span className='fs-11 pe-3 fw-bold'>S/Line :</span><br />
                    <span className='fs-11 pe-3 fw-bold'>Sailing Date :</span><br />
                </div>

                <div className='text-start'>
                    <span className='fs-12'>{invoice.SE_Job.jobNo ? invoice.SE_Job.jobNo : ""}</span><br />
                    <span className='fs-12'>{invoice?.SE_Job?.pol} </span><br/>
                    <span className='fs-12'>{invoice?.SE_Job?.terminal}</span><br />
                    <span className='fs-12'>{invoice?.SE_Job?.shipping_line?.name}</span><br/>
                    <span className='fs-12'>{moment(invoice?.SE_Job?.shipDate).format("DD-MM-YYYY")}</span>
                </div>
            </div>
      </Col>
      </Row>
      <Row>
        <Col>
            <Table bordered variant='white' size='sm' style={{ borderLeft: border, borderRight: border, borderBottom: border }}>
                <thead className='fs-10 text-center' style={{ borderBottom: border }}>
                    <th style={{ borderRight: border }}>SNO</th>
                    <th style={{ borderRight: border }}>PARTICULARS</th>
                    <th style={{ borderRight: border }}>REMARKS/DESCRIPTION</th>
                    <th style={{ borderRight: border }}>PAID BY U</th>
                    <th style={{ borderRight: border }}>PAID BY US</th>
                    <th>TOTALS</th>
                </thead>
                <tbody>
                    {records.filter((x)=> { return x.charge!='57' }).map((x, i) => {
                        console.log("x",x)
                        return (
                            <>
                                <tr key={x.id} className='fs-10' style={{ lineHeight: 1 }}>
                                    <td className='fs-12 text-start' >{i + 1}</td>
                                    <td className='fs-12 text-start'>{x.particular}</td>
                                    <td className='fs-12 text-start'></td>
                                    <td className='fs-12 text-end'>0.00</td>
                                    <td className='fs-12 text-end'>{x.net_amount}</td>
                                </tr>
                            </>
                        )
                    })}
                    <tr className='fs-12 text-start'>
                        <td colSpan={"4"}>
                            <span className='pe-3 fw-bold'>
                               Amount in words (Rupees) :
                            </span>
                            <span className='fs-12'>
                                {inWords(sum)} 
                            </span>
                        </td>
                        <td className='text-start'>
                            <span className='fw-bold'>Total Expense</span> <br />
                            <span className='fw-bold'>Service Charges</span> <br />
                            <span className='fw-bold'>Sales Tax 13%</span> <br />
                            <span className='fw-bold'>Balance Invoice</span> <br />
                            <span className='fw-bold'>Advnace Recieved</span> <br />
                            <span className='fw-bold'>Net Balance</span> <br />
                        </td>
                        <td className='text-end'>
                            <span className='fs-12'>{commas(values.total)}</span> <br />
                            <span className='fs-12'>{commas(values.serviceCharges)}</span> <br />
                            <span className='fs-12'>{commas(values.taxPercent)}</span> <br />
                            <span className='fs-12'></span>{commas(sum)} <br />
                            <span className='fs-12'>0.00</span> <br />
                            <span className='fs-12'>{commas(sum)}</span> <br />
                        </td>
                    </tr>
                </tbody>
            </Table>
        </Col>
      </Row>
      <Row className='mt-6'>
        <Col md="8">
            <span className='fw-bold fs-10'>
                Disclaimer :
            </span>
        </Col>
        <Col md="4" className='text-end'>
            <span className='fs-10 pe-3 fw-bold'>For :</span>
            <span className='fs-10 fw-bold'>CARGO LINKERS</span>
        </Col>
      </Row>

    </div>
    )
}

export default CLPrint