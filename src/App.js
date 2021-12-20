import React from "react";

import MapComponent from "./MapComponent";

//          My initial plan

//I know that I'll need to send the specified locations to the initial endpoint and based on the data object that it returns I should be able to pass that data into the second endpoint which will return the neighborhood that the address is inside of.

// From the second endpoint I should be able to find the neighborhood boundary and I'll need to pass that into the dynamic map somehow.

//I'll need use the returned data from the second endpoint to update the state to display the name of the neighborhood as per step 4, as well as show the address marker per step 6.a.

//install the arcgis/core and use that to render a dynamic map

//use the boundary retrieved from the second endpoint and display it on the map.

//configure a unit test for one of the components using jest, or mochachia

function App() {
  const [address, setAddress] = React.useState(null);

  const [neighborhood, setNeighborhood] = React.useState(null);

  const [centralPoint, setCentralPoint] = React.useState({
    x: -13653568.837189957,
    y: 5703596.7500935141,
  });

  //create state that manages the central point of map
  //initial state should be GG HQ

  const [rings, setRings] = React.useState([]);

  const handleSelectChange = ({ target }) => {
    let searchParam = target.value.replace(/\,?\s/g, "+");
    //parsing the input via the drop down options, stripping out ", and spaces" and cancatinating it with "+" using regex
    setAddress(searchParam);
  };

  const getAddressData = async () => {
    if (address) {
      let resAddress = await fetch(
        //my call to the first endpoint
        `https://www.portlandmaps.com/arcgis/rest/services/Public/Address_Geocoding_PDX/GeocodeServer/findAddressCandidates?Street=&City=&State=&ZIP=&Single+Line+Input=${address}&outFields=&maxLocations=&matchOutOfRange=false&langCode=&locationType=&sourceCountry=&category=&location=&distance=&searchExtent=&outSR=&magicKey=&f=pjson`
      );
      //populating the addressed via the drop down into the first endpoint

      let addressData = await resAddress.json();
      //assigning the returned object to a variable
      // console.log(addressData);
      let location = addressData.candidates[0].location;
      //selecting the candidate with the highest confidence to the location variable
      // console.log(address);

      //update the central point state /
      setCentralPoint({ x: location.x, y: location.y });

      function createSearchParams(location) {
        return `location:x${location.x}, y:${location.y}`;
        //passing in the location with the highest condifence and returning the x,y coordinates so that we can pass them into the second endpoint to return the neighborhood name and boundary
      }

      let locationSearchParam = createSearchParams(location);
      //assigning the address to a string for the second endpoint

      let resAddressGeometry = await fetch(
        `https://www.portlandmaps.com/arcgis/rest/services/Public/COP_OpenData_Boundary/MapServer/3/query?where=&text=&objectIds=&time=&geometry=${locationSearchParam}&geometryType=esriGeometryPoint&inSR=102100&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=json`
      );
      //passing those coordinates into the second endpoint and returning the neighborhood boundaries

      let GeometryData = await resAddressGeometry.json();
      //assigning the neighborhood boundary from the second endpoint to the variable "rings"
      setRings(GeometryData.features[0].geometry.rings);
      // console.log(GeometryData.features[0].geometry.rings);

      // console.log(GeometryData);
      let neighborhoodName = GeometryData.features[0].attributes.NAME;
      //retrieving the neighborhood name from the second endpoint object
      setNeighborhood(neighborhoodName);
    } else {
      setNeighborhood(null);
      alert("Choose an address first");
    }
  };

  return (
    <div className="App">
      <h1>TGG Assessment - Luke Fountain 2021</h1>
      <select name="" id="" onChange={handleSelectChange}>
        <option value="">Choose an address</option>
        <option value="2735 E Burnside St, Portland, OR 97214">
          2735 E Burnside St, Portland, OR 97214
        </option>
        <option value="1200 SW Park Avenue, Portland, OR 97205">
          1200 SW Park Avenue, Portland, OR 97205
        </option>
        <option value="3875 SW Bond Ave, Portland, OR 97239-4590">
          3875 SW Bond Ave, Portland, OR 97239-4590
        </option>
      </select>
      <button onClick={getAddressData}>Get neighborhood</button>

      {neighborhood && <p>Neighborhood is: {neighborhood}</p>}

      <MapComponent centralPoint={centralPoint} rings={rings} />
    </div>
  );
}
//address dropdown and the dynamic map
export default App;
