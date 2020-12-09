//profilePics
document.getElementById('profilePicsForm').onsubmit = (event) => {
    event.preventDefault();
    console.log(event)

    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", "/uploads/profilePics");
    var formData = new FormData()
    formData.append('profilePics', document.getElementById('profilePicsFile').files[0])

    // let headers = new Headers();
    // headers.append('Accept','Application/JSON')
    // headers.append('Content-Type', 'Application/JSON')

    // let req = new Request('/uploads/profilePics', {
    //     method : 'POST',
    //     headers,
    //     node: 'cors',
    //     body = formData
    // })
    // xhttp.open(req)

    xhttp.send(formData)
}