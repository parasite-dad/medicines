document.addEventListener('DOMContentLoaded', function () {
    //document.querySelector('#findprofile').addEventListener('click', () => showprofile);
    //document.querySelector('#patientname').onload = 
    if (document.querySelector('#username1')) {
        if (document.querySelector('#username1').value == "admin") {
            patientname();
            document.querySelector('#patientname').onchange = changeformaction;
        }
    }
    //setInterval(showprofile, 5000);
});
function patientname() {
    fetch('/patientname', {
        method: 'GET',
    }).then(response => response.json())
        .then(patientnames => {
            patientnames.forEach(patientname => {
                //console.log(patientname);
                const option = document.createElement('option');
                option.setAttribute('value', patientname);
                option.innerHTML = patientname;
                //option.innerHTML = "<a href=/profile/" + patientname + ">" + patientname + "</a>";
                document.querySelector('#patientname').append(option);
            })
        })
}
function changeformaction(value) {
    const val = document.getElementById('patientname').value;
    document.getElementById('patientform').action = "/profile/" + val;
    document.getElementById('patientform').submit();
}

