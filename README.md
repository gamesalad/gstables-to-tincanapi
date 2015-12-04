# gstables_to_tincanapi

A sample node.js app that accepts data from the GameSalad "Network Send Table to URL" Behavior and converts it into a Tin Can API Statement.

The conversion is based on the table headers.  Each header acts like a JSON object path. Each path segment is separated by an '_'.

Let's say we have a GameSalad table with a column that has the label "actor_name".  Each row of the table represents one statement object. The first row has the value "Sally" for the column "actor_name".

The first row would translate into the following Tin Can Statement Object: 

	{
		"actor": {
			"name": "Sally"
		}
	}

This app will parse the incoming json data, convert it to a statement, add an ID and timestamp to the statement, and then log the statement to the console.

To test:

Start the server app:

	git clone git@github.com:gamesalad/gstables_to_tincanapi.git
	cd gstables_to_tincanapi
	npm install
	node inde.js
	
Load up GameSalad Creator and load the TinCanApiExample app. Hit "Preview" and you will see a big white button.  Click on the button to send data to the app.

The app assumes port 3000 is free and the example GameSalad project assumes the app can be accessed via http://localhost:3000.