import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import InputNumComp from "/Components/Shared/Form/InputNumComp";
import SelectComp from "/Components/Shared/Form/SelectComp";
import InputComp from "/Components/Shared/Form/InputComp";
import { InputNumber } from "antd";
import { getStatus } from './states';

const Weights = ({register, control, type, approved, equipments, useWatch}) => {
    
    const allValues = useWatch({control})

    function getWeight(){
        let weight = 0.0, teu = 0, qty = 0;
        equipments.forEach((x) => {
          if(x.gross!=''&&x.teu!=''){
            weight = weight + parseFloat(
                x.gross//.replace(/,/g, '')
                );
            teu = teu + parseInt(x.teu);
            qty = qty + parseInt(x.qty);
          }
        });
        return {weight, teu, qty}
      }

    return(
    <Row style={{border:'1px solid silver', paddingBottom:15, margin:0}}>
        <Col md={6} className='mt-2'>
        <InputNumComp register={register} name='weight' control={control} width={"100%"} label='Gross Weight' step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='bkg' control={control} width={"100%"} label='Net Weight' step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        <Col md={12} className='py-1'>
          <SelectComp register={register} name='incoTerms' control={control} label='Inco Terms' width={"100%"} disabled={getStatus(approved)}
            options={[
              { id: 'EXW', name: 'EXW' },
              { id: 'FCP', name: 'FCP' },
              { id: 'FAS', name: 'FAS' },
              { id: 'FOB', name: 'FOB' },
              { id: 'CFR', name: 'CFR' },
              { id: 'CIF', name: 'CIF' },
              { id: 'CIP', name: 'CIP' },
              { id: 'CPT', name: 'CPT' },
              { id: 'DAP', name: 'DAP' },
              { id: 'DPU', name: 'DPU' },
              { id: 'DDP', name: 'DDP' },
              { id: 'CNI', name: 'CNI' },
              { id: 'DTP', name: 'DTP' },
              { id: 'DPP', name: 'DPP' },
              { id: 'DAT', name: 'DAT' },
              { id: 'DDU', name: 'DDU' },
              { id: 'DES', name: 'DES' },
              { id: 'DEQ', name: 'DEQ' },
              { id: 'DAF', name: 'DAF' },
              { id: 'CNF', name: 'CNF' },
            ]} />
        </Col>
        <Col md={4} className='mt-2'>
            <InputNumComp register={register} name='pcs' control={control}  label='PCS' width={"100%"} disabled={getStatus(approved)} />
        </Col>
        <Col md={8} className='mt-2'>
            <SelectComp register={register} name='pkgUnit' control={control} label='.' width={"100%"} disabled={getStatus(approved)}
            options={[  
            {"id":"BAGS"   , "name":"BAGS"},
            {"id":"BALES"  , "name":"BALES"},
            {"id":"BARRELS", "name":"BARRELS"},
            {"id":"CARTONS", "name":"CARTONS"},
            {"id":"BLOCKS" , "name":"BLOCKS"},
            {"id":"BOATS"  , "name":"BOATS"}
            ]} />
        </Col>

     
    </Row>
    )
}
export default React.memo(Weights)