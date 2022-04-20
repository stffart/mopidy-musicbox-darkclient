var masterSocket = null;
var mopidyDevices = []
function updateDevices(devices) {
   mopidyDevices = devices;
   $('#deviceselect').customSelect().addEventListener('change', function(e) {
     window.location.replace(mopidyDevices[e.target.selectedOptions[0].value].url)
   });

   $('#deviceselect').customSelect('empty')
   for (var device in devices) {
    var option = $('<option></option>').attr("value", devices[device].name).text(devices[device].name);
    $('#deviceselect').customSelect('append',option)
   }
}


function initMasterApi() {
  var loc = window.location;
  masterSocket = new WebSocket('ws://'+loc.host+'/master/socketapi/ws');
  masterSocket.onmessage = function (event) {
    console.log(event.data)
    msg = JSON.parse(event.data)
    if ( msg.msg == 'devices' ) {
      updateDevices(msg.devices)
    }
  }
  masterSocket.onerror = function (event) {
    $('#devicesist').hide()
  }
  masterSocket.onopen = function (event) {
    masterSocket.send('list');
  }
}


