var masterSocket = null;
var mopidyDevices = []

function switchDevice(device) {
      mopidyDevice = mopidyDevices[device]
      if (currentWebsocketUrl != mopidyDevice.ws) {
        masterSocket.send("activate:"+device)
        var connectOptions = {callingConvention: 'by-position-or-by-name'}
        connectOptions['webSocketUrl'] = mopidyDevice.ws
        currentWebsocketUrl = mopidyDevice.ws
        mopidy = new Mopidy(connectOptions)
        // initialize events
        initSocketevents()
        if ( syncedProgressTimer != null) 
           syncedProgressTimer.stop()
        syncedProgressTimer = new SyncedProgressTimer(8, mopidy)
        resetSong()
      }
}

function updateDevices(devices) {
   mopidyDevices = devices;
   $('#deviceselect').customSelect('empty')
   for (var device in devices) {
    var option = $('<option></option>').attr("value", devices[device].name).text(devices[device].name);
    if (devices[device].active) {
      option.attr("selected",true)
      switchDevice(device)
    }
    $('#deviceselect').customSelect('append',option)
   }

   $('#deviceselect').on('change', function(e) {
     console.log(e.target.value);
      var device = e.target.value;
      switchDevice(device)
   });


}


function initMasterApi() {
  var loc = window.location;
  if (masterSocket != null) {
    if (masterSocket.readyState == WebSocket.OPEN) {
      return;
    }
    masterSocket.onopen = function (event) {};
  }
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


