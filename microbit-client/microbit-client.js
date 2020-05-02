radio.onReceivedString(function (receivedString) {
    if (receivedString.substr(0, 4) != device_id) {
        radio.sendString(receivedString)
        basic.showIcon(IconNames.Duck)
        basic.pause(100)
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            `)
    }
})
function send_temperature() {
    message = "" + device_id + ":t:"
    message = "" + message + convertToText(input.temperature())
    radio.sendString("" + message)
}
function send_light() {
    message = "" + device_id + ":l:"
    message = "" + message + convertToText(input.lightLevel())
    radio.sendString("" + message)
}
let message = ""
let device_id = ""
radio.setGroup(1)
device_id = "device1"
basic.forever(function () {
    send_temperature()
    send_light()
    basic.pause(2000)
    basic.showIcon(IconNames.Heart)
    basic.pause(100)
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)
})
