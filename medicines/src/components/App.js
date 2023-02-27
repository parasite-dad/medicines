import Consultationhistory from "./Consultationhistory";
import Bodyindexhistory from "./Bodyindexhistory";
import Consultationdetail from "./Consultationdetail";
import Bodyindex from "./Bodyindex";
import React from "react";
import { useState, useRef, useEffect } from "react";
import ReactPaginate from 'react-paginate';
import Drugdetail from "./Drugdetail";
import Patientmedicinestracking from "./Patientmedicinestracking";
import Adminbodyindexhistory from "./Adminbodyindexhistory";
import Consultation from "./Consulation";
//MAIN CONTROL FLOW SETTING ALL STATE AND OUTLINE OF THE INDEX PAGE
export default function App(props) {

    const [consultationList, setConsultationList] = useState([]);
    const [consultationUpdate, setConsultationUpdate] = useState('');
    const [bodyindexList, setBodyindexList] = useState([]);
    const [bodyindexUpdate, setBodyindexUpdate] = useState({});
    const [modalReminder, setmodalReminder] = useState("");
    const [patientName, setPatientName] = useState([]);
    const [patientGender, setPatientGender] = useState('');
    const [patientAge, setPatientAge] = useState('');
    const [dateRange, setDateRange] = useState([]);
    const [drugTakingTime, setDrugTakingTime] = useState([]);
    const [drugList, setDrugList] = useState([]);

    //https://www.npmjs.com/package/react-paginate
    var itemsPerPage = 5;
    const [bodyindexcurrentItems, setBodyindexcurrentItems] = useState(null);
    const [bodyindexpageCount, setBodyindexpageCount] = useState(0);
    const [bodyindexitemOffset, setBodyindexitemOffset] = useState(0);
    // if (username == "admin") {
    //     if (window.location.pathname != "/") {
    //         //document.querySelector('.admin-drug-select').onchange = showdrugdetail;
    //         //document.querySelector('#adddrug').onclick = adddrug;

    //         //alert(window.location.pathname);
    //     }
    //     ////document.querySelector('#patientname').onchange = showprofile;
    //     ////document.querySelector('#patientname').onchange = changeformaction;
    // }
    // else {
    //     //document.querySelector('.drug-select').onclick = showdrugdetail;
    //     //document.querySelector('.drugtakingtimebtn').onclick = toggledrugtakingtime;
    //     //document.querySelector('#exampleModal1').modal('show');
    //     if (document.querySelector('#modalreminder').value != "") {
    //         let myModal = new bootstrap.Modal(document.getElementById('reminderModal'), {});
    //         myModal.show();
    //     }
    // }

    function bodyindexupdate(content) {
        setBodyindexUpdate(content);
    }
    function consultationupdate(content) {
        setConsultationUpdate(content);
    }
    //CHECK THE USERNAME IS ADMIN OR PATIENT TO GENERATE DIFFERENT INDEX
    if (props.name != "admin") {
        useEffect(() => {
            fetch('/user_index')
                .then(response => response.json())
                .then(datas => {
                    const patient = JSON.parse(datas[0]);
                    const bodyindex1 = JSON.parse(datas[1]);
                    const consultation1 = JSON.parse(datas[2]);
                    //const precription = JSON.parse(datas[3]);
                    //const drugtakingtime = JSON.parse(datas[4]);
                    //console.log(consultation1);
                    setmodalReminder(datas[3]['modalreminder']);
                    //console.log(patient);
                    //console.log(bodyindex1);

                    setConsultationList(consultation1);
                    setConsultationUpdate(consultation1.length.toString());

                    const bodyindexList1 = bodyindex1.map((bodyindex) => (<Bodyindexhistory key={bodyindex['pk']} id={bodyindex['pk']} date={bodyindex['fields']['daterecord']} weight={bodyindex['fields']['bodyindex']['weight']} height={bodyindex['fields']['bodyindex']['height']} systolic={bodyindex['fields']['bodyindex']['Systolicblood']} diastolic={bodyindex['fields']['bodyindex']['Diastolicblood']} heartrate={bodyindex['fields']['bodyindex']['Heartrate']} sugarlevel={bodyindex['fields']['bodyindex']['sugar']} risklevel={bodyindex['fields']['bodyindex']['risklevel']} />));

                    setBodyindexList(bodyindexList1);
                    setBodyindexUpdate(bodyindexList.length.toString());

                });
        }, [consultationUpdate, bodyindexUpdate]);
    }
    else {
        if (window.location.pathname.slice(0, 9) == "/profile/") {
            useEffect(() => {
                //alert(window.location.pathname.slice(9));
                fetch('/showprofile/' + window.location.pathname.slice(9))
                    .then(response => response.json())
                    .then(datas => {
                        const patient = JSON.parse(datas[0]);
                        //const patient = datas[0]['patient'];

                        const bodyindex1 = JSON.parse(datas[1]);
                        const consultation1 = JSON.parse(datas[2]);
                        const drugs1 = datas[3]['drugs'];
                        const age1 = datas[4]['birthday'];
                        //const precription = JSON.parse(datas[3]);
                        //const drugtakingtime = JSON.parse(datas[4]);
                        //console.log(patient);
                        //console.log(bodyindex1);
                        //console.log(consultation1);
                        //console.log(drugs1);

                        setConsultationList(consultation1);
                        setConsultationUpdate(consultation1.length.toString());

                        const bodyindexList1 = bodyindex1.map((bodyindex) => (<Bodyindexhistory key={bodyindex['pk']} id={bodyindex['pk']} date={bodyindex['fields']['daterecord']} weight={bodyindex['fields']['bodyindex']['weight']} height={bodyindex['fields']['bodyindex']['height']} systolic={bodyindex['fields']['bodyindex']['Systolicblood']} diastolic={bodyindex['fields']['bodyindex']['Diastolicblood']} heartrate={bodyindex['fields']['bodyindex']['Heartrate']} sugarlevel={bodyindex['fields']['bodyindex']['sugar']} risklevel={bodyindex['fields']['bodyindex']['risklevel']} />));

                        setBodyindexList(bodyindexList1);
                        setBodyindexUpdate(bodyindexList.length.toString());
                        setDrugList(drugs1);
                        setPatientName(patient[0]['fields']['username']);
                        //setPatientName(window.location.pathname.slice(9));
                        setPatientGender(patient[0]['fields']['gender']);
                        setPatientAge(age1);
                    })
            }, [consultationUpdate, bodyindexUpdate]);
        }
        else {

            useEffect(() => {
                fetch('/admin_index')
                    .then(response => response.json())
                    .then(datas => {
                        const consultation1 = JSON.parse(datas[0]);
                        const bodyindex1 = JSON.parse(datas[1]);
                        const precription1 = JSON.parse(datas[2]);
                        const drugtakingtime1 = JSON.parse(datas[3]);
                        const daterange1 = datas[4]['daterange'];
                        const patientname1 = datas[5]['patientname'];

                        const bodyindexpatient1 = datas[6]['bodyindexpatient'];
                        // console.log(consultation1);
                        // console.log(bodyindex1);
                        // console.log(precription1);
                        // console.log(drugtakingtime1);
                        // console.log(daterange1);
                        // console.log(patientname1);
                        setConsultationList(consultation1);
                        setConsultationUpdate(consultation1.length.toString());
                        setPatientName(patientname1);
                        setDateRange(daterange1);
                        setDrugTakingTime(drugtakingtime1);
                        const bodyindexList1 = bodyindex1.map((bodyindex, index) => (<Adminbodyindexhistory key={bodyindex['pk']} id={bodyindex['pk']} date={bodyindex['fields']['daterecord']} weight={bodyindex['fields']['bodyindex']['weight']} height={bodyindex['fields']['bodyindex']['height']} systolic={bodyindex['fields']['bodyindex']['Systolicblood']} diastolic={bodyindex['fields']['bodyindex']['Diastolicblood']} heartrate={bodyindex['fields']['bodyindex']['Heartrate']} sugarlevel={bodyindex['fields']['bodyindex']['sugar']} risklevel={bodyindex['fields']['bodyindex']['risklevel']} name={bodyindexpatient1[index]} />));

                        setBodyindexList(bodyindexList1);
                        setBodyindexUpdate(bodyindexList.length.toString());
                    });
            }, [consultationUpdate, bodyindexUpdate]);

        }
    }
    //console.log(consultationList);
    //////////////////////////////////////////////////
    //https://www.npmjs.com/package/react-paginate
    useEffect(() => {
        // Fetch items from another resources.
        const endOffset = bodyindexitemOffset + itemsPerPage;
        //console.log(`Loading items from ${bodyindexitemOffset} to ${endOffset}`);
        setBodyindexcurrentItems(bodyindexList.slice(bodyindexitemOffset, endOffset));
        setBodyindexpageCount(Math.ceil(bodyindexList.length / itemsPerPage));
        //console.log(bodyindexpageCount);
    }, [bodyindexitemOffset, itemsPerPage, bodyindexUpdate]);
    // Invoke when user click to request another page.
    const bodyindexhandlePageClick = (event) => {
        //var itemsPerPage = 10;
        const newOffset = (event.selected * itemsPerPage) % bodyindexList.length;
        //console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
        setBodyindexitemOffset(newOffset);
    };
    //////////////////////////////////////////////////////
    // CHECK IF IT IS PATIENT LOGIN AND USE FRONTEND TO REMIND PATIENT TAKING PILLS
    if (props.name != "admin" && modalReminder != "") {
        let myModal = new bootstrap.Modal(document.getElementById('reminderModal'), {});
        myModal.show();
        //setmodalReminder("");
    }

    //GENERATE DIFFERENT INDEX FILE DEPENDS ON USER LOGIN, IT IS FOR PATIENT BELOW
    if (props.name != "admin") {
        return (
            <React.StrictMode>
                <>
                    {/* <input type="hidden" id="modalreminder" value={modalReminder}></input> */}
                    <div className="modal fade" id="reminderModal" tabIndex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="ModalLabel">Warm Reminder</h5>
                                    {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                                </div>
                                <div className="modal-body">
                                    <p>You have not take drug yesterday {modalReminder}! Please remember to take today!</p>
                                </div>
                                <div className="modal-footer">
                                    {/* <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button> */}
                                    {/* <button type="button" className="btn btn-primary">Save changes</button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-md text-center">
                        <div className="row align-items-top">
                            <div className="col bg-light">
                                <div className="row align-items-center">
                                    <div className="col-12">
                                        <Consultationhistory consultation1={consultationList} consultationupdate={consultationUpdate} />

                                    </div>
                                </div>
                            </div>
                            <div className="col bg-light">
                                <div className="row align-items-center">
                                    <div className="col-12">
                                        <h3>Body Index History</h3>
                                        <table className="table table-striped table-hover">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Date</th>
                                                    <th scope="col">Weight (kg)</th>
                                                    <th scope="col">Height (cm)</th>
                                                    <th scope="col">Systolic blood pressure</th>
                                                    <th scope="col">Diastolic blood pressure</th>
                                                    <th scope="col">Heart Beat Rate</th>
                                                    <th scope="col">Blood Sugar Level</th>
                                                    <th scope="col">Risk Level</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* {bodyindexList} */}
                                                {bodyindexcurrentItems}
                                            </tbody>
                                        </table>
                                        <ReactPaginate
                                            breakLabel="..."
                                            nextLabel="next >"
                                            onPageChange={bodyindexhandlePageClick}
                                            pageRangeDisplayed={5}
                                            pageCount={bodyindexpageCount}
                                            previousLabel="< previous"
                                            pageClassName="page-item"
                                            pageLinkClassName="page-link"
                                            previousClassName="page-item"
                                            previousLinkClassName="page-link"
                                            nextClassName="page-item"
                                            nextLinkClassName="page-link"
                                            breakClassName="page-item"
                                            breakLinkClassName="page-link"
                                            containerClassName="pagination"
                                            activeClassName="active"
                                        //renderOnZeroPageCount={null}
                                        />
                                    </div>
                                </div>
                                <Bodyindex name={props.name} bodyindexupdate={bodyindexupdate} />

                            </div>
                        </div>
                    </div>
                </>
            </React.StrictMode>
        )
    }
    //GENERATE DIFFERENT INDEX FILE DEPENDS ON USER LOGIN, IT IS FOR ADMIN BELOW
    else {

        if (window.location.pathname.slice(0, 9) == "/profile/") {
            return (
                <React.StrictMode>
                    <>
                        <div className="row g-3 justify-content-center">
                            <div className="col-auto">
                                <p className="fs-1">Patient:{patientName}</p>
                            </div>
                            <div className="col-auto">
                                <p className="fs-1">Gender:{patientGender}</p>
                            </div>
                            <div className="col-auto">
                                <p className="fs-1">Age:{patientAge}</p>
                            </div>
                        </div>
                        {/* <input type="hidden" id="modalreminder" value={modalReminder}></input> */}
                        <div className="container-md text-center">
                            <div className="row align-items-top">
                                <div className="col bg-light">
                                    <div className="row align-items-center">
                                        <div className="col-12">
                                            <Consultationhistory consultation1={consultationList} consultationupdate={consultationUpdate} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col bg-light">
                                    <div className="row align-items-center">
                                        <div className="col-12">
                                            <h3>Body Index History</h3>
                                            <table className="table table-striped table-hover">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Date</th>
                                                        <th scope="col">Weight (kg)</th>
                                                        <th scope="col">Height (cm)</th>
                                                        <th scope="col">Systolic blood pressure</th>
                                                        <th scope="col">Diastolic blood pressure</th>
                                                        <th scope="col">Heart Beat Rate</th>
                                                        <th scope="col">Blood Sugar Level</th>
                                                        <th scope="col">Risk Level</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* {bodyindexList} */}
                                                    {bodyindexcurrentItems}
                                                </tbody>
                                            </table>
                                            <ReactPaginate
                                                breakLabel="..."
                                                nextLabel="next >"
                                                onPageChange={bodyindexhandlePageClick}
                                                pageRangeDisplayed={5}
                                                pageCount={bodyindexpageCount}
                                                previousLabel="< previous"
                                                pageClassName="page-item"
                                                pageLinkClassName="page-link"
                                                previousClassName="page-item"
                                                previousLinkClassName="page-link"
                                                nextClassName="page-item"
                                                nextLinkClassName="page-link"
                                                breakClassName="page-item"
                                                breakLinkClassName="page-link"
                                                containerClassName="pagination"
                                                activeClassName="active"
                                            //renderOnZeroPageCount={null}
                                            />
                                        </div>
                                    </div>
                                    <Consultation name={patientName} consultation1={consultationList} bodyindexlist={bodyindexList} druglist={drugList} consultationupdate={consultationupdate} />

                                </div>
                            </div>
                        </div>
                    </>
                </React.StrictMode>
            )
        }
        else {
            return (
                <React.StrictMode>

                    <div className="container-md text-center">
                        <div className="row align-items-top">
                            <div className="col bg-light">
                                <Patientmedicinestracking consultation1={consultationList} consultationupdate={consultationUpdate} patientname={patientName} daterange={dateRange} drugtakingtime={drugTakingTime} />
                            </div>
                            <div className="col bg-light">
                                <div className="col-12">
                                    <h3>Patient Body Index Tracking</h3>
                                </div>
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Date</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Weight(kg)</th>
                                            <th scope="col">Height(cm)</th>
                                            <th scope="col">Systolic blood pressure</th>
                                            <th scope="col">Diastolic blood pressure</th>
                                            <th scope="col">Heart Beat Rate</th>
                                            <th scope="col">Blood Sugar Level</th>
                                            <th scope="col">Risk Level</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bodyindexcurrentItems}
                                    </tbody>
                                </table>
                                <ReactPaginate
                                    breakLabel="..."
                                    nextLabel="next >"
                                    onPageChange={bodyindexhandlePageClick}
                                    pageRangeDisplayed={5}
                                    pageCount={bodyindexpageCount}
                                    previousLabel="< previous"
                                    pageClassName="page-item"
                                    pageLinkClassName="page-link"
                                    previousClassName="page-item"
                                    previousLinkClassName="page-link"
                                    nextClassName="page-item"
                                    nextLinkClassName="page-link"
                                    breakClassName="page-item"
                                    breakLinkClassName="page-link"
                                    containerClassName="pagination"
                                    activeClassName="active"
                                //renderOnZeroPageCount={null}
                                />
                            </div>
                        </div>
                    </div >
                </React.StrictMode >


            )
        }
    }
}