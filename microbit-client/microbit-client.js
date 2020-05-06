function resendMessage (message: string) {
    receivedMessages.push(message)
    radio.sendString(message)
}
radio.onReceivedString(function (receivedString) {
    messageFound = 0
    messagesForDevice = []
    findFirstColon(receivedString)
    sendingDevice = receivedString.substr(0, colonPosition)
    if (sendingDevice != deviceId) {
        findMessage(receivedString)
        if (messageFound == 0) {
            resendMessage(receivedString)
        }
        if (messagesForDevice.length >= 10) {
            for (let value of messagesForDevice) {
                tempString = receivedMessages.removeAt(receivedMessages.indexOf(value))
            }
            lastChar = receivedString.substr(receivedString.length - 1, 1)
            idsPosition = messageIds.indexOf(lastChar)
            for (let value2 of messagesForDevice) {
                tempLastChar = value2.substr(value2.length - 1, 1)
                tempIdsPosition = messageIds.indexOf(tempLastChar)
                if (tempIdsPosition > idsPosition) {
                    tempIdsPosition = tempIdsPosition - messageIds.length
                }
                if (tempIdsPosition < idsPosition - 10) {
                    receivedMessages.push(value2)
                }
            }
        }
    }
})
function findFirstColon (message: string) {
    colonPosition = 0
    for (let index = 0; index <= message.length - 1; index++) {
        if (message.substr(index, 1) == ":") {
            if (colonPosition == 0) {
                colonPosition = index
            }
        }
    }
}
function sendMessage (source: string, value: string) {
    message2 = "" + deviceId + ":" + source + ":"
    message2 = "" + message2 + value + ":"
    message2 = "" + message2 + messageIds[messageIdIndex]
    messageIdIndex += 1
    if (messageIdIndex >= messageIds.length) {
        messageIdIndex = 0
    }
    radio.sendString("" + message2)
}
function findMessage (receivedString: string) {
    for (let message of receivedMessages) {
        findFirstColon(message)
        tempDevice = receivedString.substr(0, colonPosition)
        if (tempDevice == sendingDevice) {
            messagesForDevice.push(message)
        }
        if (message == receivedString) {
            messageFound = 1
        }
    }
}
function sendTemperature () {
    sendMessage("t", convertToText(input.temperature()))
}
function sendlight () {
    sendMessage("l", convertToText(input.lightLevel()))
}
let tempDevice = ""
let message2 = ""
let tempIdsPosition = 0
let tempLastChar = ""
let idsPosition = 0
let lastChar = ""
let tempString = ""
let colonPosition = 0
let sendingDevice = ""
let messagesForDevice: string[] = []
let messageFound = 0
let receivedMessages: string[] = []
let messageIdIndex = 0
let messageIds: string[] = []
let deviceId = ""
radio.setGroup(1)
radio.setTransmitPower(7)
deviceId = "dev1"
messageIds = []
let alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
for (let index2 = 0; index2 <= alphabet.length - 1; index2++) {
    messageIds.push(alphabet.substr(index2, 1))
}
messageIdIndex = 0
receivedMessages = []
basic.forever(function () {
    sendTemperature()
    sendlight()
    basic.pause(600000)
})
