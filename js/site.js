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

// builds a drop down list of unique cities
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

    // add the all item to the dropdown
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

        // add the all item to the dropdown
        let ddLink = ddItem.querySelector("a");
        ddLink.setAttribute("data-city", distinctCities[i]);
        ddLink.textContent = distinctCities[i];
        eventDD.appendChild(ddItem);

    }


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
        undefined,{
            minmumFractionDigits: 0,
            maximumFractionDigits: 0
        }
    );

}