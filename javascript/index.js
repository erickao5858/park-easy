// Rawdata provided by park-easy-api
const data = {
    "locations": [
        {
            "coordinates": [
                145.114533,
                -37.837484
            ],
            "title": "Highbury Rd",
            "bays": 10,
            "baysAvailable": 5,
            // TODO: Create a function to make use of html template 
            // Instead of putting html markers in description,
            // use a function to map description to html template
            'description':  '<strong>Highbury Road</strong>'+
                            '<p></p>'+
                            '<a href="https://www.google.com/maps/dir/?api=1&destination=-37.837484,145.114533&travelmode=driving" target="_blank">Navi to here</a>'
        },
        {
            "coordinates": [
                145.106616,
                -37.835709
            ],
            "title": "Station St",
            "bays": 255,
            "baysAvailable": 204,
            'description':  '<strong>Station Street</strong>'+
                            '<p></p>'+
                            '<a href="https://www.google.com/maps/dir/?api=1&destination=-37.835709,145.106616&travelmode=driving" target="_blank">Navi to here</a>'
        }
    ]
}
