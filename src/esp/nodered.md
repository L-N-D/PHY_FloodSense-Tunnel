[
    {
        "id": "042e35ddd4520c96",
        "type": "tab",
        "label": "ESP32 Basement A-Topics",
        "disabled": false,
        "info": ""
    },
    {
        "id": "d5ff004f71673711",
        "type": "mqtt in",
        "z": "042e35ddd4520c96",
        "name": "Temp",
        "topic": "esp32/data/temperature",
        "qos": "0",
        "datatype": "auto",
        "broker": "mqtt_config",
        "nl": false,
        "rap": false,
        "inputs": 0,
        "x": 150,
        "y": 60,
        "wires": [
            [
                "be9d33e2c1260e9a",
                "25469653008f0430"
            ]
        ]
    },
    {
        "id": "be9d33e2c1260e9a",
        "type": "ui_gauge",
        "z": "042e35ddd4520c96",
        "name": "Temperature",
        "group": "group_sensor",
        "order": 1,
        "width": 3,
        "height": 3,
        "gtype": "gage",
        "title": "",
        "label": "Temp (°C)",
        "format": "{{value}}",
        "min": 0,
        "max": 60,
        "colors": [
            "#00b500",
            "#e6e600",
            "#ca3838"
        ],
        "seg1": 30,
        "seg2": 45,
        "diff": false,
        "className": "",
        "x": 420,
        "y": 60,
        "wires": []
    },
    {
        "id": "ca0d432a5e0f861a",
        "type": "mqtt in",
        "z": "042e35ddd4520c96",
        "name": "Humidity",
        "topic": "esp32/data/humidity",
        "qos": "0",
        "datatype": "auto",
        "broker": "mqtt_config",
        "nl": false,
        "rap": false,
        "inputs": 0,
        "x": 160,
        "y": 120,
        "wires": [
            [
                "33165190faf5233e",
                "ddb7677188bb547d"
            ]
        ]
    },
    {
        "id": "33165190faf5233e",
        "type": "ui_gauge",
        "z": "042e35ddd4520c96",
        "name": "Humidity",
        "group": "group_sensor",
        "order": 2,
        "width": 3,
        "height": 3,
        "gtype": "gage",
        "label": "Humidity (%)",
        "format": "{{value}}",
        "min": 0,
        "max": 100,
        "colors": [
            "#00b500",
            "#e6e600",
            "#ca3838"
        ],
        "seg1": 40,
        "seg2": 70,
        "x": 420,
        "y": 120,
        "wires": []
    },
    {
        "id": "a230ef5bcb79fb27",
        "type": "mqtt in",
        "z": "042e35ddd4520c96",
        "name": "Water Level",
        "topic": "esp32/data/water",
        "qos": "0",
        "datatype": "auto",
        "broker": "mqtt_config",
        "nl": false,
        "rap": false,
        "inputs": 0,
        "x": 160,
        "y": 180,
        "wires": [
            [
                "c7dd3cc1e5e4648e",
                "9a321df77f8f47d9",
                "b644dfea57335fa6"
            ]
        ]
    },
    {
        "id": "c7dd3cc1e5e4648e",
        "type": "ui_gauge",
        "z": "042e35ddd4520c96",
        "name": "Water Level",
        "group": "group_sensor",
        "order": 3,
        "width": 3,
        "height": 3,
        "gtype": "gage",
        "label": "Water (%)",
        "format": "{{value}}",
        "min": 0,
        "max": 100,
        "colors": [
            "#00b500",
            "#e6e600",
            "#ca3838"
        ],
        "seg1": 60,
        "seg2": 80,
        "x": 420,
        "y": 180,
        "wires": []
    },
    {
        "id": "9a321df77f8f47d9",
        "type": "ui_chart",
        "z": "042e35ddd4520c96",
        "name": "Water History",
        "group": "group_sensor",
        "order": 10,
        "width": 12,
        "height": 4,
        "label": "Water (%) History",
        "chartType": "line",
        "xformat": "HH:mm:ss",
        "interpolate": "linear",
        "ymin": 0,
        "ymax": 100,
        "removeOlder": "60",
        "removeOlderUnit": "60",
        "outputs": 1,
        "x": 430,
        "y": 240,
        "wires": [
            []
        ]
    },
    {
        "id": "0c48edda477e3697",
        "type": "mqtt in",
        "z": "042e35ddd4520c96",
        "name": "MQ2 Smoke",
        "topic": "esp32/data/smoke",
        "qos": "0",
        "datatype": "auto",
        "broker": "mqtt_config",
        "nl": false,
        "rap": false,
        "inputs": 0,
        "x": 160,
        "y": 300,
        "wires": [
            [
                "4a60e2d3dda1ae61",
                "81d80c4957a0e89a"
            ]
        ]
    },
    {
        "id": "4a60e2d3dda1ae61",
        "type": "ui_gauge",
        "z": "042e35ddd4520c96",
        "name": "Smoke MQ2",
        "group": "group_sensor",
        "order": 4,
        "width": 3,
        "height": 3,
        "gtype": "gage",
        "label": "Smoke (raw)",
        "format": "{{value}}",
        "min": 0,
        "max": 4095,
        "colors": [
            "#00b500",
            "#e6e600",
            "#ca3838"
        ],
        "seg1": 1500,
        "seg2": 2500,
        "x": 420,
        "y": 300,
        "wires": []
    },
    {
        "id": "f2e7cacdd7abc663",
        "type": "mqtt in",
        "z": "042e35ddd4520c96",
        "name": "Rain",
        "topic": "esp32/data/rain",
        "qos": "0",
        "datatype": "auto",
        "broker": "mqtt_config",
        "nl": false,
        "rap": false,
        "inputs": 0,
        "x": 150,
        "y": 360,
        "wires": [
            [
                "4291f915765bd1ba",
                "f21c7339e1dfdfb8"
            ]
        ]
    },
    {
        "id": "4291f915765bd1ba",
        "type": "ui_gauge",
        "z": "042e35ddd4520c96",
        "name": "Rain Sensor",
        "group": "group_sensor",
        "order": 5,
        "width": 3,
        "height": 3,
        "gtype": "gage",
        "label": "Rain (raw)",
        "format": "{{value}}",
        "min": 0,
        "max": 4095,
        "colors": [
            "#00b500",
            "#e6e600",
            "#ca3838"
        ],
        "x": 420,
        "y": 360,
        "wires": []
    },
    {
        "id": "3936e86253db1185",
        "type": "mqtt in",
        "z": "042e35ddd4520c96",
        "name": "Gate State",
        "topic": "esp32/data/gate",
        "datatype": "auto",
        "broker": "mqtt_config",
        "inputs": 0,
        "x": 160,
        "y": 440,
        "wires": [
            [
                "d5f21e76f2da1aab"
            ]
        ]
    },
    {
        "id": "d5f21e76f2da1aab",
        "type": "ui_text",
        "z": "042e35ddd4520c96",
        "group": "group_state",
        "order": 1,
        "width": 3,
        "height": 1,
        "name": "",
        "label": "Gate",
        "format": "{{msg.payload}}",
        "layout": "",
        "className": "",
        "style": false,
        "font": "",
        "fontSize": "",
        "color": "#000000",
        "x": 420,
        "y": 440,
        "wires": []
    },
    {
        "id": "94de5663f8d71f1d",
        "type": "mqtt in",
        "z": "042e35ddd4520c96",
        "name": "Pump State",
        "topic": "esp32/data/pump",
        "datatype": "auto",
        "broker": "mqtt_config",
        "inputs": 0,
        "x": 160,
        "y": 500,
        "wires": [
            [
                "fa6e8b1e3ea4e7f1"
            ]
        ]
    },
    {
        "id": "fa6e8b1e3ea4e7f1",
        "type": "ui_text",
        "z": "042e35ddd4520c96",
        "group": "group_state",
        "order": 2,
        "width": 3,
        "height": 1,
        "label": "Pump",
        "format": "{{msg.payload}}",
        "x": 420,
        "y": 500,
        "wires": []
    },
    {
        "id": "8fa68c9b727a1e10",
        "type": "mqtt in",
        "z": "042e35ddd4520c96",
        "name": "Fan State",
        "topic": "esp32/data/fan",
        "datatype": "auto",
        "broker": "mqtt_config",
        "inputs": 0,
        "x": 160,
        "y": 560,
        "wires": [
            [
                "59adc9031786be11"
            ]
        ]
    },
    {
        "id": "59adc9031786be11",
        "type": "ui_text",
        "z": "042e35ddd4520c96",
        "group": "group_state",
        "order": 3,
        "width": 3,
        "height": 1,
        "label": "Fan",
        "format": "{{msg.payload}}",
        "x": 420,
        "y": 560,
        "wires": []
    },
    {
        "id": "092055ef5da9a106",
        "type": "mqtt in",
        "z": "042e35ddd4520c96",
        "name": "Alarm",
        "topic": "esp32/data/alarm",
        "datatype": "auto",
        "broker": "mqtt_config",
        "inputs": 0,
        "x": 160,
        "y": 620,
        "wires": [
            [
                "a01a398f9aaac596"
            ]
        ]
    },
    {
        "id": "a01a398f9aaac596",
        "type": "ui_text",
        "z": "042e35ddd4520c96",
        "group": "group_state",
        "order": 4,
        "width": 4,
        "height": 1,
        "label": "Alarm",
        "format": "{{msg.payload}}",
        "x": 430,
        "y": 620,
        "wires": []
    },
    {
        "id": "839d51569a357ff1",
        "type": "ui_button",
        "z": "042e35ddd4520c96",
        "name": "Open Gate",
        "group": "group_cmd",
        "order": 1,
        "width": 3,
        "height": 1,
        "label": "Open Gate",
        "color": "",
        "bgcolor": "",
        "payload": "open",
        "payloadType": "str",
        "topic": "",
        "x": 170,
        "y": 740,
        "wires": [
            [
                "11120c6959a73319"
            ]
        ]
    },
    {
        "id": "fccc86cd66f3f19f",
        "type": "ui_button",
        "z": "042e35ddd4520c96",
        "name": "Close Gate",
        "group": "group_cmd",
        "order": 2,
        "width": 3,
        "height": 1,
        "label": "Close Gate",
        "color": "",
        "bgcolor": "",
        "payload": "close",
        "payloadType": "str",
        "topic": "",
        "x": 170,
        "y": 780,
        "wires": [
            [
                "11120c6959a73319"
            ]
        ]
    },
    {
        "id": "11120c6959a73319",
        "type": "function",
        "z": "042e35ddd4520c96",
        "name": "Make CMD Gate",
        "func": "msg.topic = \"esp32/cmd/gate\";\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 420,
        "y": 760,
        "wires": [
            [
                "1c678ac981d75f63"
            ]
        ]
    },
    {
        "id": "1c678ac981d75f63",
        "type": "mqtt out",
        "z": "042e35ddd4520c96",
        "name": "CMD Gate → ESP32",
        "topic": "",
        "qos": "",
        "retain": "",
        "broker": "mqtt_config",
        "x": 710,
        "y": 760,
        "wires": []
    },
    {
        "id": "d52c88782f976e59",
        "type": "ui_button",
        "z": "042e35ddd4520c96",
        "name": "Pump ON",
        "group": "group_cmd",
        "order": 3,
        "width": 3,
        "height": 1,
        "label": "Pump ON",
        "payload": "on",
        "payloadType": "str",
        "topic": "",
        "x": 170,
        "y": 840,
        "wires": [
            [
                "5df640e5a50f1ed7"
            ]
        ]
    },
    {
        "id": "534da6d05db6b857",
        "type": "ui_button",
        "z": "042e35ddd4520c96",
        "name": "Pump OFF",
        "group": "group_cmd",
        "order": 4,
        "width": 3,
        "height": 1,
        "label": "Pump OFF",
        "payload": "off",
        "payloadType": "str",
        "topic": "",
        "x": 170,
        "y": 880,
        "wires": [
            [
                "5df640e5a50f1ed7"
            ]
        ]
    },
    {
        "id": "5df640e5a50f1ed7",
        "type": "function",
        "z": "042e35ddd4520c96",
        "name": "Make CMD Pump",
        "func": "msg.topic = \"esp32/cmd/pump\";\nreturn msg;",
        "outputs": 1,
        "x": 420,
        "y": 860,
        "wires": [
            [
                "5838847055df6d69"
            ]
        ]
    },
    {
        "id": "5838847055df6d69",
        "type": "mqtt out",
        "z": "042e35ddd4520c96",
        "name": "CMD Pump → ESP32",
        "broker": "mqtt_config",
        "x": 710,
        "y": 860,
        "wires": []
    },
    {
        "id": "a6636eca82fa876c",
        "type": "ui_button",
        "z": "042e35ddd4520c96",
        "name": "Fan ON",
        "group": "group_cmd",
        "order": 5,
        "width": 3,
        "height": 1,
        "label": "Fan ON",
        "payload": "on",
        "payloadType": "str",
        "topic": "",
        "x": 170,
        "y": 940,
        "wires": [
            [
                "95eb53a5289b54ad"
            ]
        ]
    },
    {
        "id": "b69134ba5d51fb91",
        "type": "ui_button",
        "z": "042e35ddd4520c96",
        "name": "Fan OFF",
        "group": "group_cmd",
        "order": 6,
        "width": 3,
        "height": 1,
        "label": "Fan OFF",
        "payload": "off",
        "payloadType": "str",
        "topic": "",
        "x": 170,
        "y": 980,
        "wires": [
            [
                "95eb53a5289b54ad"
            ]
        ]
    },
    {
        "id": "95eb53a5289b54ad",
        "type": "function",
        "z": "042e35ddd4520c96",
        "name": "Make CMD Fan",
        "func": "msg.topic = \"esp32/cmd/fan\";\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "x": 420,
        "y": 960,
        "wires": [
            [
                "63a599579b261545"
            ]
        ]
    },
    {
        "id": "63a599579b261545",
        "type": "mqtt out",
        "z": "042e35ddd4520c96",
        "name": "CMD Fan → ESP32",
        "broker": "mqtt_config",
        "x": 710,
        "y": 960,
        "wires": []
    },
    {
        "id": "d7d2c73b5dc32195",
        "type": "ui_button",
        "z": "042e35ddd4520c96",
        "name": "Buzzer ON",
        "group": "group_cmd",
        "order": 7,
        "width": 3,
        "height": 1,
        "label": "Buzzer ON",
        "payload": "on",
        "payloadType": "str",
        "topic": "",
        "x": 170,
        "y": 1040,
        "wires": [
            [
                "fb827dbddefb8089"
            ]
        ]
    },
    {
        "id": "3e73fda220731876",
        "type": "ui_button",
        "z": "042e35ddd4520c96",
        "name": "Buzzer OFF",
        "group": "group_cmd",
        "order": 8,
        "width": 3,
        "height": 1,
        "label": "Buzzer OFF",
        "payload": "off",
        "payloadType": "str",
        "topic": "",
        "x": 170,
        "y": 1080,
        "wires": [
            [
                "fb827dbddefb8089"
            ]
        ]
    },
    {
        "id": "fb827dbddefb8089",
        "type": "function",
        "z": "042e35ddd4520c96",
        "name": "Make CMD Buzzer",
        "func": "msg.topic = \"esp32/cmd/buzzer\";\nreturn msg;",
        "outputs": 1,
        "x": 420,
        "y": 1060,
        "wires": [
            [
                "cd680f34bf9d7df8"
            ]
        ]
    },
    {
        "id": "cd680f34bf9d7df8",
        "type": "mqtt out",
        "z": "042e35ddd4520c96",
        "name": "CMD Buzzer → ESP32",
        "broker": "mqtt_config",
        "x": 710,
        "y": 1060,
        "wires": []
    },
    {
        "id": "a9fa0b7ede9b7ca0",
        "type": "mqtt in",
        "z": "042e35ddd4520c96",
        "name": "ACK Gate",
        "topic": "esp32/ack/gate",
        "qos": "0",
        "datatype": "auto",
        "broker": "mqtt_config",
        "inputs": 0,
        "x": 160,
        "y": 1140,
        "wires": [
            [
                "474be73be035c26c"
            ]
        ]
    },
    {
        "id": "474be73be035c26c",
        "type": "ui_text",
        "z": "042e35ddd4520c96",
        "group": "group_ack",
        "order": 1,
        "width": 6,
        "height": 1,
        "label": "Gate ACK",
        "format": "{{msg.payload}}",
        "x": 420,
        "y": 1140,
        "wires": []
    },
    {
        "id": "3d543936ce48edb2",
        "type": "mqtt in",
        "z": "042e35ddd4520c96",
        "name": "ACK Pump",
        "topic": "esp32/ack/pump",
        "datatype": "auto",
        "broker": "mqtt_config",
        "inputs": 0,
        "x": 160,
        "y": 1200,
        "wires": [
            [
                "92d9d540dee574b5"
            ]
        ]
    },
    {
        "id": "92d9d540dee574b5",
        "type": "ui_text",
        "z": "042e35ddd4520c96",
        "group": "group_ack",
        "order": 2,
        "width": 6,
        "height": 1,
        "label": "Pump ACK",
        "format": "{{msg.payload}}",
        "x": 420,
        "y": 1200,
        "wires": []
    },
    {
        "id": "ce00fd7c39e9ae56",
        "type": "mqtt in",
        "z": "042e35ddd4520c96",
        "name": "ACK Fan",
        "topic": "esp32/ack/fan",
        "datatype": "auto",
        "broker": "mqtt_config",
        "inputs": 0,
        "x": 160,
        "y": 1260,
        "wires": [
            [
                "e1eaa0907d681ae3"
            ]
        ]
    },
    {
        "id": "e1eaa0907d681ae3",
        "type": "ui_text",
        "z": "042e35ddd4520c96",
        "group": "group_ack",
        "order": 3,
        "width": 6,
        "height": 1,
        "label": "Fan ACK",
        "format": "{{msg.payload}}",
        "x": 420,
        "y": 1260,
        "wires": []
    },
    {
        "id": "b8d1fe7245142514",
        "type": "mqtt in",
        "z": "042e35ddd4520c96",
        "name": "ACK Buzzer",
        "topic": "esp32/ack/buzzer",
        "datatype": "auto",
        "broker": "mqtt_config",
        "inputs": 0,
        "x": 160,
        "y": 1320,
        "wires": [
            [
                "78e08c46384944a0"
            ]
        ]
    },
    {
        "id": "78e08c46384944a0",
        "type": "ui_text",
        "z": "042e35ddd4520c96",
        "group": "group_ack",
        "order": 4,
        "width": 6,
        "height": 1,
        "label": "Buzzer ACK",
        "format": "{{msg.payload}}",
        "x": 420,
        "y": 1320,
        "wires": []
    },
    {
        "id": "25469653008f0430",
        "type": "ui_text",
        "z": "042e35ddd4520c96",
        "group": "group_sensor",
        "order": 6,
        "width": 0,
        "height": 0,
        "name": "",
        "label": "Temp",
        "format": "{{value}}",
        "layout": "row-spread",
        "className": "",
        "style": false,
        "font": "",
        "fontSize": 16,
        "color": "#000000",
        "x": 410,
        "y": 20,
        "wires": []
    },
    {
        "id": "ddb7677188bb547d",
        "type": "ui_text",
        "z": "042e35ddd4520c96",
        "group": "group_sensor",
        "order": 7,
        "width": 0,
        "height": 0,
        "name": "",
        "label": "Hum",
        "format": "{{value}}",
        "layout": "row-spread",
        "className": "",
        "style": false,
        "font": "",
        "fontSize": 16,
        "color": "#000000",
        "x": 590,
        "y": 120,
        "wires": []
    },
    {
        "id": "b644dfea57335fa6",
        "type": "ui_text",
        "z": "042e35ddd4520c96",
        "group": "group_sensor",
        "order": 8,
        "width": 0,
        "height": 0,
        "name": "",
        "label": "WaLvl",
        "format": "{{value}}",
        "layout": "row-spread",
        "className": "",
        "style": false,
        "font": "",
        "fontSize": 16,
        "color": "#000000",
        "x": 610,
        "y": 180,
        "wires": []
    },
    {
        "id": "81d80c4957a0e89a",
        "type": "ui_text",
        "z": "042e35ddd4520c96",
        "group": "group_sensor",
        "order": 9,
        "width": 0,
        "height": 0,
        "name": "",
        "label": "ppm",
        "format": "{{value}}",
        "layout": "row-spread",
        "className": "",
        "style": false,
        "font": "",
        "fontSize": 16,
        "color": "#000000",
        "x": 610,
        "y": 300,
        "wires": []
    },
    {
        "id": "f21c7339e1dfdfb8",
        "type": "ui_text",
        "z": "042e35ddd4520c96",
        "group": "group_sensor",
        "order": 10,
        "width": 0,
        "height": 0,
        "name": "",
        "label": "pct",
        "format": "{{value}}",
        "layout": "row-spread",
        "className": "",
        "style": false,
        "font": "",
        "fontSize": 16,
        "color": "#000000",
        "x": 630,
        "y": 360,
        "wires": []
    },
    {
        "id": "mqtt_config",
        "type": "mqtt-broker",
        "name": "ESP32 Broker",
        "broker": "116.118.60.232",
        "port": "7177",
        "clientid": "nodered-basement",
        "usetls": false,
        "protocolVersion": "4",
        "keepalive": "60",
        "cleansession": true,
        "autoUnsubscribe": true
    },
    {
        "id": "group_sensor",
        "type": "ui_group",
        "name": "Sensor Data",
        "tab": "ui_tab_main",
        "order": 1,
        "disp": true,
        "width": "12",
        "collapse": false
    },
    {
        "id": "group_state",
        "type": "ui_group",
        "name": "Device States",
        "tab": "ui_tab_main",
        "order": 2,
        "disp": true,
        "width": "12",
        "collapse": false
    },
    {
        "id": "group_cmd",
        "type": "ui_group",
        "name": "Controls",
        "tab": "ui_tab_main",
        "order": 3,
        "disp": true,
        "width": "12",
        "collapse": false
    },
    {
        "id": "group_ack",
        "type": "ui_group",
        "name": "ACK Responses",
        "tab": "ui_tab_main",
        "order": 4,
        "disp": true,
        "width": "12",
        "collapse": false
    },
    {
        "id": "ui_tab_main",
        "type": "ui_tab",
        "name": "Basement Monitor",
        "icon": "dashboard",
        "disabled": false,
        "hidden": false
    },
    {
        "id": "44563797418d2186",
        "type": "global-config",
        "env": [],
        "modules": {
            "node-red-dashboard": "3.6.6"
        }
    }
]