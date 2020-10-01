var input;
var inputIdea;
var submitBTN;
var getDataBTN;
var database;
var ideaTxt;
var title;
var greeting;
var ideaCounter = 0;
var allSubmissions;


function preload(){
    
}

function setup(){
    createCanvas(1000,700)

    database = firebase.database();

    input = createInput("Name");
    input.position(100,100)

    submitBTN = createButton("Submit");
    submitBTN.position(100,250)

    getDataBTN = createButton("Show Other Posts")
    getDataBTN.position(width-100, height-100);

    inputIdea = createElement('textarea', 'Your Idea');
    inputIdea.position(100, 150)
    
    title = createElement('h2');
    title.html("Enter Your Idea Below!");
    title.position(50,50);

    greeting = createElement('h3');
}

function draw(){
    submitBTN.mousePressed(submitData);
    getDataBTN.mousePressed(getData);
    getIdeaCount();
}   
function getIdeaCount(){
    ideaCount = database.ref("ideaCounter").on("value",(data)=>{
        ideaCounter= data.val();
    })
}
function submitData(){
    ideaCounter++;
    name = input.value();
    ideaTxt = inputIdea.value();
    input.hide();
    inputIdea.hide();
    submitBTN.hide();
    var submissionIndex = "submissions/submission" + ideaCounter;
    database.ref(submissionIndex).set({
        myName: name,
        myIdea: ideaTxt
    })
    database.ref("/").update({
        ideaCounter:ideaCounter
    })
    greeting.html("Your idea has been submitted!");
    greeting.position(50,150)
}

async function getData(){
    title.html("The Posts")
    greeting.hide();
    input.hide();
    inputIdea.hide();
    submitBTN.hide();
    await allSubmissionInfo();
    displayData();
}

async function allSubmissionInfo(){
    console.log("allSubmissionInfo");
    var submissionInfoRef = await database.ref("submissions").once("value");
    
    if(submissionInfoRef.exists()){
        allSubmissions = submissionInfoRef.val();
    }
}

function displayData(){
    console.log("displayData " + allSubmissions);
    if (allSubmissions !== undefined){
        var displayPosition = 130;
        for (var sub in allSubmissions){
            displayPosition += 20;
            textSize(15);
            text(allSubmissions[sub].myName + " - " + allSubmissions[sub].myIdea, 50, displayPosition);
        }
    }
}