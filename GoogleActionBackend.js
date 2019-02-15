// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use strict";

const {
  dialogflow,
  BasicCard,
  Permission,
  Suggestions
} = require("actions-on-google");

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent("Default Welcome Intent", conv => {
  conv.user.storage = {};
  const name = conv.user.storage.userName;
  if (!name) {
    // Asks the user's permission to know their name, for personalization.
    conv.ask(
      new Permission({
        context: "Hi there, to get to know you better",
        permissions: ['NAME', 'DEVICE_PRECISE_LOCATION']
      })
    );
  } else {
    conv.ask(`Hi again, ${name}. What's your favorite color?`);
  }
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent("actions_intent_PERMISSION", (conv, params, permissionGranted) => {
  if (!permissionGranted) {
    // If the user denied our request, go ahead with the conversation.
    conv.ask(`OK, no worries. What's your favorite color?`);
    conv.ask(new Suggestions("Blue", "Red", "Green"));
  } else {
    // If the user accepted our request, store their name in
    // the 'conv.user.storage' object for the duration of the conversation.
    conv.user.storage.userName = conv.user.name.display;
    var location = conv.device.location.coordinates;
    // Call DynamoDB to add the item to the table
    conv.ask(
      `Thanks, ${conv.user.storage.userName}. You are currnetly at ${location.latitude} ${location.longitude}`
    );
    console.log("location is: "+location)
  }
});

app.intent("ContactNameIntent",(conv,{number}) => {
  conv.ask(`Thanks for providing number.`);
});


app.intent("actions_intent_NO_INPUT", conv => {
  // Use the number of reprompts to vary response
  const repromptCount = parseInt(conv.arguments.get("REPROMPT_COUNT"));
  if (repromptCount === 0) {
    conv.ask("Which color would you like to hear about?");
  } else if (repromptCount === 1) {
    conv.ask(`Please say the name of a color.`);
  } else if (conv.arguments.get("IS_FINAL_REPROMPT")) {
    conv.close(
      `Sorry we're having trouble. Let's ` + `try this again later. Goodbye.`
    );
  }
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = app;
