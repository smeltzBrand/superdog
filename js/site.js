// global variable. usually this is a bad idea
const events = [{
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 240000,
        date: "06/01/2017",
    },
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 250000,
        date: "06/01/2018",
    },
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 257000,
        date: "06/01/2019",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 130000,
        date: "06/01/2017",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 140000,
        date: "06/01/2018",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 150000,
        date: "06/01/2019",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 40000,
        date: "06/01/2017",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 45000,
        date: "06/01/2018",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 50000,
        date: "06/01/2019",
    },
];

// fires on load builds a drop down list of unique cities
function buildDropDown() {

    // first step is get a handle on the drop down
    let eventDD = document.getElementById("eventDropDownList");
    //reset the list
    eventDD.innerHTML = "";

    //<li><a class="dropdown-item" href="#"></a></li>

    //get the template
    let ddTemplate = document.getElementById("dropDown-template");

    //get the template node
    let ddItem = document.importNode(ddTemplate.content, true);

    // add the 'All' items to the dropdown
    let ddLink = ddItem.querySelector("a");
    ddLink.setAttribute("data-city", "All");
    ddLink.textContent = "All";
    eventDD.appendChild(ddItem);

    //add links for the unique cities
    let curEvents = getEvents();
    //get our data

    //get a distinct array of city names
    let distinctCities = [...new Set(curEvents.map((event) => event.city))];

    //filter that data to unique set of cities
    for (let i = 0; i < distinctCities.length; i++) {

        let ddItem = document.importNode(ddTemplate.content, true);

        // add the other items to the dropdown
        let ddLink = ddItem.querySelector("a");
        ddLink.setAttribute("data-city", distinctCities[i]);
        ddLink.textContent = distinctCities[i];
        eventDD.appendChild(ddItem);

    }

    //set the header
    let statsHeader = document.getElementById("statsHeader");
    statsHeader.innerHTML = `Stats for All events`;

    //show stats for all events
    displayStats(curEvents);

    //show data for all events
    displayEventData(curEvents);

}

//this is called everytime a city name is clicked in the dropdown
function getEventData(element) {
    let city = element.getAttribute("data-city");


    //create the stats for the clicked city
    let curEvents = getEvents();
    let filteredEvents = [];

    if (city != "All") {
        filteredEvents = curEvents.filter(function (item) {
            if (item.city == city) {
                return item;
            }
        });
    }

    //set the header
    let statsHeader = document.getElementById("statsHeader")
    statsHeader.innerHTML = `Stats for ${city}`;

    //Call a function to display the stats
    displayStats(filteredEvents);
}

//pull the events from local storage
function getEvents() {
    let curEvents = JSON.parse(localStorage.getItem("eventData"));

    if (curEvents === null) {
        curEvents = events;
        localStorage.setItem("eventData", JSON.stringify(curEvents));
    }


    return curEvents;
}

//this function displays stats for the selected city
function displayStats(filteredEvents) {

    let total = 0;
    let average = 0;
    let most = 0;
    let least = -1;
    let currentAttendance = 0;

    for (let i = 0; i < filteredEvents.length; i++) {

        currentAttendance = filteredEvents[i].attendance;
        total += currentAttendance;

        if (most < currentAttendance) {
            most = currentAttendance;
        }

        if (least > currentAttendance || least < 0) {
            least = currentAttendance;
        }
    }

    average = total / filteredEvents.length;

    //write my values to the page
    document.getElementById("total").innerHTML = total.toLocaleString();
    document.getElementById("most").innerHTML = most.toLocaleString();
    document.getElementById("least").innerHTML = least.toLocaleString();
    document.getElementById("average").innerHTML = average.toLocaleString(
        undefined, {
            minmumFractionDigits: 0,
            maximumFractionDigits: 0
        }
    );

}

// this function displays all of the event data in a 
//grid on bottom of page
function displayEventData(curEvents) {
    let template = document.getElementById("eventData-template");
    let eventBody = document.getElementById("eventBody");
    //clear the table to any previous data
    eventBody.innerHTML = "";

    // loop over all the eventdata and write a row for each event
    // to the eventBody element.
    for (let i = 0; i < curEvents.length; i++) {
        let eventRow = document.importNode(template.content, true);

        //grab only the columns from the template
        //creates an array of the columns in the template
        let eventCols = eventRow.querySelectorAll("td");

        eventCols[0].textContent = curEvents[i].event;
        eventCols[1].textContent = curEvents[i].city;
        eventCols[2].textContent = curEvents[i].state;
        eventCols[3].textContent = curEvents[i].attendance;
        eventCols[4].textContent = new Date(curEvents[i].date).toLocaleDateString();

        eventBody.appendChild(eventRow);
    }

}

function saveEventData() {
    //get all of the course data from localstorage
    let curEvents = getEvents();

    let eventObj = {
        event: "name",
        city: "city",
        state: "state",
        attendance: 0,
        date: "01/01/2000"
    }

    //get the values from the form
    eventObj.event = document.getElementById("newEventName").value;
    eventObj.city = document.getElementById("newEventCity").value;

    // get values from the dropdown
    let stateSel = document.getElementById("newEventState");
    eventObj.state = stateSel.options[stateSel.selectedIndex].text;
    
    // turn the input into a number
    let attendanceNbr = parseInt(document.getElementById("newEventAttendance").value,10);
    eventObj.attendance = attendanceNbr;

     //format the date before saving
    let eventDate = document.getElementById("newEventDate").value;
    let eventDateFormatted = `${eventDate} 00:00`;
    eventObj.date = new Date(eventDateFormatted).toLocaleDateString();
   
    //save
    curEvents.push(eventObj);
    localStorage.setItem("eventData", JSON.stringify(curEvents));

    buildDropDown();
}