angular.module('app.data', []).value('data', {

	"scale": [0, 1, 2, 3, 5, 8, 13, 21, "#@?!", "really?"], 

	"difficulties": [
		{ "name": "easy", "multiple": 0.25 }, 
		{ "name": "normal", "multiple": 1 }, 
		{ "name": "hard", "multiple": 1.75 }, 
		{ "name": "inferno", "multiple": 3 }
	], 

	"groups": [
		{
			"name": "UI", 
			"items": [
				{ "name": "JSP/Action", "weight": 0.4 }, 
				{ "name": "Legacy page", "weight": 0.4 }, 
				{ "name": "JavaScript", "weight": 0.4 }, 
				{ "name": "CSS", "weight": 0.3 }, 
				{ "name": "Text/Image", "weight": 0.2 }, 
				{ "name": "Flash integration", "weight": 0.7 }, 
				{ "name": "FTL component", "weight": 0.5 }, 
				{ "name": "Browser compatibility", "weight": 0.8 }, 
				{ "name": "Performance analysis", "weight": 0.8 }, 
				{ "name": "Spike", "weight": 1 }
			]
		}, 

		{
			"name": "Service", 
			"items": [
				{ "name": "Service code", "weight": 0.7 },
				{ "name": "Engine code", "weight": 0.8 }, 
				{ "name": "Transaction code", "weight": 1 }, 
				{ "name": "CashEdge code", "weight": 0.8 }, 
				{ "name": "JUnit", "weight": 0.4 }, 
				{ "name": "Performance analysis", "weight": 0.8 }, 
				{ "name": "Spike", "weight": 1 }
			]
		}, 

		{
			"name": "DB", 
			"items": [
				{ "name": "Hibernate mapping", "weight": 0.6 },
				{ "name": "Table/Schema change", "weight": 0.4 }, 
				{ "name": "SQL", "weight": 0.6 }, 
				{ "name": "DS calls", "weight": 0.7 }, 
				{ "name": "Performance analysis", "weight": 0.8 }, 
				{ "name": "Spike", "weight": 1 }
			]
		}, 

		{
			"name": "QA", 
			"items": [
				{ "name": "Selenium scripting", "weight": 0.7 },
				{ "name": "TestComplete scripting", "weight": 0.7 }, 
				{ "name": "Manual testing", "weight": 0.3 }, 
				{ "name": "User setup", "weight": 0.8 }, 
				{ "name": "Environment setup", "weight": 0.8 }, 
				{ "name": "Tidal job", "weight": 0.6 }
			]
		}
	]
});