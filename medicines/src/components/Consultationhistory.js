import React from "react";
import { useState, useRef, useEffect } from "react";
import ReactPaginate from 'react-paginate';
import Consultationdetail from "./Consultationdetail";

//THIS COMPONENT SHOW EACH ROW RECORD OF CONSULTATION
export default function Consultationhistory(props) {
    //const [consultationList, setConsultationList] = useState([]);
    const [consultation1, setConsultation1] = useState([]);
    const [precription1, setPrecription1] = useState([]);
    const [drugtakingtime1, setDrugtakingtime1] = useState([]);
    const [drug1, setDrug1] = useState([]);
    //const [patienTime, setPatientTime] = useState('');
    const [detailVisible, setDetailVisible] = useState('hidden');
    //const [drugDetailVisible, setDrugDetailVisible] = useState("hidden")
    const [consultationUpdate, setConsultationUpdate] = useState(0);

    var itemsPerPage = 5;
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    //const consultationList = props.consultation1.map((consultation) => (<Consultationhistory key={consultation['pk']} id={consultation['pk']} date={consultation['fields']['consultationdate']} symptom={consultation['fields']['symptom']} showprofiledetail={showprofiledetail} />));
    const consultationList = props.consultation1.map((consultation) => (<tr data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip on top" onClick={(e) => handleClick(e, consultation['pk'])} key={consultation['pk']}><td>{consultation['pk']}</td><td>{consultation['fields']['consultationdate'].slice(0, 10)}</td><td>{consultation['fields']['symptom']}</td></tr>));


    function handleClick(e, currentid) {
        e.preventDefault();
        showprofiledetail(currentid);

    }

    function showprofiledetail(currentid) {
        //event.preventDefault();
        //const consultationid = event.currentTarget.id;
        const consultationid = currentid;
        //console.log(consultationid);
        //alert(currentid);

        fetch('/showprofiledetail/' + consultationid,
            { method: 'GET', })
            .then(response => response.json())
            .then(datas => {
                //datas.forEach((data) => {
                const consultation = JSON.parse(datas[0]);
                const precription = JSON.parse(datas[1]);
                const drugtakingtime = JSON.parse(datas[2]);
                const drug = JSON.parse(datas[3]);
                //console.log(precription);
                //console.log(consultation[0]['fields']['symptom']);
                //console.log(drug);
                //console.log(consultation);
                //console.log(drugtakingtime);

                setConsultation1(consultation);
                setPrecription1(precription);
                setDrugtakingtime1(drugtakingtime);
                setDrug1(drug);

            })
        setConsultationUpdate(currentid);
        setDetailVisible('visible');
        // if (drugDetailVisible == 'visible') {
        //     setDrugDetailVisible('hidden');
        // }
        // else {
        //     setDrugDetailVisible('visible');
        // }

    }
    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        //var itemsPerPage = 10;
        const newOffset = (event.selected * itemsPerPage) % consultationList.length;
        // console.log(
        //     `User requested page number ${event.selected}, which is offset ${newOffset}`
        // );
        setItemOffset(newOffset);
    };
    //////////////////////////////////////////////////////
    useEffect(() => {
        // Fetch items from another resources.
        const endOffset = itemOffset + itemsPerPage;
        //console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        setCurrentItems(consultationList.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(consultationList.length / itemsPerPage));
        //console.log(pageCount);
    }, [itemOffset, itemsPerPage, props.consultationupdate]);

    return (
        <>
            <h3>Consultation History</h3>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">Date</th>
                        <th scope="col">Symptom</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {consultationList} */}
                    {currentItems}
                </tbody>
            </table>
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
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
            <Consultationdetail consultation={consultation1} precription={precription1} drugtakingtime={drugtakingtime1} drug={drug1} showprofiledetail={showprofiledetail} consultationupdate={consultationUpdate} detailvisible={detailVisible} />
        </>
    )

}