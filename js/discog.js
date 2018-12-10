
function getToken(){
  return "PfDvvkhfPHveFfazedHHPwPnePvphvRDhvGdciGL"
}

/* Request to the Discogs API
urlRequest:  Discogs request
params: Parameters for the request
*/
function authGetRequestDiscogs(urlRequest,params){
  return new Promise(function(resolve, reject) {
    // Creating HTTP request
    var req = new XMLHttpRequest();
    const urlPath = "https://api.discogs.com/";
    const token = getToken();
    const url=urlPath+urlRequest+"?"+params+"&token="+token;
    req.open('GET', url);
    req.onload = function() {
      // Check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        reject(Error(req.statusText));
      }
    };
    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };
    // Make the request
    req.send();
  });
}
authGetRequestDiscogs("users/khaaaaaa/collection/folders/0/releases","per_page=200").then(function(response) {
  var vinylsJson = JSON.parse(response);
  var vinylList=[]
  for (var i in vinylsJson["releases"]){
    var vinyl = {
      artist:vinylsJson["releases"][i]["basic_information"]["artists"][0]["name"],
      title:vinylsJson["releases"][i]["basic_information"]["title"],
      year:vinylsJson["releases"][i]["basic_information"]["year"],
      thumb:vinylsJson["releases"][i]["basic_information"]["thumb"],
      masterURL:vinylsJson["releases"][i]["basic_information"]["master_url"]
    };
    vinylList.push(vinyl)
  }
  vinylList.sort(function(a, b){
    var nameA=a.artist.toLowerCase(), nameB=b.artist.toLowerCase()
    if (nameA < nameB) //sort string ascending
        return -1
    if (nameA > nameB)
        return 1
    return 0 //default return value (no sorting)
  })
  displayVinyl(vinylList)
  console.log(vinylsJson)
}, function(error) {
  console.error("Failed!", error);
})

function displayVinyl(vinylList){
  var vinylTable = document.getElementById("vinyl-list");
  for (vinylIndex in vinylList){
    vinylTemplate=parse("<li class='media'>\
      <div class='media-left media-middle'>\
        <img class='media-object' src=%s alt=%s>\
      </div>\
      <div class='media-body'>\
        <h4 class='media-heading vinyl-title'>%s</h4>\
        <p>%s</p>\
        <p>%s</p>\
      </div>\
    </li>", vinylList[vinylIndex].thumb,vinylList[vinylIndex].title,
    vinylList[vinylIndex].artist,vinylList[vinylIndex].title,vinylList[vinylIndex].year);
    vinylTable.innerHTML +=vinylTemplate;
  }
}

/* Parse and replace string in a string
*/
function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, function() {
        return args[i++];
    });
}
