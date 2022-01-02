"use strict";
//
//  places.js
//
//  Created by Alezia Kurdis, January 1st, 2022.
//  Copyright 2022, ??? contributors.
//
//  Generate an explore app based on the differents source of placename data.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
(function() {
    var jsMainFileName = "places.js";
    var ROOT = Script.resolvePath('').split(jsMainFileName)[0];
    var METAVERSE_PLACE_API_URL = "https://metaverse.vircadia.com/live/api/v1/places";
    
    var placesHttpRequest = null;
    var placesData;
    var portalList = [];
    var percentProtocolRejected = 0;
    
    var APP_NAME = "PLACES";
    var APP_URL = ROOT + "places.html";
    var APP_ICON_INACTIVE = ROOT + "icons/appicon_i.png";
    var APP_ICON_ACTIVE = ROOT + "icons/appicon_a.png";
    var appStatus = false;
    var channel = "com.vircadia.places"; //ADJUST ###########################################################################    

    var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");

    tablet.screenChanged.connect(onScreenChanged);

    var button = tablet.addButton({
        text: APP_NAME,
        icon: APP_ICON_INACTIVE,
        activeIcon: APP_ICON_ACTIVE,
        sortOrder: 8
    });
    
    var timestamp = 0;
    var INTERCALL_DELAY = 3000; //3 sec
    var PERSISTENCE_ORDERING_CYCLE = 5 * 24 * 3600 * 1000; //5 days
    
    function clicked(){
        if (appStatus === true) {
            tablet.webEventReceived.disconnect(onMoreAppWebEventReceived);
            tablet.gotoHomeScreen();
            appStatus = false;
        } else {
            tablet.gotoWebScreen(APP_URL);
            tablet.webEventReceived.connect(onMoreAppWebEventReceived);
            appStatus = true;
        }

        button.editProperties({
            isActive: appStatus
        });
    }

    button.clicked.connect(clicked);


    function onMoreAppWebEventReceived(message) {
        var d = new Date();
        var n = d.getTime();
        
        var messageObj = JSON.parse(message);
        if (messageObj.channel === channel) {
            if (messageObj.action === "READY_FOR_CONTENT" && (n - timestamp) > INTERCALL_DELAY) {
                d = new Date();
                timestamp = d.getTime();
                transmitPortalList();

                sendCurrentLocationToUI();
                
            } else if (messageObj.action === "TELEPORT" && (n - timestamp) > INTERCALL_DELAY) {
                d = new Date();
                timestamp = d.getTime();

                if (messageObj.address.length > 0) {
                    Window.location = messageObj.address;
                }                
                
            } else if (messageObj.action === "GO_HOME" && (n - timestamp) > INTERCALL_DELAY) {
                if (LocationBookmarks.getHomeLocationAddress()) {
                    location.handleLookupString(LocationBookmarks.getHomeLocationAddress());
                } else {
                    location.goToLocalSandbox();
                }                
            } else if (messageObj.action === "GO_BACK" && (n - timestamp) > INTERCALL_DELAY) {
                location.goBack();
            } else if (messageObj.action === "GO_FORWARD" && (n - timestamp) > INTERCALL_DELAY) {
                location.goForward();
            }
        }
    }

    function onHostChanged(host) {
        sendCurrentLocationToUI();
    }

    location.hostChanged.connect(onHostChanged);
    
    function sendCurrentLocationToUI() {
        var currentLocationMessage = {
            "channel": channel,
            "action": "CURRENT_LOCATION",
            "data": location.href
        };

        tablet.emitScriptEvent(currentLocationMessage);        
    }
    
    function onScreenChanged(type, url) {
        if (type == "Web" && url.indexOf(APP_URL) != -1) {
            appStatus = true;
        } else {
            appStatus = false;
        }
        
        button.editProperties({
            isActive: appStatus
        });
    }

    function transmitPortalList() {
        portalList = [];
        getPlacesContent(METAVERSE_PLACE_API_URL + "?status=online" + "&acash=" + Math.floor(Math.random() * 999999));
    };
    
    function getPlacesContent(apiUrl) {
        placesHttpRequest = new XMLHttpRequest();
        placesHttpRequest.requestComplete.connect(placesGetResponseStatus);
        placesHttpRequest.open("GET", apiUrl);
        placesHttpRequest.send();
    }

    function placesGetResponseStatus() {
        if (placesHttpRequest.status === 200) {
            placesData = placesHttpRequest.responseText;
            try {
                placesData = JSON.parse(placesHttpRequest.responseText);
            } catch(e) {
                placesData = {};
            }
        }
        
        placesHttpRequest.requestComplete.disconnect(placesGetResponseStatus);
        placesHttpRequest = null;
        
        processData();
        
        var warning = "";
        if (percentProtocolRejected > 50) {
            warning = "WARNING: " + percentProtocolRejected + "% of the places are not listed because they are running under a different protocol. Maybe consider to upgrade.";
        }

        var message = {
            "channel": channel,
            "action": "PLACE_DATA",
            "data": portalList,
            "warning": warning
        };

        tablet.emitScriptEvent(message);
    }
    
    function processData(){
        var supportedProtocole = Window.protocolSignature();
        percentProtocolRejected = 0;
        var nbrPlacesNoProtocolMatch = 0;    
        var places = placesData.data.places;
        for (var i = 0;i < places.length; i++) {

            var category, accessStatus, eventTypeDescription;
            
            var description = (places[i].description ? places[i].description : "");
            var thumbnail = (places[i].thumbnail ? places[i].thumbnail : "");

            if ( places[i].domain.protocol_version === supportedProtocole ) {
                  

                    if ( thumbnail.substr(0, 4).toLocaleLowerCase() !== "http") {
                        category = "O"; //Other
                    } else {
                        category = "A"; //Attraction                        
                    }
                    
                    eventTypeDescription = places[i].eventTypeDescription;
                    
                    if (places[i].domain.num_users > 0) {
                        if (places[i].domain.num_users >= places[i].domain.capacity && places[i].domain.capacity !== 0) {
                            accessStatus = "FULL";
                        } else {
                            accessStatus = "LIFE";
                        }
                    } else {
                        accessStatus = "NOBODY";
                    }                 

                    var portal = {
                        "order": category + "_" + getSeededRandomForString(places[i].id),
                        "category": category,
                        "accessStatus": accessStatus,
                        "name": places[i].name,
                        "description": description,
                        "thumbnail": thumbnail,
                        "maturity": places[i].maturity,
                        "address": places[i].address,
                        "current_attendance": places[i].domain.num_users,
                        "id": places[i].id,
                        "visibility": places[i].visibility,
                        "capacity": places[i].domain.capacity,
                        "tags": getListFromArray(places[i].tags),
                        "managers": getListFromArray(places[i].managers),
                        "domain": places[i].domain.name,
                        "domainOrder": aplphabetize(zeroPad(places[i].domain.num_users, 6)) + "_" + places[i].domain.name + "_" + places[i].name
                    };
                    portalList.push(portal);

            } else {
                nbrPlacesNoProtocolMatch++;
            }
        }
        
        percentProtocolRejected = Math.floor((nbrPlacesNoProtocolMatch/places.length) * 100);
        
        var localHostPortal = {
            "order": "Z_AAAAAA",
            "category": "Z",
            "accessStatus": "NOBODY",
            "name": "localhost",
            "description": "",
            "thumbnail": "",
            "maturity": "unrated",
            "address": "localhost",
            "current_attendance": 0,
            "id": "",
            "visibility": "open",
            "capacity": 0,
            "tags": "",
            "managers": "",
            "domain": "",
            "domainOrder": "ZZZZZZZZZZZZZZA"
        };
        portalList.push(localHostPortal);

        var tutorialPortal = {
            "order": "Z_AAAAAZ",
            "category": "Z",
            "accessStatus": "NOBODY",
            "name": "tutorial",
            "description": "",
            "thumbnail": "",
            "maturity": "unrated",
            "address": "file:///~/serverless/tutorial.json",
            "current_attendance": 0,
            "id": "",
            "visibility": "open",
            "capacity": 0,
            "tags": "",
            "managers": "",
            "domain": "",
            "domainOrder": "ZZZZZZZZZZZZZZZ"
        };
        portalList.push(tutorialPortal);
        
        portalList.sort(sortOrder);
    }

    function aplphabetize(num) {
        var numbstring = num.toString();
        var newChar = "JIHGFEDCBA";
        var refChar = "0123456789";
        var processed = "";
        for (var j=0; j < numbstring.length; j++) {
            processed = processed + newChar.substr(refChar.indexOf(numbstring.charAt(j)),1);
        }
        return processed;
    }

    function getListFromArray(dataArray) {
        var dataList = "";
        if (dataArray !== undefined && dataArray.length > 0) {
            for (var k = 0; k < dataArray.length; k++) {
                if (k !== 0) {
                    dataList += ", "; 
                }
                dataList += dataArray[k];
            }
            if (dataArray.length > 1){
                dataList += ".";
            }
        }
        
        return dataList;
    }

    function sortOrder(a, b) {
        var orderA = a.order.toUpperCase();
        var orderB = b.order.toUpperCase();
        if (orderA > orderB) {
            return 1;    
        } else if (orderA < orderB) {
            return -1;
        }
        if (a.order > b.order) {
            return 1;    
        } else if (a.order < b.order) {
            return -1;
        }
        return 0;
    }

    function zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }

    function getFrequentPlaces(list) {
        var count = {};
        list.forEach(function(list) {
            count[list] = (count[list] || 0) + 1;
        });
        return count;
    }

    //####### seed random library ################
    Math.seed = 75;

    Math.seededRandom = function(max, min) {
        max = max || 1;
        min = min || 0;
        Math.seed = (Math.seed * 9301 + 49297) % 233280;
        var rnd = Math.seed / 233280;
        return min + rnd * (max - min);
    }

    function getStringScore(str) {
        var score = 0;
        for (var j = 0; j < str.length; j++){
            score += str.charAt(j).charCodeAt(0) + 1;
        }
        return score;
    }

    function getSeededRandomForString(str) {
        var score = getStringScore(str);
        var d = new Date();
        var n = d.getTime();
        var currentSeed = Math.floor(n / PERSISTENCE_ORDERING_CYCLE);
        Math.seed = score * currentSeed;
        return zeroPad(Math.floor(Math.seededRandom() * 100000),5);
    }
    //####### END of seed random library ################

    function cleanup() {

        if (appStatus) {
            tablet.gotoHomeScreen();
            tablet.webEventReceived.disconnect(onMoreAppWebEventReceived);
        }

        tablet.screenChanged.disconnect(onScreenChanged);
        tablet.removeButton(button);
    }

    Script.scriptEnding.connect(cleanup);
}());
