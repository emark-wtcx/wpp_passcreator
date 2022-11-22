// JOURNEY BUILDER CUSTOM ACTIVITY - discountCode ACTIVITY
// ````````````````````````````````````````````````````````````
// This example demonstrates a custom activity that utilizes an external service to generate
// a discount code where the user inputs the discount percent in the configuration.
//
// Journey Builder's Postmonger Events Reference can be found here:
// https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-app-development.meta/mc-app-development/using-postmonger.htm


// Custom activities load inside an iframe. We'll use postmonger to manage
// the cross-document messaging between Journey Builder and the activity
import Postmonger from 'postmonger';

const app = {   
    message:null,
    pages:{
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
                    <select class="slds-select" id="select-01">
                        <option value="">Select…</option>
                        <option>Option One</option>
                        <option>Option Two</option>
                        <option>Option Three</option>
                    </select>
                    </div>
                </div>
            </div><br />
            <div class="slds-col slds-size_3-of-3">
                <button id="button1" data-action="previewMessage" class="slds-button slds-button_brand pass_action">Preview Message</button>
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
        ribbon:`<div class="slds-notify_container slds-is-relative">
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
    load:function(input){
        console.log('Loading app')
        // If JourneyBuilder available
        if (input){            
            console.log('App input:')
            console.table(input)
            // Inherit properties from JourneyBuilder
            if (input.hasOwnProperty('version')){
                app.Version = input.version 
            }
        }        

        /**
         *  Setup 
         * */
        setMenu()



        // Announce ready
        console.log('App Loading Complete')
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
        var html = getPage('selectMessage')
        setProgress(0)
        $('#home').text('Home')
        $('#main').html(html)
    });

    jbSession.on('updateActivity', function(activity) {
        console.log('[echo] updateActivity -> ', JSON.stringify(activity, null, 4));
    });

    jbSession.on('ready', function() {  
        var jsThis = this;      
        console.log('[echo] ready');
        console.log('\tuse jb.ready() from the console to initialize your activity')
        app.load(jsThis);
    });

    // fire the ready signal with an example activity
    jb.ready = function() {
        jbSession.trigger('initActivity', { 
            name: '',
            key: 'Pass Creator',
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
                            discount: 10
                        }
                    ],
                    outArguments: []
                },
                startActivityKey: "{{Context.StartActivityKey}}",
                definitionInstanceId: "{{Context.DefinitionInstanceId}}",
                requestObjectId: "{{Context.RequestObjectId}}"
            }
        });
    };
}



function setMenu(){
    console.log('Preparing document')
    $('.pass_action').on('click',function( elem ) {
        var html='';
        var id = $( this ).prop('id')
        console.log('Button #'+ id + ": " + $( this ).text() );
        var action = $(this).data('action');
        console.log('Action to process: '+action)
        switch(action){
            case 'inputMessage':
                var html = getPage('inputMessage')
                setProgress(33)
                $('#home').text('Cancel').data('action','home')
            break;
            case 'selectMessage':
                var html = getPage('selectMessage')
                setProgress(33)
                $('#home').text('Cancel').data('action','home')
            break;
            case 'previewMessage':
                var previewMessage = $('#pass_message').val()
                var preview = getPage('ribon')
                $('#main').append(preview);
                setProgress(66)
                $('#home').text('back').data('action','back').prop('href','javascript:history.go(-1)')
            break;
            
            case 'home':
                var html = getPage('home')
                setProgress(0)
                $('#home').text('Home').data('action','home')
            break;
            default:
                var html = getPage('error')
                break;
        }
        if (html.length){
            $('#main').html(html);
            if (action == 'previewMessage'){                
                $('#modal_message').val(previewMessage)
            }
            setMenu()
        }
        
    });
}

function setProgress(amount){
    console.log('Setting progress: '+amount)
    var html = '<div class="slds-progress-bar" id="progress-bar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+(100-amount)+'" aria-label="{{Placeholder for description of progress bar}}" role="progressbar">'
    html += '    <span class="slds-progress-bar__value" id="progress-val" style="width:'+amount+'%">'
    html += '        <span class="slds-assistive-text" id="progress-text">Progress: '+amount+'%</span>'
    html += '    </span>'
    html += '</div>'
    
    $( '#progress-holder' ).html(html)
}

function getPage(page){
    var html = app.pages[page]
    return html;
}

function showPushMessageConfig(action){    
    console.log('Show the Push Message Configuration Screen '+action)
}