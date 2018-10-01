# BlinkstickChrome2
| Chrome App | Reference|
| --- | --- |
| ![Preview](https://github.com/NGRP/INNO-chrome-blinkstick/blob/master/assets/icon.png) | This project is based on [BlinkstickChrome](https://github.com/onion2k/BlinkstickChrome), a Chrome app published by onion2k. <br>This is a Chrome App to test and control your Blinkstick LEDs, and to connect it with a SocketIO server. <br>Once you're ready with your light patterns, just copy the given code and send it later xith you SocketIO server!  |

# Requierements
- A Chrome dev channel to access chrome.hid
- A version newer than Chrome 41 in order to access onDeviceAdded and onDeviceRemoved events
- A SocketIO server (not needed for tests)
- A blinkstick device

# Running BlinkstickChrome
- Clone the repo
- Open the Chrome extensions page (chrome://extensions)
- Switch on Developer mode (tickbox at the top right)
- Click "Load Unpacked Extension..." button to find the repo folder and install it as an app

![Preview](https://github.com/NGRP/INNO-chrome-blinkstick/blob/master/assets/preview.png)

# Configuration
Click *Configuration* (navbar) to access the configuration panel. There, you can chose the number of LEDs of your device, but also configure the SocketIO connection. You cannot save the configuration, but download and upload a file to save time.

# Connection info
You can get information on the SocketIO connection or the device acess by clicking *State* for both panels. 

# Tests
To test your Blinkstick and create patterns, click *Test panel*. When you test a pattern, you get the json object that you socketIO server can send in order to get the same. For information, the "stop animation" send :

```
{	
    "action": "swi",
    "colors": [{"r":0, "g":0, "b":0}],
    "loops": 0
}
```
