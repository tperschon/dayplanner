// retrieve the current date/time
today = moment();
// set the text of date/time header to current day/month with "-day, Month nth/nst"
$("#currentDay").text(today.format("dddd, MMMM Do"));