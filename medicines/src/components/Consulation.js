import React from "react";
import { useState, useRef, useEffect, useReducer } from "react";
import Drugdetail from './Drugdetail';

//FOR CONSULTATION COMPONENT
export default function Consultation(props) {
    const [drugname, setDrugname] = useState('');
    const [drugUrlUsage, setDrugUrlUsage] = useState("");
    const [drugDetailVisible, setDrugDetailVisible] = useState('hidden');

    //CREATE THE SELECT DIALGOUE BOX OF DRUGLIST
    const drugslist = props.druglist.map((d, index, array) => (<option key={index} value={d}>{d}</option>));

    //USE REDUCER TO SUBMIT THE FORM CONSULTATION
    const initialdruglistcontent = { patient: window.location.pathname.slice(9), symptom: '', treatment: '', drugname: [], drugqty: [], period: '' };
    const [druglistcontent, updateDruglistcontent] = useReducer((druglistcontent, updateDruglistcontent) => ({ ...druglistcontent, ...updateDruglistcontent }), initialdruglistcontent);

    const [adddrugcontent, setAddDrugContent] = useState([]);

    //MAKE A NEW LIST AND PUSH TO adddrugcontent ARRAY
    function adddrug() {
        const newdrug = { id: "drug-" + adddrugcontent.length, value: "", drugurlusage: { 'drugusage': "", 'drugurl': "" } };
        setAddDrugContent([...adddrugcontent, newdrug]);
    }
    // FOR THE adddrugcontent ARRAY, NEEDED TO MAKE A LIST COMPONENT OF SELECT BOX AND DRUGTAIL
    const drugcontentList = adddrugcontent.map((d, index) => (
        <div key={d.id}>
            <select className="form-select admin-drug-select" onChange={(e) => { handleSelect(e, d.id) }} aria-label="Drug select"
                id={"select" + d.id} name="drugname" value={d.value}>
                <option value="Please select drugs">Please select drugs</option>
                {drugslist}
            </select>
            <Drugdetail id={d.id} drugurlusage={d.drugurlusage} handlechange={handleChange} drugdetailvisible={drugDetailVisible} />
        </div>
    ));
    //SELECT BOX HAS TWO FUNCTION EVENT AND WE CREAT A FUNCTION
    function handleSelect(e, id) {
        showdrugdetail(e, id);
        handleChange(e, "select" + id);
        //alert(id);
    }

    function showdrugdetail(event, id) {
        const drugname1 = event.target.value;
        setDrugname(drugname1);
        fetch('/showdrugdetail', {
            method: 'POST',
            body: JSON.stringify({
                drugname: drugname1,
            })
        }).then(response => response.json())
            .then(drugs => {
                setDrugUrlUsage(drugs);
                //FOR THE SELECT BOX ARRAY LIST, CHECK EACH ELEMENT AND IF THE ELEMENT ID IS SAME
                // THEN CHANGE THE CONTENT INSIDE
                const updateddruglist = adddrugcontent.map(drug => {
                    if (drug.id === id) {
                        return { ...drug, value: drugname1, drugurlusage: drugs }
                    }
                    return drug;
                });
                //AFTER CHANGING THE CONTENT, UPDATE THE LIST
                setAddDrugContent(updateddruglist);
            });
    }

    // const [consultationChange, setConsulationChange] = useState('');
    // const [symptom, setSymptom] = useState('');
    // const [treatment, setTreatment] = useState('');
    // const [drugqty, setDrugqty] = useState('');
    // const [period, setPeriod] = useState('');
    function handleChange(e, targetid) {
        //const targetid = e.target.id;
        const targetvalue = e.target.value;
        //{'body': '{"patient":[],"symptom":"","treatment":"","drugname":[],"drugqty":[],"period":""}'}
        // switch (targetid) {
        //     case 'symptom':
        //         //updateBodyindexcontent({ weight: targetvalue });
        //         updateDruglistcontent({ symptom: targetvalue });
        //     //setSymptom(targetvalue);
        //     case 'treatment':
        //         updateDruglistcontent({ treatment: targetvalue });
        //     //setTreatment(targetvalue);
        //     case 'drugname':
        //         console.log(druglistcontent.drugname);
        //         var drugnamelist = druglistcontent.drugname;
        //         //drugnamelist[targetid] = targetvalue;
        //         updateDruglistcontent({ drugname: drugnamelist });
        //     //setDrugname(targetvalue);
        //     case 'drugqty':
        //         console.log(druglistcontent.drugqty);
        //         var drugqtylist = druglistcontent.drugqty;
        //         //drugqtylist[targetid] = targetvalue;
        //         //alert(drugqtylist[targetid]);
        //         updateDruglistcontent({ drugqty: drugqtylist });
        //     //setDrugname(targetvalue);
        //     case 'period':
        //         updateDruglistcontent({ period: targetvalue });
        //     //setPeriod(targetvalue);
        var regex1 = /symptom/,
            regex2 = /treatment/,
            regex3 = /\bselect/,
            regex4 = /\bqty/,
            regex5 = /period/;

        switch (true) {
            case regex1.test(targetid):
                updateDruglistcontent({ symptom: targetvalue });
                break;
            case regex2.test(targetid):
                updateDruglistcontent({ treatment: targetvalue });
                break;
            case regex3.test(targetid):

                var drugnamelist = druglistcontent.drugname;
                var i = targetid.slice(11);
                drugnamelist[i] = targetvalue;
                updateDruglistcontent({ drugname: drugnamelist });
                break;
            case regex4.test(targetid):

                var drugqtylist = druglistcontent.drugqty;
                var i = targetid.slice(8);
                drugqtylist[i] = targetvalue;
                updateDruglistcontent({ drugqty: drugqtylist });
                break;
            case regex5.test(targetid):
                updateDruglistcontent({ period: targetvalue });
                break;
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        fetch('/consultation', {
            method: 'POST',
            body: JSON.stringify(
                // patientusername: props.name,
                // symptom: symptom,
                // treatment: treatment,
                // drugname: drugname,
                // drugqty: drugqty,
                // period: period,
                druglistcontent
            )
        }).then(response => response.json())
            .then(result => {
                console.log(result);
                document.getElementById('symptom').value = "";
                document.getElementById('treatment').value = "";

            });
        props.consultationupdate(druglistcontent);
        //EMPTY THE adddrugcontent array after save
        setAddDrugContent([]);
        document.getElementById('period').value = "";
    }

    return (
        <div className="row align-items-center">
            <div className="col-12">
                <form onSubmit={handleSubmit}>
                    <div>
                        <h2>Consultation</h2>
                    </div>
                    <br />
                    {/* <input type="hidden" id="patientusername" name="patientusername">{props.name}</input> */}
                    <div className="form-group">
                        <input className="form-control" onChange={(e) => { handleChange(e, "symptom") }} type="text" id="symptom" name='symptom' placeholder="Symptom" />
                    </div>
                    <br />
                    <div className="form-group">
                        <input className="form-control" onChange={(e) => { handleChange(e, "treatment") }} type="text" id="treatment" name="treatment" placeholder="Treatment" />
                    </div>
                    <br />
                    <div className="form-group presciptiondrug1" >
                        {drugcontentList}
                    </div>
                    <div className="text-center">
                        <input type="button" onClick={adddrug} className="btn btn-primary text-center" value="Add Drug" id="adddrug" />
                    </div>
                    <br />

                    <div className="form-group">
                        <input className="form-control" onChange={(e) => { handleChange(e, "period") }} type="number" id="period" name="period"
                            placeholder="Drug Period (Please enter number of days)" min="1" max="7" />
                    </div>
                    <div className="text-center">
                        <input className="btn btn-primary text-center" type="submit" value="Save" />
                    </div>
                    <br />
                </form>
            </div>
        </div>
    )

}
