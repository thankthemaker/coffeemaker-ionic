import { Injectable } from '@angular/core';
import { Config as AppConfig } from 'ionic-angular'
import { device } from 'aws-iot-device-sdk'
import * as log from 'loglevel';

@Injectable()
export class MQTTService {

    public client: any;

    private COMMAND_TOPIC: string = "/coffeemaker/gigax8/toCoffeemaker";
    private RESPONSE_TOPIC: string = "/coffeemaker/gigax8/fromCoffeemaker";

    constructor(private config: AppConfig) {
    }
    
    connect() {
        log.debug("connect called");
        const clientId = `coffeemaker-user-${Math.floor((Math.random() * 1000000) + 1)}`;
        this.client = new device({
            clientId: clientId,
            host: this.config.get('iot_host'),
            protocol: this.config.get('iot_protocol'),
            accessKeyId: this.config.get('iot_accessKeyId'),
            secretKey: this.config.get('iot_secretKey'),
            debug: true
        });
      }

      disconnect() {
        this.client.end();
      }

      attachDebugHandlers() {
        this.client.on('reconnect', () => {
            log.debug('reconnect');
        });
    
        this.client.on('offline', () => {
            log.debug('offline');
        });
    
        this.client.on('error', (err) => {
            log.error('iot client error', JSON.stringify(err));
        });
    
        this.client.on('message', (topic, message) => {
            //log.debug('new message', topic, JSON.parse(message.toString()));
        });
      }

      updateWebSocketCredentials(accessKeyId, secretAccessKey, sessionToken) {
        this.client.updateWebSocketCredentials(accessKeyId, secretAccessKey, sessionToken);
      }

      attachMessageHandler(onNewMessageHandler) {
        this.client.on('message', onNewMessageHandler);
      }

      attachConnectHandler(onConnectHandler) {
        this.client.on('connect', (connack) => {
            log.debug('connected', connack);
          onConnectHandler(connack);
        });
      }

      attachCloseHandler(onCloseHandler) {
        this.client.on('close', (err) => {
            log.debug('close', err);
          onCloseHandler(err);
        });
      }


      publish(topic, message) {
        this.client.publish(topic, message);
      }

      subscribe(topic) {
        this.client.subscribe(topic);
        log.debug('subscribed to topic', topic);
      }


      unsubscribe(topic) {
        this.client.unsubscribe(topic);
        log.debug('unsubscribed from topic', topic);
      }

    readCards() {
        this.publish(this.COMMAND_TOPIC, "LLL");                        
      }

      readPricelist() {
        this.publish(this.COMMAND_TOPIC, "REA");                
      }

      uploadPricelist(products: any[]) {
        var pricelist  = "CHA";
        products.map((data: any) => {
            pricelist += data.price + ",";
        });
        pricelist += "1000,"; // Add 10,00 EUR default prepaid topup amount
        //this.publish(this.COMMAND_TOPIC, "CHA100,120,120,120,120,120,140,100,100,100,1000,");
        this.publish(this.COMMAND_TOPIC, pricelist);
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

      startOTAUpdate() {
        this.publish(this.COMMAND_TOPIC, "UPDATE");                
      }

      restart() {
        this.publish(this.COMMAND_TOPIC, "RESTART");                
      }
 }
