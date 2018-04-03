**Ionic3 Coffeemaker App**

This is a simple Ionic app for our version of the [coffeemaker payment system](https://github.com/thankthemaker/sharespresso). The original project used a native Android app to maintain card-IDs and the pricelist. As our Arduino sketch is based on an IoT device, we instead use this app, which exchanges messages over MQTT with the coffeemaker payment system. 

After installing the [Ionic3 CLI](https://ionicframework.com/docs/intro/installation/), just clone this repository and start a local webserver by typing

```shell
npm install
ionic serve
```

