import React from "react";

//FOR GENERATING DRUG DETAIL URL AND USAGE
export default function Drugdetail(props) {
    //FOR ADMIN TO SEE PATIENT PROFILE/PATIENTNAME
    if (window.location.pathname != "/") {
        //FOR ADMIN CONSULTATION HISTORY DONT SHOWING THE INPUR FIELD
        if (props.detailswitch == 1) {
            return (
                <>
                    <a className='form-control-plaintext' href={props.drugurlusage['drugurl']}>{props.drugurlusage['drugurl']}</a>
                    <textarea onChange={props.handlechange} className='form-control' rows='3' value={props.drugurlusage['drugusage']}>{props.drugurlusage['drugusage']}</textarea>
                </>
            )
        }
        else {
            return (
                <>
                    <a className='form-control-plaintext' href={props.drugurlusage['drugurl']}>{props.drugurlusage['drugurl']}</a>
                    <textarea onChange={props.handlechange} className='form-control' rows='3' value={props.drugurlusage['drugusage']}>{props.drugurlusage['drugusage']}</textarea>
                    <input type='number' onChange={(e) => props.handlechange(e, "qty" + props.id)} id={"qty" + props.id} name='drugqty' className='form-control' placeholder="Please enter number of pills" min="1" max="100" />
                </>
            )
        }
    }
    //FOR PATIENT TO SEE 
    else {
        return (
            <div className="form-group presciptiondrug" id="drugdetailcontent" style={{ visibility: props.drugdetailvisible }}>
                <h3>Drug Content</h3>
                <div id="drugusage">
                    <a className='form-control-plaintext' href={props.drugurlusage['drugurl']}>{props.drugurlusage['drugurl']}</a>
                    <textarea className='form-control' rows='3' value={props.drugurlusage['drugusage']}></textarea>
                </div>
                <div id="drugurl"></div>
            </div>
        )
    }

}