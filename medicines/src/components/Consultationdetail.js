import React from "react";
import { useState, useRef, useEffect } from "react";
import Drugdetail from "./Drugdetail";

//SHOWING THE CONSULTATION DETAIL
export default function Consultationdetail(props) {
    //const drugList = props.drug.map((p) => (<tr key={p['pk']} onClick={(e)=>showdrugdetail(e,p['fields']['drug'])}><td>{p['fields']['drug']}</td><td>{p['fields']['drugqty']}</td></tr>));
    //console.log(props.drug);
    //const [patienTime1, setPatientTime1] = useState([]);
    const [drugUrlUsage, setDrugUrlUsage] = useState("");
    const [drugDetailVisible, setDrugDetailVisible] = useState('hidden');
    //const [drugUsage, setDrugUsage] = useState("");
    const drugList = props.drug.map((d) => (d['fields']['drugname']));
    //console.log(drugList);
    function checkdateistoday(datetocheckinstring) {
        let today = new Date();
        let datetocheck = new Date(datetocheckinstring);
        if (today.getFullYear() == datetocheck.getFullYear() &&
            today.getMonth() == datetocheck.getMonth() &&
            today.getDate() == datetocheck.getDate()) {
            return true;
        }
        else {
            return false;
        }
    }
    function checkdateistmr(datetocheckinstring) {
        let today = new Date();
        let datetocheck = new Date(datetocheckinstring);
        // if (today.getFullYear() == datetocheck.getFullYear() &&
        //     today.getMonth() == datetocheck.getMonth() &&
        //     today.getDate() < datetocheck.getDate()) {

        //     return true;
        // }
        // else {
        //     return false;
        // }
        //console.log(datetocheck);
        //console.log(today);
        if (datetocheck > today) {
            //console.log('true');
            return true;
        }
        else {
            //console.log('false');
            return false;
        }
    }
    //RETURN DRUGNAME PROVIDING THE DRUG ID
    function drugname1(i) {
        const drugList = props.drug.map((d) => (d['fields']['drugname']));
        //console.log(drugList[i]);
        return (drugList[i]);
    }
    function patienttaking(id, drugtimevalue, patienttimevalue) {
        //console.log(drugtimevalue);
        //console.log(patienttimevalue);
        //console.log(typeof (drugtimevalue));
        if (patienttimevalue === null) {
            if (checkdateistoday(drugtimevalue)) {
                if (window.location.pathname != "/") {
                    return (<i className="bi bi-square" style={{ fontSize: '2rem' }}></i>);
                }
                else {
                    return (<button className="btn btn-lg btn-primary drugtakingtimebtn></button" onClick={(e) => toggledrugtakingtime(e, id, drugtimevalue)}>{drugtimevalue.slice(0, 10)}</button>);
                }
            }
            else {
                if (checkdateistmr(drugtimevalue)) {
                    return (<i className="bi bi-square" style={{ fontSize: '2rem' }}></i>);
                }
                else {
                    //console.log('x-square');
                    //return ("");
                    return (<i className="bi bi-x-square" style={{ fontSize: '2rem' }}></i>);
                }
            }
        }
        else {
            //timebtn.setAttribute('disabled', "");
            //timebtn.innerHTML = drugtakingtime[i]['fields']['patienttakingtime'];
            return (<><i className="bi bi-check-square-fill" style={{ fontSize: '2rem' }}>{patienttimevalue.slice(11, 16)}</i></>);
        }
    }
    //FOR PATIENT TO TOGGLE DRUG TAKING TIME
    function toggledrugtakingtime(event, id, drugtimevalue) {
        event.preventDefault();
        const toggledate = drugtimevalue;
        const dateid = id;
        fetch('/toggledrugtakingtime',
            {
                method: 'POST',
                body: JSON.stringify({
                    dateid: dateid,
                    toggledate: toggledate
                })
            })
            .then(response => response.json())
            .then(msg => {
                console.log(msg);
                props.showprofiledetail(props.consultationupdate);
            })
    }

    const precriptionList = props.precription.map((p, index, array) => (<tr key={p['pk']} onClick={(e) => showdrugdetail(e, drugname1(index))}><td>{drugname1(index)}</td><td>{p['fields']['drugqty']}</td></tr>));
    const drugtakingtimeList = props.drugtakingtime.map((d) => (<tr key={d['pk']}><td>{d['fields']['drugtakingdate'].slice(0, 10)}</td><td>{patienttaking(d['pk'], d['fields']['drugtakingdate'], d['fields']['patienttakingtime'])}</td></tr>));
    const consultationdate = props.consultation.map((c) => (c['fields']['consultationdate'].slice(0, 10)));
    const consultationsymptom = props.consultation.map((c) => (c['fields']['symptom']));
    const consultationtreatment = props.consultation.map((c) => (c['fields']['treatment']));
    //const consultationList = props.consultation1.map((consultation) => (<tr onClick={(e) => handleClick(e, consultation['pk'])} key={consultation['pk']}><td>{consultation['pk']}</td><td>{consultation['fields']['consultationdate'].slice(0, 10)}</td><td>{consultation['fields']['symptom']}</td></tr>));

    //SHOWING DRUG DETAIL URL AND USAGE
    function showdrugdetail(event, drugname) {
        event.preventDefault();

        fetch('/showdrugdetail', {
            method: 'POST',
            body: JSON.stringify({
                drugname: drugname,
            })
        }).then(response => response.json())
            .then(drugs => {
                setDrugUrlUsage(drugs);
                //console.log(drugs);
            });
        setDrugDetailVisible('visible');
    }

    return (
        <div className="row align-items-center" style={{ visibility: props.detailvisible }} id="consultationdetail">
            {/* <div className="row align-items-center" id="consultationdetail"> */}

            <label htmlFor="consultdate" className="col-sm-4 col-form-label">Date</label>
            <div className="col-sm-8">
                <input type="text" readOnly className="form-control-plaintext" id="consultdate" value={consultationdate} />
            </div>


            <label htmlFor="consultsymptom" className="col-sm-4 col-form-label">Symptom</label>
            <div className="col-sm-8">
                <input type="text" readOnly className="form-control-plaintext" id="consultsymptom" value={consultationsymptom} />
            </div>


            <label htmlFor="consulttreatment" className="col-sm-4 col-form-label">Treatment</label>
            <div className="col-sm-8">
                <input type="text" readOnly className="form-control-plaintext" id="consulttreatment"
                    value={consultationtreatment} />
            </div>

            <div className="list-group">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Drug</th>
                            <th scope="col">Quantity</th>
                        </tr>
                    </thead>
                    <tbody id="druglist">
                        {precriptionList}
                    </tbody>
                </table>
            </div>
            <div className="list-group">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Drug Taking Date</th>
                            <th scope="col">Patient Taking?</th>
                        </tr>
                    </thead>
                    <tbody id="drugtakingtimebtngroup">
                        {drugtakingtimeList}
                    </tbody>
                </table>
            </div>
            <Drugdetail drugurlusage={drugUrlUsage} drugdetailvisible={drugDetailVisible} detailswitch={1} />
        </div>
    )
}