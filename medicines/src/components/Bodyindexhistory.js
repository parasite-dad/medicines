import React from "react";

//THIS COMPONENT USED TO SHOW THE BODYINDEX ROW 
export default function Bodyindexhistory(props) {

    return (
        <>
            <tr>
                <th scope="col">{props.date.slice(0, 10)}</th>
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