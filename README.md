# micro:bit IoT Central Gateway

This repo contains the code to make an Azure IoT Central gateway for the BBC micro:bit!

## Why

The micro:bit is a great board! You can program it with MakeCode using blocks, JavaScript or Python. It has a few sensors on board, it can be connected to a whole host more via its finger connector, and it's reasonably priced.

The downside is it doesn't have WiFi, making it not the ideal device for IoT. It does have Bluetooth, and is able to send messages to other micro:bits with a single MakeCode block.

This is where the gateway comes in!

## Mesh network of micro:bits

Data is collected via a number of micro:bits gathering data such as the temperature or amount of light detected. This data is received by the micro:bits, then transmitted over the Bluetooth radio along with a unique ID per device.

These micro:bits are also listening to messages from each other, and will forward any messages received. This way only one micro:bit needs to be in Bluetooth range of the hub, the rest can be further away. As long as each micro:bit is close enough to send a message to one other, the messages will all get to the gateway.

The code for these clients is in the [microbit-client](./microbit-client) folder. You can load this code into the MakeCode for micro:bit JavaScript editor then flip to blocks. In the `on start` method you will need to change the value of `deviceId` so that each device has a unique ID. These IDs should also be short - there is a limit of 19 characters in the Bluetooth message, so try to use incrementing numbers or other small unique IDs. Once you've set the ID download the code to a device.

## Gateway

The gateway runs on a Raspberry Pi connected to IoT Central over Wifi. The gateway also has a micro:bit connected via USB and listening to messages over the Bluetooth radio. Every time a message is received, it is routed over the serial cable to the Pi, which picks up the message, parses it out for a device id and what telemetry data was received, and sends that to IoT Central. The app is configured using the IoT Central master key, so will automatically provision devices for you.

The Raspberry Pi runs the code in the  [pi-gateway](./pi-gateway) folder, with the connected micro:bit running the code in the [microbit-gateway](./microbit-gateway) folder. 

To use the micro:bit gateway code:

1. Load this code into the MakeCode for micro:bit JavaScript editor

1. Download the code to a micro:bit

1. Connect the micro:bit running the gateway code to a USB port on the Pi.

To use the Pi code, do the following:

1. Install the required pip packges from the `requirements.txt` file

1. Create a new file in the same folder as this code called `.env`. Add the following to this file:

   ```sh
   ID_SCOPE=<IoT Central ID scope>
   MASTER_KEY=<IoT Central master key>
   ```

   Set `IoT Central ID scope>` to the ID scope from the IoT Central app. You can find this by going to *Administration -> Device Connection*.

   Set `<IoT Central master key>` to the SAS primary or secondary key. You can find this by going to *Administration -> Device Connection*.

1. Run the `app.py` file.