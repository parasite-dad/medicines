import React from "react";

//THIS COMPONENT FOR THE ADMIN INDEX PAGE TO GENERATE THE BODY INDEX ROW AND HAVE REDIRECT TO PATIENT PROFILE
export default function Adminbodyindexhistory(props) {

    function redirectprofile(event, name) {
        event.preventDefault();
        location.href = "/profile/" + name;
    }
    return (
        <>
            <tr onClick={(e) => redirectprofile(e, props.name)}>
                <th scope="col">{props.date.slice(0, 10)}</th>
                <td scope="col">{props.name}</td>
                <td scope="col">{props.weight}</td>
                <td scope="col">{props.height}</td>
                <td scope="col">{props.systolic}</td>
                <td scope="col">{props.diastolic}</td>
                <td scope="col">{props.heartrate}</td>
                <td scope="col">{props.sugarlevel}</td>
                <td scope="col">{props.risklevel}</td>

            </tr>
        </>
    )

}