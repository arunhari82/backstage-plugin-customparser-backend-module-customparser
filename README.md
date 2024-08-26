# @anattama/backstage-plugin-customparser-backend-module-customparser

The customparser backend module for the customparser plugin.

This plugin helps to use any other fileformat instead of Catalog-info.yaml. This shows how to build dynamic plugin module and inject with RHDH. 

This plugin module extends `catalogModelExtensionPoint` and register a customParser `backstage-plugin-customparser-backend-module-customer/src/lib/customEntityParser.ts`

### Prerequiste `yarn install`

1) Compile :

    ```
        yarn tsc
    ```

2) Build :

    ```
        yarn build
    ```
3) Export as Dynamic

    ```
        yarn export-dynamic
    ```
4) Pack and Publish
    ```
       npm pack --json > ./npminfo.json  #This file can be used to get SHA-integrity
       npm publish
    ```       

# Catalog Provider Configuration in app-config.yaml

``` 
   providers:
          gitlab:
            selfHosted:
              host: gitlab-gitlab.apps.cluster-tcdxs.tcdxs.sandbox1568.opentlc.com
              entityFilename: <<Custom file name instead of catalog-info.yaml>>
              schedule: # optional; same options as in TaskScheduleDefinition
                # supports cron, ISO duration, "human duration" as used in code
                frequency: { seconds: 10 }
                # supports ISO duration, "human duration" as used in code
                timeout: { seconds: 60 }
```

# format of the custom file in repo instead of catalog-info.yaml 
## note : This filename should match  <<Custom file name instead of catalog-info.yaml>> in the app-config.yaml configuration.

id : "sampleservice"
type: "service"
author: "user1" 


## Load this as dynamic plugin by updating the configmap

```
      - package: "@anattama/backstage-plugin-customparser-backend-module-customparser@0.1.4"
        disabled: false
        integrity: 'sha512-e4THqLFqnNjwTlh1MzdcjQwbI4PwXR4Z6it6L+PnU1OTM1pK229bj9UF5a2NTROv9D3JiqLptqQ6nhi09R8jeA=='
```        

### Update the `.npmrc` in the secret named `dynamic-plugins-npmrc` under the same namespace as devhub installation
### Once plugin register it will use this file to register the component in catalog
