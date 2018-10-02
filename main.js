let CONFIG = {
  "blinkstick": {
      "vendor": "8352",
      "product": "16869",
      "leds": "32",
      "reportid": "8"
  },
  "socket": {
      "host": "",
      "path": "",
      "name": "",
      "secure": "false"
  }
}

let connectionId = -1;
let socketio;
let stopAnimation = false;

/* HID */
function initDeviceConnection() {
  chrome.hid.getDevices({
    "vendorId": CONFIG.blinkstick.vendor, 
    "productId": CONFIG.blinkstick.product
  }, function(devices) {
    if (!devices || !devices.length) {
      $("#blinkstickInfo").prepend(new Date().toLocaleTimeString('fr-FR') + ' - <b>Blinkstick not found<b><br>');
     return;
    }
    hidDevice = devices[0].deviceId;
    chrome.hid.connect(hidDevice, function(connection) {
      connectionId = connection.connectionId;
      $("#blinkstickInfo").prepend(new Date().toLocaleTimeString('fr-FR') + ' - <b>Blinkstick connected<b><br>');
    });
  });
}

chrome.hid.onDeviceAdded.addListener(function(){
  initDeviceConnection();
});

chrome.hid.onDeviceRemoved.addListener(function(){
  $("#blinkstickInfo").prepend(new Date().toLocaleTimeString('fr-FR') + ' - <b>Blinkstick removed<b><br>');
});

function processLeds(data) {
  if (!data.action) return;
  stopAnimation = true;
  console.log(data)

  switch(data.action) {
    case "swi":
      switchLight(data.delay, data.colors, data.loops);
    break;
    case "ltr":
      traverseLight(1, data.size, data.loops, data.delay, data.colors);
    break;
    case "rtl":
      traverseLight(0, data.size, data.loops, data.delay, data.colors);
    break;
    case "ext":
      borderLight(0, data.size, data.loops, data.delay, data.colors);
    break;
    case "int":
      borderLight(1, data.size, data.loops, data.delay, data.colors);
    break;
  }
}

function getColor(color) {
  let newColor = { r: 0, g: 0, b: 0, a: 1 };
      
  color = String(color);
  if (color[0] === '#') color = color.substring(1);
  if (color.length === 6) {
    newColor.r = parseInt(color.substring(0,2), 16);
    newColor.g = parseInt(color.substring(2,4), 16);
    newColor.b = parseInt(color.substring(4,6), 16);
    return newColor;
  }
  if (color.match(/^rgb/i)) {
    let nbs = [];
    color.replace(/[0-9]{1,3}(\.[0-9]{1,2})?/ig, 
    function (nb) { 
      nbs.push(Number(nb));
      return nb;
    })
    if (nbs.length < 3) return false;
    newColor.r = nbs[0];
    newColor.g = nbs[1];
    newColor.b = nbs[2];
    if (nbs.length > 3) newColor.a = nbs[3];
    return newColor;
  }
  return false;
}

/* INTERFACE */
function initConnection() {
  if (socketio) {
    socketio.stopServer()
    delete socketio;
  }

  socketio = BlinkstickChromeSocket();
  socketio.startServer(CONFIG.socket.host, CONFIG.socket.path, CONFIG.socket.name, CONFIG.socket.secure);
}

function loadConfigData(data, start) {

    $("#blink-vendor").val(Number(data.blinkstick.vendor));
    $("#blink-product").val(Number(data.blinkstick.product));
    $("#blink-leds").val(Number(data.blinkstick.leds));
    $("#socket-host").val(data.socket.host);
    $("#socket-path").val(data.socket.path);
    $("#socket-name").val(data.socket.name);
    $("#socket-secure").prop("checked", data.socket.secure === "true");

    CONFIG = {
      "blinkstick" :{
          "vendor":  Number(data.blinkstick.vendor) || 8352,
          "product": Number(data.blinkstick.product) || 16869,
          "leds": Number(data.blinkstick.leds) || 8,
          "reportid": 6
      }, 
      "socket": {
          "host": data.socket.host || "http://localhost",
          "path": data.socket.path || "/",
          "name": data.socket.name || "blinkstick",
          "secure": (data.socket.secure === "true")
      }
    }

    if (Number(CONFIG.blinkstick.leds) > 32) CONFIG.blinkstick.reportid = 9;
    else if (Number(CONFIG.blinkstick.leds) > 16) CONFIG.blinkstick.reportid = 8;
    else if (Number(CONFIG.blinkstick.leds) > 8) CONFIG.blinkstick.reportid = 7;

    initDeviceConnection();
    if (start) initConnection();
}

window.onload = function() {
  $("#colors-number").val(1).change();
  $("#animation-action").change();
  loadConfigData(CONFIG, false);
}





