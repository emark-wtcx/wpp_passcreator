module.exports = function configJSON(req) {
  return {
    workflowApiVersion: '1.1',
    metaData: {
      // the location of our icon file
      icon: `images/pass_creator.png`,
      category: 'messages',
      isConfigured:false,
      configOnDrop:true
    },
    // For Custom Activity this must say, "REST"
    type: 'REST',
    // Translation Setup
    lang: {
      'en-GB': {
        name: 'Pass Creator',
        description: 'WPP Integration for Pass Creator',
        selectType:'Select Input Type',
        configureMessage:'Configure Your Message',
        confirm:'Confirm',
      }
    },
    arguments: {
      execute: {
        // See: https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/how-data-binding-works.htm
        inArguments: [
          {"contactIdentifier": "{{Contact.Key}}"},
          {"emailAddress": "{{InteractionDefaults.Email}}"},
          {"message":""}
        ],
        outArguments: [],
        // Fill in the host with the host that this is running on.
        // It must run under HTTPS
        url: `https://eol3vy07fc9qzyh.m.pipedream.net`,
        verb: "POST",
        method: "POST",
        format: "json",
        useJwt: false,
        // The amount of time we want Journey Builder to wait before cancel the request. Default is 60000, Minimal is 1000
        timeout: 10000,
        // how many retrys if the request failed with 5xx error or network error. default is 0
        retryCount: 3,
        // wait in ms between retry.
        retryDelay: 1000,
        // The number of concurrent requests Journey Builder will send all together
        concurrentRequests: 5
      }
    },
    configurationArguments: {
      publish: {
        url: ``
      },
      validate: {
        url: ``
      },
      stop: {
        url: ``
      }
    },
    wizardSteps: [
      {
        "label": "Select Type",
        "key": "selectType"
      },
      {
        "label": "Configure Message",
        "key": "configureMessage"
      },
      {
        "label": "Confirm",
        "key": "confim"
      },
    ],    
    userInterfaces: {
      configurationSupportsReadOnlyMode : true,
      configInspector: {
        size: 'scm-lg',
        emptyIframe: true
      }
    },
    schema: {
      arguments: {
        execute: {
          inArguments: [
            {
              "message":{
                "dataType": "text",
                "isNullable": false,
                "direction": "in"
                }
            },
            {
              "emailAddress": {
                "dataType": "Email",
                "isNullable": false,
                "direction": "in"
              }
            }
          ],
          outArguments: []
        }
      }
    }
  };
};
