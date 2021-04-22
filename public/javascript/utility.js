const Utility = {}

/**
 * @summary Calculate distance between two locations
 * @param {number} staLat Location A Latitude
 * @param {number} staLng Location A Longitude
 * @param {number} desLat Location B Latitude
 * @param {number} desLng Location B Longitude
 * @returns Distance in km unit with 1 decimal place
 */
Utility.getDistance = (staLat, staLng, desLat, desLng) => {
	let tmp = Utility.distance(staLat, staLng, desLat, desLng, 'K')
	tmp = Math.round(tmp * 10) / 10
	return tmp + 'km'
}

/**
 * @summary Retrieve an item from local storage
 * @param {string} key Item key
 * @returns {object} Data in its original form
 */
Utility.getItemFromLocalStorage = (key) => {
	return JSON.parse(localStorage.getItem(key))
}

/**
 * @summary Store an item to local storage
 * @param {string} key Item key
 * @param {object} data Data in its original form
 */
Utility.setItemToLocalStorage = (key, data) => {
	localStorage.setItem(key, JSON.stringify(data))
}

/**
 * @summary Remove an item from local storage
 * @param {string} key Item key
 */
Utility.removeItemFromLocalStorage = (key) => {
	localStorage.removeItem(key)
}

/**
 * @summary Calculate distance between two locations
 * @param {*} lat1 Location A Latitude
 * @param {*} lon1 Location A Longitude
 * @param {*} lat2 Location B Latitude
 * @param {*} lon2 Location B Longitude
 * @param {*} unit Distance unit
 * @returns Distance in required unit
 * @copyright GeoDataSource.com
 */
Utility.distance = (lat1, lon1, lat2, lon2, unit) => {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1 / 180;
		var radlat2 = Math.PI * lat2 / 180;
		var theta = lon1 - lon2;
		var radtheta = Math.PI * theta / 180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180 / Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit == "K") { dist = dist * 1.609344 }
		if (unit == "N") { dist = dist * 0.8684 }
		return dist;
	}
}