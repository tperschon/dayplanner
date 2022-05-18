// retrieve day of last use, we use this to reset the schedule each day
var dayused = moment(JSON.parse(localStorage.getItem("dayused"))).format("MM/DD/YYYY");

// retrieve the current date/time
var today = moment();

// reset localstorage if dayused isn't today, clear localStorage if so
if (dayused !== moment(today).format("MM/DD/YYYY")) localStorage.clear();

// store current date/time in localstorage
localStorage.setItem("dayused", JSON.stringify(today));

// retrieve array of stored schedule items, if any exists
var schedule = [];
var storedSchedule = JSON.parse(localStorage.getItem("schedule"));
if (storedSchedule !== null) schedule = storedSchedule;

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
    // store elements we work with
    var savebutton = $(event.target);                   // the save button user clicked
    var textarea = savebutton.siblings().eq(1);         // the textarea sibling of the save button
    var icon = savebutton.children(0);                  // the icon of the save button
    var text = textarea.val();                          // the actual text of the textarea
    var index = textarea.attr("data-index-number");     // the index value of the textarea
    // set icon to be locked, indicating saving of data
    icon.removeClass("fa-lock-open");
    icon.addClass("fa-lock");
    // save data in textarea to localStorage
    schedule[index] = text;
    localStorage.setItem("schedule", JSON.stringify(schedule));
    var newSchedule = JSON.parse(localStorage.getItem("schedule"));
}

// loop through all textareas and set their appropriate stored content, functional for multiple-purposes
function fillSchedule() {
    for (i = 0; i < schedule.length; i++) {
        // assign textarea to container>children[i]>children[1] which is the textarea pertinent to the index of the loop
        textarea = $(".container").children().eq(i).children().eq(1);
        // set the text value to the pertinent text retrieved from localStorage, which is achieved through same loop index
        textarea.val(schedule[i]);
        // if there is a real value, set a lock on the button to show user that they don't need to manually save this
        if(schedule[i]) textarea.siblings().eq(1).children().addClass("fa-lock")
    }
}

// function to color textarea backgrounds based on if they're past, current, or future
function colorTextareas() {
    var now = moment();
    for (i = 0; i < 9; i++) {
        if (moment(now).format("HH") > (i + 9)) $(".container").children().eq(i).children().eq(1).addClass("past");
        else if (moment(now).format("HH") === (i + 9)) $(".container").children().eq(i).children().eq(1).addClass("present");
        else $(".container").children().eq(i).children().eq(1).addClass("future");
    }
}

colorTextareas();
console.log(moment(today).format("HH"))
//if (moment(today).format("HH") )
// var timer = setInterval(function() {
//     if ()
// }, 1000);

fillSchedule();