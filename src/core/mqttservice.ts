import {Injectable} from '@angular/core';

declare let MqttClient: any;

@Injectable()
export class MQTTService {

    public _client: any;

    public _connected: boolean = false;

    public _prefix: string = 'application';
    public _callbacks: any = [];

    private COMMAND_TOPIC: string = "/coffeemaker/gigax8/toCoffeemaker";

    constructor() {}

    /**
     * Connect to MQTT broker
     *
     * @param callback
     */
    public connect(callback?: Function): void {

        if (typeof callback !== 'function') {
            callback = (err) => {
                if (err) console.log(`MQTTService::connect: ${err}`);
            };
        }

        this._client = new MqttClient({
            host: 'mqtt.thank-the-maker.org',
            port: 9001,
            username: 'dgey',
            password: 'test'
        });

        this._client.on('connect', () => {

            console.log('mqtt connected');

            this._connected = true;

            this._client.subscribe(`/#`);

            callback();
        });

        this._client.on('message', (topic, message) => {

            message = message.toString();

            console.log(`${topic} ${message}`);

            try {
                message = JSON.parse(message);
            } catch (err) {
                // Do nothing
            }

            // notify subscribers
            this._callbacks.forEach(callbackEntry => {

                if (callbackEntry.topic === topic) {

                    callbackEntry.callback(topic, message);
                }
            });
        });

        this._client.on('error', error => {
            console.log(error);
        });

        this._client.on('disconnect', () => {

            this._connected = false;

            this._callbacks = [];

            console.log('disconnect');
        });

        this._client.on('offline', () => {

            this._connected = false;

            this._callbacks = [];

            console.log('offline');
        });

        this._client.connect();
    }

    public disconnect(callback?: Function): void {

        if (typeof callback !== 'function') {
            callback = (err) => {
                if (err) console.log(`MQTTService::disconnect: ${err}`);
            };
        }

        if (!this._connected) {
            return callback();
        }

        this._client.disconnect();

        this._callbacks = [];

        callback();
    }

    publish(topic: string, message: string, options?: any) {

        console.log('publish: ' + topic + ', ' + message);
        this._client.publish(topic, message, options);
    }

    subscribe(topic, callback) {

        this._callbacks.push({
            topic: topic,
            callback: callback
        });
    }

    readCards() {
        this.publish(this.COMMAND_TOPIC, "LLL");                        
      }

      readPricelist() {
        this.publish(this.COMMAND_TOPIC, "REA");                
      }

      uploadPricelist() {
        this.publish(this.COMMAND_TOPIC, "CHA100,120,120,120,120,120,140,100,100,100,1000,");
      }

      registerNewCards() {
        this.publish(this.COMMAND_TOPIC, "RRR");        
      }

      deleteCard(card_id: string) {
        this.publish(this.COMMAND_TOPIC, "DDD" + card_id);                
      }

      chargeCard(card_id: string, amount: string){
        this.publish(this.COMMAND_TOPIC, "CCC" + card_id);                        
      }

      inkassoModeOn() {
        //ON
        this.publish(this.COMMAND_TOPIC, "?M3");                
      }

      inkassoModeOff() {
        //OFF
        this.publish(this.COMMAND_TOPIC, "?M1");                
      }
}
