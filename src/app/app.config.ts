import { Injectable } from '@angular/core'
import * as log from 'loglevel';

declare const aws_cognito_region
declare const aws_user_pools_id
declare const aws_user_pools_web_client_id
declare const aws_cognito_identity_pool_id
declare const aws_cloud_logic_custom
declare const aws_iot_host
declare const aws_iot_protocol
declare const aws_iot_accessKeyId
declare const aws_iot_secretKey


@Injectable()
export class AwsConfig {
  public load () {
    log.debug("Config" + aws_cloud_logic_custom)
    let aws_cloud_logic_custom_obj = JSON.parse(aws_cloud_logic_custom)
    log.debug("Config_Obj" + aws_cloud_logic_custom_obj)
    return {
      'region': aws_cognito_region, // region you are deploying (all lower caps, e.g: us-east-1)
      'userPoolId': aws_user_pools_id, // your user pool ID
      'appId': aws_user_pools_web_client_id, // your user pool app ID
      'idpURL': `cognito-idp.${aws_cognito_region}.amazonaws.com`, // cognito idp url
      'identityPool': aws_cognito_identity_pool_id, // your federated identity pool ID
      'iot_host': aws_iot_host,
      'iot_protocol': aws_iot_protocol,
      'iot_accessKeyId': aws_iot_accessKeyId,
      'iot_secretKey': aws_iot_secretKey,
      'APIs': aws_cloud_logic_custom_obj.reduce((m, v) => { m[v.name] = v.endpoint; return m }, {})
    }
  }
}
