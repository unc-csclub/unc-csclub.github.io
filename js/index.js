// A list of the content contaiers we can swap between, and the buttons that operate them
views = ["#card-container", "#about-container", "#hackerspace-container", "#jobs-container"];
buttons = [".bulletin-btn", ".about-btn", ".hackerspace-btn", ".jobs-btn"];

//URLS of google sheets we want to load.
bulletin_sheet = "https://spreadsheets.google.com/feeds/list/1_0dRw3otWd3H8VyFMZTVjNevCCY1GNeP6bp_UUVDiuw/default/public/values?alt=json&callback=handle_bulletin";
card_keys = ["gsx$title", "gsx$content" , "gsx$email", "gsx$link", "gsx$linktitle"];

jobs_sheet = "https://spreadsheets.google.com/feeds/list/1x03TWP4e50RumOBEGnm0Dm37cBQWqOqyMevw77o4WI8/default/public/values?alt=json&callback=handle_jobs";
jobs_keys = ["gsx$companyname", "gsx$positiontitle", "gsx$positiondescription", "gsx$expiration", "gsx$compensation", "gsx$contactinformation", "gsx$applicationinstructions", "gsx$applicationlink", "gsx$approved"];

hashes = ["bulletin", "about", "hackerspace", "jobs"];

// Called on page ready
$( document ).ready(function(){

    //Check if there was a hash in the initial URL
    if (window.location.hash){
        var hash = window.location.hash.substring(1);
        for (i = 0; i < hashes.length; i++){
            if (hashes[i] == hash){
                setView(views[i]);
                break;
            }
        }
    } else {
        //Just load the default view
    }
    $(".button-collapse").sideNav();

    //Set View button listeners
    $(buttons[0]).click(function(event){ setView(views[0]); }); //card-container
    $(buttons[1]).click(function(event){ setView(views[1]); }); //about-container
    $(buttons[2]).click(function(event){ setView(views[2]); }); //hackerspace-container
    $(buttons[3]).click(function(event){ setView(views[3]); }); //jobs-container
    
    //load google sheet content
    loadSheet(bulletin_sheet);
    loadSheet(jobs_sheet);
});

// Called by button clicks to change the view.
function setView(view){
    console.log(view);
    for (i = 0; i < views.length; i++){
        $(views[i]).hide();
    }
    $(view).show();
    $(".button-collapse").sideNav('hide');
}

//returns the object of the loaded sheet
function loadSheet(url){
    var script=document.createElement('script');
    script.type='text/javascript';
    script.src=url;
    $("body").append(script);
}

/* 
Write a custom handler for after the sheet is retrieved to process it.
*/
function handle_bulletin(data){
    $(views[0]).empty();
    console.log(data);
    for (i = 0; i < data.feed.entry.length; i++){
        row = data.feed.entry[i];
        title = row[card_keys[0]].$t;
        content = row[card_keys[1]].$t;
        email = row[card_keys[2]].$t;
        link = row[card_keys[3]].$t;
        linktitle = row[card_keys[4]].$t;
        create_card(title, content, link, linktitle, email);
    }
}

/*
 * Our specified API implements:
 * a Title
 * Content with HTML formatting allowed
 * a link (which will show up as an action)
 * a contact email if applicable
 * a link title to show instead of a long link
 */
function create_card(title, content, link, linktitle, email){
    card = "<div class='card white darken-1 black-text'>                        \
                <div class='card-content'>                                      \
                    <span class='card-title'>"+title+"</span>                   \
                    <p>"+content+"</p>                                          \
                </div>                                                          \
                <div class='card-action blue lighten-4'>                        \
                    <a href='"+link+"'>"+linktitle+"</a>                        \
                    "+email+"                                                   \
                </div>                                                          \
            </div>                                                              \
    ";
    $(views[0]).append(card);
}

function handle_jobs(data){
    console.log(data);
    for (i = 0; i < data.feed.entry.length; i++){
        row = data.feed.entry[i];
        company = row[jobs_keys[0]].$t;
        pos_title = row[jobs_keys[1]].$t;
        pos_desc = row[jobs_keys[2]].$t;
        expiry = row[jobs_keys[3]].$t;
        pay = row[jobs_keys[4]].$t;
        contact = row[jobs_keys[5]].$t;
        app_instr = row[jobs_keys[6]].$t;
        app_link = row[jobs_keys[7]].$t;
        approved = row[jobs_keys[8]].$t
        create_job_card(company, pos_title, pos_desc, expiry, pay, contact, app_instr, app_link, approved);
    }
}

function create_job_card(company, title, description, expiry, pay, contact, app_instr, app_link, approved){
    if (approved.toUpperCase() == "TRUE"){
        card = "<div class='card white darken-1 black-text'> \
                <div class='card-content'>\
                    <h5>"+company+" - "+title+"</h5> \
                    <p>"+description+"</p>\
                    <h5>Compensation</h5>\
                    <p>"+pay+"</p>\
                    <h5>Application Instructions</h5>\
                    <p>"+app_instr+"</p>\
                </div>\
                <div class='card-action blue lighten-4'>\
                    <a href='mailto:"+contact+"'>"+contact+"</a>\
                    <a href='"+app_link+"'>Apply</a>\
                </div> \
            </div>";
        $(views[3] + " .job-header").after(card);
    }
}