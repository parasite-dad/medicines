import React, { useReducer } from "react";

//THIS COMPENT IS FOR SAVING PATIENT BODY INDEX RECORD 
export default function Bodyindex(props) {
    //const [bodyindexcontent, setBodyindexcontent] = useState({});
    //BELOW USING REDUCER TO UPDATE THE BODYINDEXCONTENT
    const initialbodyindex = { weight: '', height: '', Systolicblood: '', Diastolicblood: '', Heartrate: '', sugar: '' };
    const [bodyindexcontent, updateBodyindexcontent] = useReducer((bodyindexcontent, updateBodyindexcontent) => ({ ...bodyindexcontent, ...updateBodyindexcontent }), initialbodyindex);

    function handleChange(e) {
        const targetid = e.target.id;
        const targetvalue = e.target.value;
        switch (targetid) {
            case 'weight':
                updateBodyindexcontent({ weight: targetvalue });
            case 'height':
                updateBodyindexcontent({ height: targetvalue });
            case 'Systolicblood':
                updateBodyindexcontent({ Systolicblood: targetvalue });
            case 'Diastolicblood':
                updateBodyindexcontent({ Diastolicblood: targetvalue });
            case 'Heartrate':
                updateBodyindexcontent({ Heartrate: targetvalue });
            case 'sugar':
                updateBodyindexcontent({ sugar: targetvalue });

        }
        //console.log(bodyindexcontent);
    }

    function handleSubmit(e) {
        e.preventDefault();
        fetch('/bodyindex/' + props.name, {
            method: 'POST',
            // body: JSON.stringify({
            //     weight: weight,
            //     height: height,
            //     Systolicblood: Systolicblood,
            //     Diastolicblood: Diastolicblood,
            //     Heartrate: Heartrate,
            //     sugar: sugar
            // })
            body: JSON.stringify(bodyindexcontent)
        }).then(response => response.json())
            .then(result => {
                console.log(result);
                //AFTER SAVING THE BODYINDEX AND SET ALL FIELDS EMPTY
                document.getElementById('weight').value = "";
                document.getElementById('height').value = "";
                document.getElementById('Systolicblood').value = "";
                document.getElementById('Diastolicblood').value = "";
                document.getElementById('Heartrate').value = "";
                document.getElementById('sugar').value = "";
            });

        props.bodyindexupdate(bodyindexcontent);
    }
    return (
        <div className="row align-items-center">
            <form onSubmit={handleSubmit}>
                {/* {% csrf_token %} */}
                <div>
                    <h2>Body Index</h2>
                </div>
                <br />
                <div className="form-group">
                    <input onChange={handleChange} id="weight" className="form-control" type="number" step="any" name='weight' placeholder="Weight(kg)" min="1" max="300" />
                </div>

                <div className="form-group">
                    <input className="form-control" onChange={handleChange} id="height" type="number" step="any" name="height" placeholder="Height(cm)" min="1" max="300" />
                </div>
                <br />
                <div className="form-group">
                    <input className="form-control" onChange={handleChange} id="Systolicblood" type="number" step="any" name='Systolicblood'
                        placeholder="Systolic Blood Pressure" min="1" max="300" />
                </div>
                <div className="form-group">
                    <input className="form-control" onChange={handleChange} id="Diastolicblood" type="number" step="any" name='Diastolicblood'
                        placeholder="Diastolic Blood Pressure" min="1" max="300" />
                </div>
                <div className="form-group">
                    <input className="form-control" onChange={handleChange} id="Heartrate" type="number" step="any" name='Heartrate'
                        placeholder="Heart Beat Rate" min="1" max="300" />
                </div>
                <br />
                <div className="form-group">
                    <input className="form-control" type="number" step="any" onChange={handleChange} id="sugar" name="sugar" placeholder="Blood Sugar Level" min="1" max="40" />
                </div>
                <br />
                <div className="text-center">
                    <input className="btn btn-primary text-center" type="submit" value="Submit" />
                </div>
                <br />
            </form>
        </div>
    )

}
