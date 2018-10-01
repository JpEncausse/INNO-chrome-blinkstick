# BlinkstickChrome2
This project is based on [BlinkstickChrome](https://github.com/onion2k/BlinkstickChrome), a Chrome app by onion2k.
This is a Chrome App to test and control your Blinkstick LEDs, and to connect it with a SocketIO server.

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

# Using a Blinkstick
When the app is running plug in a Blinkstick and it'll be detected automatically. Note: BsC doesn't yet detect the number of available LEDs, so you'll get 8 controls. Using controls for LEDs that don't exist will throw out errors.

![Preview]

# Emulating a Blinkstick
You don't actually need a Blinkstick to use BsC. Click on the Emulators menu at the top of the app, then select a device type to emulate. A 3D visualisation of the device will be displayed, and all the controls will work with it.

# The Bridge
BsC includes a small server instance that accepts basic controls for the Blinkstick. To use it, connect to 127.0.0.1:8888 and send a JSON string in the format of {i:<index>,r:<red>,g:<green>,b:<blue>} eg {i:0,r:255,g:0,:b:0} to turn the 0th LED red.

The advantage of using the bridge is that you can control a Blinkstick using any programming language that can send a TCP packet.




