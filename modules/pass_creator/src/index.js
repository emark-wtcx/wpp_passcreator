import Postmonger from 'postmonger';

const jbApp = {  
    isLocalhost:(location.hostname === 'localhost' || location.hostname === '127.0.0.1'),
    subscriber:{
        'firstname':'Dale',
        'lastname':'McConnell',
        'email':'dale.mcconnell@emark.com'
    },
    system:{
        messages:{
        'firstname':'This is message 1: {firstname}',
        'lastname':'This is message 2: {lastname}',
        'email':'This is message 3: {email}'
        }
    },
    steps:[1,2,3],  
    deStructure:{},
    parseSchema:function(){
        console.log('parseSchema')
        if (
            jbApp.hasOwnProperty('schema')
            && jbApp.schema.length>0
            ){
                console.log('schema: '+JSON.stringify(jbApp.schema))
                for (var i in jbApp.schema){
                    var schemaItem = jbApp.schema[i]
                    var fieldName = schemaItem.name
                    var fieldTag = schemaItem.key
                    jbApp.deStructure[fieldName] = '{{'+fieldTag.replace('Event','Interaction')+'}}'
                    console.log('['+fieldName+']:'+fieldTag)
                }
            }
        console.log('jbApp.deStructure: ')
        console.table(jbApp.deStructure)
        console.log('jbApp.deStructure.length: '+jbApp.deStructure.toString().length)

        if (!jbApp.isLocalhost && !!Contact){
            console.table(Contact)
        }            
    },
    getSteps:function(){   
        var returnArray = []     
        if (jbApp.hasOwnProperty('steps') && jbApp.steps.length > 0){
            for (var i in jbApp.steps){
                var number = jbApp.steps[i]
                returnArray.push('{ "label": "Step '+number+'", "key": "step'+number+'"}')
            }
        }
        return returnArray
    },
    setMenu:function(connection){
        console.log('Preparing document')
        $('.pass_action').on('click',function( elem ) {
            var html='';
            var id = $( this ).prop('id')
            console.log('Button #'+ id + ": " + $( this ).text() );
            var action = $(this).data('action');
            console.log('Action to process: '+action)
            switch(action){
    
                case 'inputMessage':
                    var html = jbApp.getHtml('inputMessage')
                    $('#home').html('Cancel').data('action','home')
                    jbApp.setProgress(33)
                    //if (jbApp.isLocalhost == false) connection.trigger('updateSteps', jbApp.getSteps(2));
                    break;
    
                case 'selectMessage':
                    var html = jbApp.getHtml('selectMessage')
    
                    $('#home').html('Cancel').data('action','home')
                    jbApp.setProgress(33)
                    //if (jbApp.isLocalhost == false) connection.trigger('updateSteps', jbApp.getSteps(2));
                    break;
    
                case 'previewMessage':
                    jbApp.previewMessageButtonAction()
                    break;
    
                case 'previewSelectMessage':
                    jbApp.previewSelectMessageButtonAction()
                    break;
                
                case 'home':
                    var html = jbApp.getHtml('home')
                    $('#home').text('Home').data('action','home')
                    jbApp.setProgress(0)
                    //if (jbApp.isLocalhost == false) connection.trigger('updateSteps', jbApp.getSteps(1));
                break;
    
                default:
                    var html = jbApp.getHtml('error')
                    break;
            }
            if (html.length){
                $('#main').html(html);
                if (action == 'selectMessage'){
                    jbApp.buildMessageOptions()
                }            
            }
            
            jbApp.setMenu(connection)           
    
        });
    },
    previewMessageButtonAction:function(){
        var blockDisplay = 'none'
        if ($('#notification_ribbon').length>0){
            var blockDisplay = 'shown'
        }    
        console.log('blockDisplay: '+blockDisplay)
        if (blockDisplay == 'none'){  
            // Show ribbon
            var ribbon = jbApp.getHtml('ribbon')
            $('#main').append(ribbon);
            
            // Transfer Message
            jbApp.transferMessage()
    
            // Make sure we can close the ribbon after presenting it
            jbApp.bindRibbonClose()
    
            //Update UI on progress
            jbApp.setProgress(66)
            //if (jbApp.isLocalhost == false) connection.trigger('updateSteps', jbApp.getSteps(2));
        }else{
            jbApp.transferMessage()
        }
    },
    previewSelectMessageButtonAction:function(){
        console.log('!previewSelectMessageButtonAction!')
        var blockDisplay = 'none'
        if ($('#notification_ribbon').length>0){
            var blockDisplay = 'shown'
        }    
        console.log('blockDisplay: '+blockDisplay)
        if (blockDisplay == 'none'){  
            // Show ribbon
            var ribbon = jbApp.getHtml('ribbon')
            $('#main').append(ribbon);
            
            // Transfer Message
            jbApp.selectMessage()
    
            // Make sure we can close the ribbon after presenting it
            jbApp.bindRibbonClose()
    
            //Update UI on progress
            jbApp.setProgress(66)
            //if (jbApp.isLocalhost == false) connection.trigger('updateSteps', jbApp.getSteps(2));
        }else{
            // Transfer Message
            jbApp.selectMessage()
            jbApp.transferMessage()
        }
    },
    transferMessage:function(){
        /**
         * Check we have the jbApp 
         */
        console.log('jbApp:')
        console.table(jbApp)
            
        /**
         * Get the message
         */
        var previewMessage = $('#pass_message').val()
    
        /**
         * Check we have the data to parse 
         */
        if (jbApp.hasOwnProperty('subscriber') && previewMessage != undefined){
            console.log('Checking data: '+JSON.stringify(jbApp.subscriber))
            
            /**
             * Loop through the attributes
             */
            for (var key in jbApp.subscriber){
                console.log('Checking key ('+key+')')
                var value = jbApp.subscriber[key]
                var keyTag = '{'+key+'}'
                console.log('Value: '+value)
                previewMessage = previewMessage.replaceAll(keyTag, value)
            }
        }
        console.log('Placing message: '+previewMessage)
        $('#modal_message').html(previewMessage)
    },
    selectMessage:function(){
        /**
         * Check we have the jbApp 
         */
        console.log('jbApp:')
        console.table(jbApp)
            
        /**
         * Get the message choice
         */
        var selectedMessage = $('#messageSelector option:selected').val()    
        console.log('selectedMessage:' + selectedMessage)
    
        /**
         * Check we have the data to parse 
         */
         var messages = jbApp.getMessageOptions()
        if (selectedMessage.length > -1 && messages.toString().length > 0){
            var previewMessage = messages[selectedMessage]
            console.log('Selected Message: '+previewMessage)
            
            /**
             * Loop through the attributes
             */
            for (var key in jbApp.subscriber){
                console.log('Checking key ('+key+')')
                var value = jbApp.subscriber[key]
                var keyTag = '{'+key+'}'
                console.log('Value: '+value)
                previewMessage = previewMessage.replaceAll(keyTag, value)
            }
        }
        console.log('Placing selected message: '+previewMessage)
        $('#modal_message').html(previewMessage)
    },
    getMessageOptions:function(){
        if (!jbApp.isLocalhost){
            return jbApp.deStructure
        }else{
            return jbApp.system.messages
        }
    },
    buildMessageOptions:function(){
        var messages = jbApp.getMessageOptions()
        console.log('Messages:')
        console.table(messages)
    
        if (messages.toString().length>0){
            var count = 0
            console.log('We have Messages:')
            for (var i in messages){
                console.log('Message#:'+i)
                count++
                var message = messages[i]
                console.log('Message:'+message)
                if (message != '' && message.length>0){
                    var option = '<option value="'+i+'">'+i+'</option>'
                    $('#messageSelector').append(option)
                }
            }
        }else{
            console.log('We have no Messages')
        }
    },
    getHtml:function(page){
        var html = jbApp.html[page]
        return html;
    },
    closeRibbon:function(){    
        console.log('remove ribbon') 
        $('.slds-notify_container').remove()
    },
    bindRibbonClose:function(){
        console.log('bind modal close')
        $('.slds-notify__close button').on('click',function(){
            jbApp.closeRibbon()
        });
    },
    setProgress:function(amount){
        console.log('Setting progress: '+amount)
        var html = '<div class="slds-progress-bar" id="progress-bar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+(100-amount)+'" aria-label="{{Placeholder for description of progress bar}}" role="progressbar">'
        html += '    <span class="slds-progress-bar__value" id="progress-val" style="width:'+amount+'%">'
        html += '        <span class="slds-assistive-text" id="progress-text">Progress: '+amount+'%</span>'
        html += '    </span>'
        html += '</div>'
        $( '#progress-holder' ).html(html)
    },
    message:null,
    html:{
        home:'<h1>Choose Activity</h1>',
        error:'<h1>An error occurred</h1>',
        inputMessage:`
        <div id="passcreator">
            <h1>Pass Creator - WPP</h1>
            <p>Please input your required message:</p>
            <div class="slds-form-element">
                <label class="slds-form-element__label" for="textarea-id-01">Textarea Label</label>
                <div class="slds-form-element__control">
                    <textarea id="pass_message" placeholder="Placeholder text…" class="slds-textarea"></textarea>
                </div>
            </div><br />
            <div class="slds-col slds-size_3-of-3">
                <button id="button1" data-action="previewMessage" class="slds-button slds-button_brand pass_action">Preview Message</button>
            </div>
        </div>
        `,
        selectMessage:`
        <div id="passcreator">
            <h1>Pass Creator - WPP</h1>
            <p>Select the required message</p>
            <div class="slds-form-element">
                <label class="slds-form-element__label" for="select-01">Select Message</label>
                <div class="slds-form-element__control">
                    <div class="slds-select_container">
                    <select class="slds-select" id="messageSelector">
                        <option value="">Select…</option>
                    </select>
                    </div>
                </div>
            </div><br />
            <div class="slds-col slds-size_3-of-3">
                <button id="button1" data-action="previewSelectMessage" class="slds-button slds-button_brand pass_action">Preview Message</button>
            </div>
        </div>
        `,
        previewMessage:`
            <div id="passcreator">
            <h1>Pass Creator - WPP</h1>
            <p>Here's what your message will look like</p>
            <div class="slds-form-element">
                <label class="slds-form-element__label" for="textarea-id-01">Textarea Label</label>
                <div class="slds-form-element__control">
                    <textarea id="pass_message" placeholder="Placeholder text…" class="slds-textarea" readonly></textarea>
                </div>
            </div>
        </div>
        `,
        modal:`<section role="dialog" tabindex="-1" aria-modal="true" aria-labelledby="modal-heading-01" class="slds-modal slds-fade-in-open">
        <div class="slds-modal__container">
        <button class="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse">
        <svg class="slds-button__icon slds-button__icon_large" aria-hidden="true">
        <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
        </svg>
        <span class="slds-assistive-text">Cancel and close</span>
        </button>
        <div class="slds-modal__header">
        <h1 id="modal-header" class="slds-modal__title slds-hyphenate">Modal header</h1>
        </div>
        <div class="slds-modal__content slds-p-around_medium" id="modal-content-id-1">
        <p id="modal_message"></p>
        </div>
        <div class="slds-modal__footer">
        <button class="slds-button slds-button_neutral" aria-label="Cancel and close">Cancel</button>
        <button class="slds-button slds-button_brand">Save</button>
        </div>
        </div>
        </section>
        <div class="slds-backdrop slds-backdrop_open" role="presentation"></div>
        `,
        ribbon:`<div class="slds-notify_container slds-is-relative" id="notification_ribbon">
        <div class="slds-notify slds-notify_toast slds-theme_success" role="status">
          <span class="slds-assistive-text">success</span>
          <span class="slds-icon_container slds-icon-utility-success slds-m-right_small slds-no-flex slds-align-top" title="Description of icon when needed">
            <svg class="slds-icon slds-icon_small" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#success"></use>
            </svg>
          </span>
          <div class="slds-notify__content">
            <h2 class="slds-text-heading_small " id="modal_message"></h2>
          </div>
          <div class="slds-notify__close">
            <button class="slds-button slds-button_icon slds-button_icon-inverse" title="Close">
              <svg class="slds-button__icon slds-button__icon_large" aria-hidden="true">
                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
              </svg>
              <span class="slds-assistive-text">Close</span>
            </button>
          </div>
        </div>
      </div>
      `,

        
    }, 
    soap:{
        getDataExtension:`
        <?xml version="1.0" encoding="UTF-8"?>
<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
    <s:Header>
        <a:Action s:mustUnderstand="1">Retrieve</a:Action>
        <a:To s:mustUnderstand="1">https://{{et_subdomain}}.soap.marketingcloudapis.com/Service.asmx</a:To>
        <fueloauth xmlns="http://exacttarget.com">{{dne_etAccessToken}}</fueloauth>
    </s:Header>
    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
            <RetrieveRequest>
                <ObjectType>DataExtension</ObjectType>
                <Properties>ObjectID</Properties>
                <Properties>CustomerKey</Properties>
                <Properties>Name</Properties>
                <Properties>IsSendable</Properties>
                <Properties>SendableSubscriberField.Name</Properties>
                <Filter xsi:type="SimpleFilterPart">
                    <Property>CustomerKey</Property>
                    <SimpleOperator>equals</SimpleOperator>
                    <Value>postman_demographics</Value>
                </Filter>
            </RetrieveRequest>
        </RetrieveRequestMsg>
    </s:Body>
</s:Envelope>
        `
    },
    getDataExtension:function(){
        console.log('getDataExtension')
        $.ajax({
            type: "POST",
            url: jbApp.webserUrl,
            contentType: "text/xml",
            dataType: "xml",
            data: jbApp.soap.getDataExtension,
            success: jbApp.soapSuccess(),
            error: jbApp.soapError(),
            done:parseSoapResponse( response, request, settings )
        });
    },

    parseSoapResponse:function( response, request, settings ){
        console.table(response)
    },

    soapSuccess:function (data, status, req) {
        console.log('SuccessOccur')
        if (status == "success")
            alert(req.responseText);
    },

    soapError:function(data, status, req) {
        console.log('ErrorOccur')
        alert(req.responseText + " " + status);
    },
    
    load:function(connection){
        console.log('Loading jbApp')
        // If JourneyBuilder available
        if (connection){            
            console.log('App input:')
            console.table(connection)
            // Inherit properties from JourneyBuilder
            if (connection.hasOwnProperty('version')){
                jbApp.Version = connection.version 
            }
            connection.trigger('requestTokens');
        }        

        /**
         *  Setup 
         * */
        jbApp.setMenu(connection)


        // Announce ready
        console.log('App Loading Complete')
        /*
        if (!jbApp.isLocalhost){window.parent.postMessage(jbApp)}
        else{window.jbApp = jbApp}
        */
       window.jbApp = jbApp
    }
}

// Create a new connection for this session.
// We use this connection to talk to Journey Builder. You'll want to keep this
// reference handy and pass it into your UI framework if you're using React, Angular, Vue, etc.
const connection = new Postmonger.Session();

// we'll store the activity on this variable when we receive it
let activity = null;

// Wait for the document to load before we doing anything
document.addEventListener('DOMContentLoaded', function main() {

    // Setup a test harness so we can interact with our custom activity
    // outside of journey builder using window functions & browser devtools.
    // This isn't required by your activity, its for example purposes only
    setupExampleTestHarness();

    // setup our ui event handlers
    setupEventHandlers();

    // Bind the initActivity event...
    // Journey Builder will respond with "initActivity" after it receives the "ready" signal
    connection.on('initActivity', onInitActivity);


    // We're all set! let's signal Journey Builder
    // that we're ready to receive the activity payload...

    // Tell the parent iFrame that we are ready.
    connection.trigger('ready');

    connection.trigger('requestTokens');
    connection.on('requestedTokens', function (data) {
        // save schema
        console.log('*** Data ***', JSON.stringify(data));
        console.log('*** Tokens ***', JSON.stringify(data['token']));
        jbApp.token = data['token']
     });
    console.log('connection:')
    console.table(connection)

    connection.trigger('requestSchema');
    connection.on('requestedSchema', function (data) {
        // save schema
        console.log('*** Schema ***', JSON.stringify(data['schema']));
        jbApp.schema = data['schema']
        jbApp.parseSchema()
     });
});

// this function is triggered by Journey Builder via Postmonger.
// Journey Builder will send us a copy of the activity here
function onInitActivity(payload) {

    // set the activity object from this payload. We'll refer to this object as we
    // modify it before saving.
    activity = payload;

    const hasInArguments = Boolean(
        activity.arguments &&
        activity.arguments.execute &&
        activity.arguments.execute.inArguments &&
        activity.arguments.execute.inArguments.length > 0
    );

    const inArguments = hasInArguments ? activity.arguments.execute.inArguments : [];

    console.log('-------- triggered:onInitActivity({obj}) --------');
    console.log('activity:\n ', JSON.stringify(activity, null, 4));
    console.log('Has In Arguments: ', hasInArguments);
    console.log('inArguments', inArguments);
    console.log('-------------------------------------------------');

    // check if this activity has an incoming argument.
    // this would be set on the server side when the activity executes
    // (take a look at execute() in ./discountCode/app.js to see where that happens)
    const discountArgument = inArguments.find((arg) => arg.discount);

    console.log('Discount Argument', discountArgument);

    // if a discountCode back argument was set, show the message in the view.
    if (discountArgument) {
        selectPassActivity(discountArgument.discount);
    }

    // if the discountCode back argument doesn't exist the user can pick
    // a discountCode message from the drop down list. the discountCode back arg
    // will be set once the journey executes the activity
    jbApp.load(connection)
    window.jbApp = jbApp
    return jbApp
}

function onDoneButtonClick() {
    // we set must metaData.isConfigured in order to tell JB that
    // this activity is ready for activation
    activity.metaData.isConfigured = true;

    // get the option that the user selected and save it to
    const select = document.getElementById('pass_creator');
    const option = select.options[select.selectedIndex];

    activity.arguments.execute.inArguments = [{
        discount: option.value,
    }];

    // you can set the name that appears below the activity with the name property
    activity.name = `Issue ${activity.arguments.execute.inArguments[0].discount}% Code`;

    console.log('------------ triggering:updateActivity({obj}) ----------------');
    console.log('Sending message back to updateActivity');
    console.log('saving\n', JSON.stringify(activity, null, 4));
    console.log('--------------------------------------------------------------');

    connection.trigger('updateActivity', activity);
}

function onCancelButtonClick() {
    // tell Journey Builder that this activity has no changes.
    // we wont be prompted to save changes when the inspector closes
    connection.trigger('setActivityDirtyState', false);

    // now request that Journey Builder closes the inspector/drawer
    connection.trigger('requestInspectorClose');
}

function onPassActivityChosen(elem) {
    // enable or disable the done button when the select option changes
    const select = document.getElementById('pass_activity');

    if (select.innerHTML) {
        document.getElementById('done').removeAttribute('disabled');
    } else {
        document.getElementById('done').setAttribute('disabled', '');
    }

    // let journey builder know the activity has changes
    connection.trigger('setActivityDirtyState', true);
}

function selectPassActivity(value) {
    const elem = document.getElementById('pass_activity');
    onPassActivityChosen(elem);
}

function setupEventHandlers() {
    // Listen to events on the form
    document.getElementById('done').addEventListener('click', onDoneButtonClick);
    document.getElementById('cancel').addEventListener('click', onCancelButtonClick);
    document.getElementById('pass_activity').addEventListener('click', selectPassActivity);
}

// this function is for example purposes only. it sets ups a Postmonger
// session that emulates how Journey Builder works. You can call jb.ready()
// from the console to kick off the initActivity event with a mock activity object
function setupExampleTestHarness() {

    const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    if (!isLocalhost) {
        // don't load the test harness functions when running in Journey Builder
        return;
    }

    const jbSession = new Postmonger.Session();
    const jb = {};
    window.jb = jb;

    jbSession.on('setActivityDirtyState', function(value) {
        console.log('[echo] setActivityDirtyState -> ', value);
    });
    // Cancel Button
    jbSession.on('requestInspectorClose', function() {
        console.log('[echo] requestInspectorClose');        
        var html = getHtml('selectMessage')
        setProgress(0)
        $('#home').text('Home')
        $('#main').html(html)
    });

    jbSession.on('updateActivity', function(activity) {
        console.log('[echo] updateActivity -> ', JSON.stringify(activity, null, 4));
    });

    jbSession.on('ready', function() {  
        var jsThis = jbSession;      
        console.log('[echo] ready');
        console.log('\tuse jb.ready() from the console to initialize your activity')
        jbApp.load(jsThis);
    });

    // fire the ready signal with an example activity
    jb.ready = function() {
        jbSession.trigger('initActivity', { 
            name: 'Pass Creator',
            key: 'PassCreator',
            metaData: {},
            configurationArguments: {},
            arguments: {
                executionMode: "{{Context.ExecutionMode}}",
                definitionId: "{{Context.DefinitionId}}",
                activityId: "{{Activity.Id}}",
                contactKey: "{{Context.ContactKey}}",
                execute: {
                    inArguments: [
                        {
                        "emailAddress": "{{InteractionDefaults.Email}}"
                        },
                        {
                        "phoneNumber": "{{Contact.Default.PhoneNumber}}"
                        }
                    ],
                    outArguments: []
                },
                startActivityKey: "{{Context.StartActivityKey}}",
                definitionInstanceId: "{{Context.DefinitionInstanceId}}",
                requestObjectId: "{{Context.RequestObjectId}}",
                wizardSteps: [
                    jbApp.getSteps(1)
                ]
            }
        });
    };
}

function showPushMessageConfig(action){    
    console.log('Show the Push Message Configuration Screen '+action)
}