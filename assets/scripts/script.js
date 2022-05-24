// retrieve day of last use, we use this to reset the schedule each day
var dayused = moment(JSON.parse(localStorage.getItem("dayused"))).format("MM/DD/YYYY");

// retrieve the current date/time
var today = moment();

// reset localstorage if dayused isn't today, clear localStorage if so
function clearDay() {
    if (dayused !== moment().format("MM/DD/YYYY")) {
        localStorage.clear();
        // if localStorage gets cleared, that means we need to set a new day, since this is a function and gets called later
        localStorage.setItem("dayused", JSON.stringify(moment().format("MM/DD/YYYY")));
    }
};

// store current date/time in localstorage
localStorage.setItem("dayused", JSON.stringify(today));

// initialize an empty array for later use
var schedule = [];

// set the text of date/time header to current day/month with "-day, Month nth/nst"
$("#currentDay").text(today.format("dddd, MMMM Do"));

// when an input area is changed, unlock the icon via removing fa-lock and adding fa-lock-open
$(".container").on("input propertychange", dataChanged);

// find event's target, find it's 2nd sibling, select that sibling's first child
function dataChanged(event) {
    $(event.target).siblings(1).children(0).removeClass("fa-lock");
    $(event.target).siblings(1).children(0).addClass("fa-lock-open");
};

// when a save button is clicked, save the textarea and show user it was saved
$(".saveBtn").click(saveData);

// saves data corresponding to the savebutton pressed to localstorage
function saveData(event) {
    // stops us from being navigated to top of page
    event.preventDefault();
    //// store elements we work with
    // conditional to handle of the <i> within the <a> is clicked
    if (event.target.nodeName === "I") var savebutton = $(event.target).parent();
    else var savebutton = $(event.target);              // the save button user clicked
    var textarea = savebutton.siblings().eq(1);         // the textarea sibling of the save button
    var icon = savebutton.children();                   // the icon of the save button
    var text = textarea.val();                          // the actual text of the textarea
    var index = textarea.attr("data-index-number");     // the index value of the textarea
    // set icon to be locked, indicating saving of data
    icon.removeClass("fa-lock-open");
    icon.addClass("fa-lock");
    // save data in textarea to localStorage
    schedule[index] = text;
    localStorage.setItem("schedule", JSON.stringify(schedule));
};

// loop through all textareas and set their appropriate stored content, functional for multiple-purposes
function fillSchedule() {
    // retrieve stored schedule, and if it exists, assign it to the working schedule variable
    var storedSchedule = JSON.parse(localStorage.getItem("schedule"));
    if (storedSchedule) schedule = storedSchedule;
    for (i = 0; i < schedule.length; i++) {
        // assign textarea to container>children[i]>children[1] which is the textarea pertinent to the index of the loop
        textarea = $(".container").children().eq(i).children().eq(1);
        // if there is already a value in the field (such as when this is called on hourly update) store it in schedule
        if (textarea.val()) schedule[i] = textarea.val();
        // set the text value to the pertinent text retrieved from localStorage, which is achieved through same loop index
        textarea.val(schedule[i]);
        // if there is a real value, set a lock on the button to show user that they don't need to manually save this
        if (schedule[i]) textarea.siblings().eq(1).children().addClass("fa-lock");
    }
};

// function to color textarea backgrounds based on if they're past, current, or future
function colorTextareas() {
    // new moment for if running function well after page load
    var now = moment();
    // loop through textareas
    for (i = 0; i < 9; i++) {
        // if hour corresponding to textarea has elapsed, add "past" class for css formatting takeover
        if (moment(now).format("HH") > (i + 9)) $(".container").children().eq(i).children().eq(1).addClass("past");
        // else if hour corresponding to textarea is current, add "present" class for css formatting takeover
        else if (moment(now).format("HH") == (i + 9)) $(".container").children().eq(i).children().eq(1).addClass("present");
        // else  add "future" class for css formatting takeover
        else $(".container").children().eq(i).children().eq(1).addClass("future");
    }
};

//// variables to calculate ms to hour, done as 4 variables for clarity rather than one big line of math
// how many minutes left in the current hour
var minToHour = 59 - moment().minutes();
// how many seconds left in the current minute
var secToMin = 59 - moment().seconds();
// how many milliseconds left in the current second
var msToSec = 999 - moment().milliseconds();
// add them all up, 60 seconds in a minute and 1000 milliseconds in a second
var msToHour = (minToHour * 60 * 1000) + (secToMin * 1000) + msToSec;

// after we get to the next hour, update the colors and start a recurring hourly update to the colors
setTimeout(function () {
    colorTextareas();
    autoUpdate();
}, msToHour);

// will change textarea backgrounds every hour and check if the day has changed and reset everything if it has
function autoUpdate() {
    setInterval(function () {
        colorTextareas();
        clearDay();
        fillSchedule();
    }, 60 * 60 * 1000);
};

// on page load, color text areas, clear the day if it needs to be, and fill out schedule from localstorage
// fillSchedule after clearDay so if day is cleared, we don't populate our textareas with outdated information
colorTextareas();
clearDay();
fillSchedule();