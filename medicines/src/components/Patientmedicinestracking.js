import React from "react";
import { useState, useRef, useEffect } from "react";
import ReactPaginate from 'react-paginate';
//THIS COMPONENT FOR ADMIN TO TRACK PATIENCE TAKING PILLS OR NOT 
export default function Patientmedicinestracking(props) {

    var itemsPerPage = 5;
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const daterangelist = props.daterange.map((dateele, index) => (<th scope="col" key={index}>{dateele.slice(5, 10)}</th>));
    console.log('daterangelist');
    console.log(props.daterange);
    //const drugtakingtimelist = props.drugtakingtime.map((dtt, index) => (<tr key={dtt['pk']}>{returndrugtime(dtt, index)}</tr>));

    //const consultationList = props.consultation1.map((consultation) => (<Consultationhistory key={consultation['pk']} id={consultation['pk']} date={consultation['fields']['consultationdate']} symptom={consultation['fields']['symptom']} showprofiledetail={showprofiledetail} />));
    const consultationList = props.consultation1.map((consultation, index) => (<tr onClick={(e) => redirectprofile(e, props.patientname[index])} key={consultation['pk']}><td>{consultation['pk']}</td><td>{consultation['fields']['consultationdate'].slice(0, 10)}</td><td>{props.patientname[index]}</td><td>{consultation['fields']['symptom']}</td>{returndrugtime(consultation['pk'], consultation['fields']['consultationdate'])}</tr>));

    //TO GENERATE SOME SQUARE BOX INDICATOR SHOWING PATIENCE ALREADY TAKE DRUGS OR NOT 
    function returndrugtime(consultationpk, consultationdate) {
        //console.log(consultationpk);
        const drugtakingtimelist = props.drugtakingtime.map((dtt, index) => {
            if (dtt['fields']['consultationid'] == consultationpk) {
                if (dtt['fields']['patienttakingtime'] === null) {
                    // console.log(index);
                    // console.log(props.daterange[index]);
                    // console.log(consultationdate);
                    // // console.log(typeof (props.daterange[index]));
                    // // console.log(typeof (consultationdate));
                    // console.log(dtt);
                    // const dr = new Date(props.daterange[index]);
                    // const cd = new Date(consultationdate);
                    // //console.log(dr);
                    // //console.log(cd);
                    // //if (props.daterange[index] < consultationdate) {
                    // if (dr.getDate() >= cd.getDate()) {
                    //     //MISSING A CONDITION TO SHOW IF PATIENTTAKINGTIME IS BEFORE THE CONSULTION DATE, NO NEED TO GENERATE ANY SQUARE BOX
                    //     return (<td key={index}><i className="bi bi-x-square" style={{ fontSize: '2rem' }}></i></td>);
                    // }
                    // else {
                    //     return (<td key={index}><i className="bi bi-square" style={{ fontSize: '2rem' }}></i></td>);
                    // }
                    //MISSING A CONDITION TO SHOW IF PATIENTTAKINGTIME IS BEFORE THE CONSULTION DATE, NO NEED TO GENERATE ANY SQUARE BOX
                    return (<td key={index}><i className="bi bi-x-square" style={{ fontSize: '2rem' }}></i></td>);
                }
                else {
                    return (<td key={index}><i className="bi bi-check-square-fill" style={{ fontSize: '2rem' }}></i></td>);
                }
            }
        });
        //console.log('drugtakingtimelist');
        //console.log(drugtakingtimelist);
        //console.log(drugtakingtimelist[0]);
        //GET THE DATE LIST AND LIMITED TO THREE DAYS SHOWING BY REMOVING UNDEFINED FIELDS
        var drugtimelisttmp = [];
        for (let i = 0; i < drugtakingtimelist.length; i++) {
            if (drugtakingtimelist[i] != undefined) {
                drugtimelisttmp.push(drugtakingtimelist[i]);
                console.log(drugtimelisttmp);
            }
        }
        //GET THE LAST 3 DAYS OF TAKING DRUGS EVEN PERIOD IS 4 OR MORE DAYS
        var drugtimelist = drugtimelisttmp.slice(drugtimelisttmp.length - 3);
        return drugtimelist;
    }

    // function returnpatientname(i) {
    //     //const patientList = props.patientname.map((p) => (p[i]));
    //     const patientList = props.patientname[i];
    //     console.log(patientList);
    //     return (patientList);
    // }

    //THIS FUNCTION FOR ADMIN TO CLICK THE ROW TO REDIRECT TO PATIENT PROFILE
    function redirectprofile(event, name) {
        event.preventDefault();
        location.href = "/profile/" + name;
    }

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
        const endOffset = itemOffset + itemsPerPage;
        //console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        setCurrentItems(consultationList.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(consultationList.length / itemsPerPage));
        //console.log(pageCount);
    }, [itemOffset, itemsPerPage, props.consultationupdate]);
    return (
        <>
            <div className="col-12 justify-content-center">
                <h3>Patient Medicines Tracking</h3>
            </div>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">Consultation Date</th>
                        <th scope="col">Patient</th>
                        <th scope="col">Symptom</th>
                        {daterangelist}
                    </tr>
                </thead>
                <tbody>
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
        </>
    )
}