//define globally the arc parameters variables 

  //comment this out if not debugging
  var debugCase = 0; //to show degug case on the display
  var firstRunFlag = [1,1,1,1,1,1,1,1,1,1]; //detects the new mode 
  // to helps to remove old graphics scene prior to the new event being shown 

  var myStart = [0,0,0]; // HH MM SS
  var myEnd   = [0,0,0]; // HH MM SS
  var myNow   = [0,0,0]; // HH MM SS

//  var timeStartRaw = new Date(); 
//  var timeEndRaw = timeStartRaw;
//  var timeNowRaw = timeStartRaw;
  
  var nextTitle = ["","",""];      // ongoing event titles
  var nextStart = [0,0,0,0];
  var mySnapshot = new Date();

  var timestart = '';
  var timeend   = '';

// initial draw invisible arcs
//drawOuterArc(); //dummy
  
///////////////////////////////////////////////////////////////////////////////
// just once at the beginning
// 
// programatically create minute dial lines
//
var dialLines = document.getElementsByClassName('diallines');

for (var i = 1; i < 60; i++) {
   dialLines[i] = $(dialLines[i-1]).clone()
                                   .insertAfter($(dialLines[i-1]));
   $(dialLines[i]).css('transform', 'rotate(' + 6 * i + 'deg)');
};

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//    functions 
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//find if the time1 and time2 are in time order left to right or not
// the equal times are judged as in time order 

function isInOrder(timeIn,timeOut) {

 if (timeIn[0] > timeOut[0]) { //compare hours values like ...... 15:__ - 14:__
  return false;
  } else if (timeIn[0] == timeOut[0] && timeIn[1] > timeOut[1]) { //15:20 - 15:10
  return false; 
  } else if (timeIn[0] == timeOut[0] && timeIn[1] == timeOut[1] & timeIn[2] > timeOut[2]){ //15:30:43 - 15:30:42
  return false;
  } else {
  return true;
 }; //if

}//function

/////////////////////////////////////////////////////////////////////////////////
//
//find if the time in question falls into the time interval
//
function isEventOn(eventStart, eventEnd, testTime){
 if (isInOrder(eventStart, testTime) && isInOrder(testTime, eventEnd)){
  return true
 } else {
  return false
 };//if 

}//function isEventInProgress

/////////////////////////////////////////////////////////////////////////////////
//
function secondsLength(time1, time2) {

 if (isInOrder(time1, time2)) {
  result = (3600* time2[0] + 60 * time2[1] + time2[2]) - (3600* time1[0] + 60 * time1[1] + time1[2]); 
  return result;
 } else //must be negative 
  return -1;

}//function secondsLength


function removeAllArcs() {
 d3.selectAll("svg > *").remove();
} //function removeAllArcs

/////////////////////////////////////////////////////////////////////////////////
//
function drawOuterArc() {


///////////////////////////////
// EVENT
// from 1,2,3.... HH:MM:SS
// to   4,5,6 ... HH:MM:SS
//-----------------------------
// now 7,8,9 .... HH:MM:SS 
////////////////////////////// 

// Add the background arc
// first draw the 
// TOTAL EVENT TIME

    // show the whole event
    // GREEN

//rotate by start minutes converted to degrees
//    var arcStart = String(0);  
//    var currentLessonArc = document.getElementById("smartarc");
//    currentLessonArc.setAttribute("transform", "rotate(" + arcStart + ")");
 
}//function drawOuterArc


///////////////////////////////////////////////////////////////////////////////
function hmsToRad(inHMS){
 // conversts time values in integer Hrs, Minutes and Seconds to radians 
 // this is for the d3 environment to use
 
 var outRad = [0,0,0];

 //HH to radians, consumes 0-24, spits out 0 - 6.28
 if (inHMS[0] < 12) {
          outRad[0] = Math.PI * Number(inHMS[0]) / 6;
 } else {
          outRad[0] = Math.PI * (Number(inHMS[0]) - 12) / 6;
 }; //if

 //MM to radians, input range 0-59
 outRad[1] = Math.PI * Number(inHMS[1]) / 30;

 //SS to radians, input range 0-59
 outRad[2] = Math.PI * Number(inHMS[2]) / 30;

 return outRad;

} // function hmsToRad


/////////////////////////////////////////////////////////////////////////////////
//
function updateOuterArc(showStart, showEnd, showNow, showStatus) {

// convert HMS to Radians for three time marks
var startRad = hmsToRad(showStart);
var endRad   = hmsToRad(showEnd);
var nowRad  = hmsToRad(showNow);

// Get the SVG container, and apply a transform translation 
// so the origin is the center of the canvas. 
// This way, we don’t need to position arcs individually.
   var arc = d3.arc()
    .innerRadius(130)
    .outerRadius(138)
    .startAngle(0)      //start to draw from zero, rotate later
    .cornerRadius(4);

    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var GreenEndAngleToShow = 0;
    var background = g.append("path") 
        .datum({endAngle: GreenEndAngleToShow})
        .style("fill", showStatus) //dark blue  
        .attr("d", arc);

    // Cover the SPENT TIME
    // GRAY
    var GrayEndAngleToShow = 0;
    var foreground = g.append("path")
        .datum({endAngle: GrayEndAngleToShow}) 
//        .style("fill", "#333333") //gray
        .style("fill", "#000000") //black, same as clock background 
        .attr("d", arc);


///////////////////////////////
// EVENT
// from 1,2,3.... HH:MM:SS
// to   4,5,6 ... HH:MM:SS
//-----------------------------
// now 7,8,9 .... HH:MM:SS 
////////////////////////////// 


  if // EVENT DOES NOT CROSS THE 12 HR DIAL 
        (showStart[1] < showEnd[1]) // NEED TO EXCLUDE WHOLE CIRCLE CROSSING 12 
     
     { // NOT CROSSING 12 

    // show the whole event
    // GREEN
//     var GreenEndAngleToShow = myEndRad[1] - myStartRad[1] + 60*(myEnd[0] - myStart[0]);
     

     if  (   ( isInOrder(showNow, showStart)  )
          && ( showStart[1] == showEnd[1]    ) 
          && ( showStart[1] == 0             ) 
         )
      { //event 60 minutes long starting on the 0 minutes tick 
       var GreenEndAngleToShow = startRad[1] + 2*Math.PI - nowRad[1];  //start to now partially 
      } 
       else if  ( endRad[1] == startRad[1] ) // event 60 mintues long
      { 
       var GreenEndAngleToShow = 2*Math.PI; //whole circle 
      } 
        else // event shorter than 60 minutes 
      {
       var GreenEndAngleToShow = endRad[1] - startRad[1];
      }; //if
      
     var background = g.append("path") 
        .datum({endAngle: GreenEndAngleToShow})
        .style("fill", showStatus) //dark blue  
        .attr("d", arc);

    // Cover the SPENT TIME
    // GRAY
      
     var GrayEndAngleToShow = (nowRad[1] + (nowRad[2]/60)) // include sub-minute divisions
                              - startRad[1];
//     var GrayEndAngleToShow = myStartRad[1] - myNowRad[1] - (myNowRad[2]/60);

     var foreground = g.append("path")
         .datum({endAngle: GrayEndAngleToShow}) 
//        .style("fill", "#333333") //gray
        .style("fill", "#000000") //black, same as clock background 
         .attr("d", arc);

//rotate by start minutes converted to degrees
     var arcStart = String(startRad[1]*180/Math.PI + startRad[2]*180/Math.PI/60); //convert radians to degrees - start minutes  
     var currentLessonArc = document.getElementById("smartarc");
     currentLessonArc.setAttribute("transform", "rotate(" + arcStart + ")");

  } 
  else if 
      (
          ( ( showStart[1] > showEnd[1] )
          &&( showStart[0] < showEnd[0] )
          )
      )
  { // CROSSES THE 12 HRS DIAL
  
    // GREEN
    var GreenAngleToDisplay = 2*Math.PI - startRad[1] + endRad[1];
    var background = g.append("path") 
        .datum({endAngle: GreenAngleToDisplay })
        .style("fill", showStatus) //dark blue  
        .attr("d", arc);

// Add the foreground arc that will cover the SPENT TIME

    // GRAY
    //does gray section cross the 12 dial?

    if
       (  // DOES NOT CROSS THE 12 DIAL
          ( showStart[1] < showNow[1])
       )
     {
       var GrayAngleToDisplay =  nowRad[1] + (nowRad[2]/60) - startRad[1] ;     
     }
       else if  ( showStart[1] > showNow[1])
     {    // CROSSES THE 12 DIAL
       var GrayAngleToDisplay =  2*Math.PI + nowRad[1] + (nowRad[2]/60) - startRad[1] ;     
     }; // if 
    
    var foreground = g.append("path")
        .datum({endAngle: GrayAngleToDisplay })
//        .style("fill", "#333333") //gray
        .style("fill", "#000000") //black, same as clock background 
        .attr("d", arc);

//rotate by start minutes converted to degrees
    var arcStart = String(startRad[1]*180/Math.PI + startRad[2]*180/Math.PI/60); //convert radians to degrees - start minutes  
    var currentLessonArc = document.getElementById("smartarc");
    currentLessonArc.setAttribute("transform", "rotate(" + arcStart + ")");
  
  }
  else if 
      (
          ( ( showStart[1] == 0          ) // MINUTES HAND ON 12
          &&( showStart[1] == showEnd[1] ) // IS 60 MINUTES LONG
          &&( showStart[0] < showEnd[0]  ) // AT LEAST 1 HR LONG
          )
      )
  { // STARTS EXACTLY ON 12 HRS (SPECIAL CASE OF DOES NOT CROSS 12)
  
    // GREEN
    var GreenAngleToDisplay = 2*Math.PI;
    var background = g.append("path") 
        .datum({endAngle: GreenAngleToDisplay })
        .style("fill", showStatus) //dark blue  
        .attr("d", arc);

    // GRAY
    var GrayAngleToDisplay =  nowRad[1] + (nowRad[2]/60);     
    
    var foreground = g.append("path")
        .datum({endAngle: GrayAngleToDisplay })
//        .style("fill", "#333333") //gray
        .style("fill", "#000000") //black, same as clock background 
        .attr("d", arc);

//rotate by start minutes converted to degrees
    var arcStart = String(0); //convert radians to degrees - start minutes  
    var currentLessonArc = document.getElementById("smartarc");
    currentLessonArc.setAttribute("transform", "rotate(" + arcStart + ")");
  
  }
  else if 
      (
          (  ( showStart[1] == showEnd[1] ) // IS 60 MINUTES LONG
          && ( showStart[0] < showEnd[0]  ) // AT LEAST 1 HR LONG
          )
      )
  { // STARTS on random minutes tick
  
    // GREEN
    var GreenAngleToDisplay = 2*Math.PI;
    var background = g.append("path") 
        .datum({endAngle: GreenAngleToDisplay })
        .style("fill", showStatus) //dark blue  
        .attr("d", arc);

    // GRAY
    if (showNow[1] < showStart[1]) //do interval cross 12?
    { // GRAY CROSSES 12
    var GrayAngleToDisplay =  2*Math.PI + nowRad[1] + (nowRad[2]/60) - startRad[1];     
}
    else
    // minutes interval does not cross 12
   {
     var GrayAngleToDisplay =  nowRad[1] + (nowRad[2]/60) - startRad[1];
   }; 
  
    
    var foreground = g.append("path")
        .datum({endAngle: GrayAngleToDisplay })
        .style("fill", "#000000") //black, same as clock background 
        .attr("d", arc);

//rotate by start minutes converted to degrees
    var arcStart = String(startRad[1]*180/Math.PI); //convert radians to degrees - start minutes  
    var currentLessonArc = document.getElementById("smartarc");
    currentLessonArc.setAttribute("transform", "rotate(" + arcStart + ")");
   
  };//if myStart... 

}//function updateOuterArc


////////////////////////////////////////////////////////////////////////////////////////
function drawInnerArc(showStart, showEnd, showNow) {

var startRad = hmsToRad(showStart);
var endRad   = hmsToRad(showEnd);
var nowRad  = hmsToRad(showNow);

   var arcInner = d3.arc()
                  .innerRadius(30)
                  .outerRadius(90)
                  .startAngle(0)      //start to draw from zero, rotate later
                  .cornerRadius(4);

// Get the SVG container, and apply a transform translation 
// so the origin is the center of the canvas. 
// This way, we don’t need to position arcs individually.
    var svgInner = d3.select("svg"),
                   width = +svgInner.attr("width"),
                   height = +svgInner.attr("height"),
                   g = svgInner.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

///////////////////////////////
// EVENT
// from 1,2,3.... HH:MM:SS
// to   4,5,6 ... HH:MM:SS
//-----------------------------
// now 7,8,9 .... HH:MM:SS 
////////////////////////////// 

// Add the background arc
// first draw the 
// TOTAL EVENT TIME

    var totalEventTime =  endRad[0] + endRad[1]/60 - startRad[0] - startRad[1]/60; 
    // assumed that the event never crosses midnight and we do not read seconds
    var backgroundInner = g.append("path")
        .datum({endAngle: totalEventTime}) 
        .style("fill", "#33aa33") //dark green  
        .attr("d", arcInner);

// Add the foreground arc that will hide the already
// SPENT TIME
    var lengthToShow = nowRad[0] + nowRad[1]/60 + nowRad[2]/3600 - startRad[0] - startRad[1]/60;  
    var foregroundInner = g.append("path")
        .datum({endAngle: lengthToShow}) //nowhrs -starthrs
//        .style("fill", "#333333") //gray
        .style("fill", "#000000") //black, same as clock background 
        .attr("d", arcInner);

//rotate by start minutes converted to degrees
    if (showStart[0] > 12) 
    {
     var angleToOffset = (showStart[0]-12)*30 + showStart[1]/2;
    } else
    {
     var angleToOffset = showStart[0]*30 + showStart[1]/2;
    }; 
    var arcInnerStart = String(angleToOffset);  //start hrs in degrees 
    var currentLessonArc = document.getElementById("smartarcinner");
    currentLessonArc.setAttribute("transform", "rotate(" + arcInnerStart + ")");

}//function drawInnerArc

//////////////////////////////////////////////////////////////////////////////
function unsetFlag(n)
{

if (firstRunFlag[n] == 1) 
  {
   removeAllArcs();
   // refresh programatically
   // show goodbye or invite message

   for ( i = 0; i < 11; i++)
    {
     firstRunFlag[i]=1;
    };

   firstRunFlag[n] = 0;
  };

}//function unsetFlag

//////////////////////////////////////////////////////////////////////////////
function drawSmartArc(myStart, myEnd, myNow, theTitleNotUsedHere){
// myValues are received as:
//  
// myValues[0][x] start
//             0 : 1 : 2
//            HH: MM: SS
// myValues[1][x] end
//             0 : 1 : 2
//            HH: MM: SS
// myValues[2][x] now
//             0 : 1 : 2
//            HH: MM: SS
// myValues[3][x] title
//             0 ... title of current event
//             1 ... title of the next event
//             2 ... title of the next event after next event



// convert [H,M,S] to [rad,rad,rad]
// as d3 requires radian angles, not minutes, not degrees 

if      // case 1  
  (     ( isInOrder(myNow, myStart)) 
     && ( secondsLength(myNow, myStart) > 3600 ) //may increase this if you want to keep the empty rack longer
   )   // clean the empty slot
{
 debugCase = 1;
 var showStatus = "#005599";
 unsetFlag(1);
  
// drawOuterArc();

} else if //case 2
          (   (isInOrder(myNow,myStart)             )
           && (secondsLength(myNow,myStart) <= 3600 )
           && (secondsLength(myStart,myEnd)  > 3600 )   
          )
{
 debugCase = 2;
 var showStatus = "#005599";
 
// drawInnerArc(myStart, myEnd, myNow);                          // call 2
 unsetFlag(2);

   var showEnd = [0,0,0];
   showEnd[0] = myNow[0] + 1;
   showEnd[1] = myNow[1];
   
   var showNow = [0,0,0];
   showNow[0] = myStart[0];
   showNow[1] = myStart[1];



//   myEnd[1] = myStart[1];
//   myEnd[0] = myStart[0] - 1;


 updateOuterArc(myStart, showEnd, showNow, showStatus); //call 3


} else if //case 3 
          (   (isInOrder(myNow,myStart)             )
           && (secondsLength(myNow,myStart) <= 3600 )
           && (secondsLength(myStart,myEnd) <= 3600 )   
          )
{
   var showStatus = "#005599";

   debugCase = 3;
   unsetFlag(3);

   var timeToStart = secondsLength(myNow,myStart);
   var timeToEnd   = secondsLength(myNow,myEnd);
   var eventLength = secondsLength(myStart,myEnd);
   
     
if (   (  eventLength < timeToEnd )
    && (  myEnd[1] >= myNow[1] )
   )
   {
   var showEnd = [0,0,0];
   showEnd[0] = myNow[0] + 1;
   showEnd[1] = myNow[1];
   
   var showNow = [0,0,0];
   showNow[0] = myStart[0];
   showNow[1] = myStart[1];
   }
   else
   {
   var showEnd = [0,0,0];
   showEnd[0] = myEnd[0];
   showEnd[1] = myEnd[1];
   
   var showNow = [0,0,0];
   showNow[0] = myStart[0];
   showNow[1] = myStart[1];


   };

   updateOuterArc(myStart, showEnd, showNow, showStatus); //call 3

} else if //case 4
          (   (isEventOn(myStart, myEnd, myNow)      )
           && (secondsLength(myStart,myNow)  <= 3600 )
           && (secondsLength(myStart,myEnd)  <= 3600 )   
          )         
{
   debugCase = 4;
   var showStatus = "#33aa33";

   unsetFlag(4);
   updateOuterArc(myStart, myEnd, myNow, showStatus); //call 4
//  drawInnerArc(myStart, myEnd, myNow);                          // call 2
 

} else if  //case 5
          (    (isEventOn(myStart, myEnd, myNow)     )
           && (secondsLength(myStart,myEnd)  >  3600 )   
           && (secondsLength(myNow,myEnd)    >  3600 )   

          )         
{
   debugCase = "5";
   var showStatus = "#33aa33";
   
   unsetFlag(5);

   var myStartShow = [0,0,0];
   var myEndShow = [0,0,0];
   
   myStartShow[0] = myNow[0];
   myStartShow[1] = myNow[1];
   myStartShow[2] = myNow[2];
   
   myEndShow[0]  = myNow[0] + 1;
   myEndShow[1]  = myNow[1] -1 ;
   myEndShow[2]  = 0;
   
   //updateInnerArc(startRad, endRad, nowRad); //call 5
   updateOuterArc(myStartShow, myEndShow, myNow, showStatus); //call 5
//   drawInnerArc(Start, myEnd, myNow);
   
} else if  //case 6
          (   ( isInOrder(myStart, myNow)   )
           && ( secondsLength(myStart,myNow )  <  3600 )
           && ( secondsLength(myStart,myEnd )  >  3600 )
           && ( secondsLength(myNow,myEnd )    <= 3600 )
          )         
{
   debugCase = "6";
   var showStatus = "#33aa33";
   unsetFlag(6);   
                      
   myStart[1] = myEnd[1];
   myStart[0] = myEnd[0] - 1;
      
   //updateInnerArc(startRad, endRad, nowRad); //call 5
   updateOuterArc(myStart, myEnd, myNow, showStatus); //call 5
//   drawInnerArc(myStart, myEnd, myNow);

} else if  //case 7
          (   (isEventOn(myStart, myEnd, myNow)             )
           && (secondsLength(myStart,myNow)  < 3600  )
           && (secondsLength(myNow,myEnd)   <= 3600  )   
          )         
{
   debugCase = "7";
   var showStatus = "#33aa33";
   
   unsetFlag(7);   
   
   myStart[1] = myEnd[1];
   myStart[0] = myEnd[0] - 1;
   
      
   //updateInnerArc(startRad, endRad, nowRad); //call 6
   updateOuterArc(myStart, myEnd, myNow, showStatus);   //call 6
//   drawInnerArc(myStart, myEnd, myNow);

} else if  //case 8
          (   (isEventOn(myStart, myEnd, myNow)             )
           && (secondsLength(myStart,myNow)  > 3600  )
           && (secondsLength(myNow,myEnd)   <= 3600  )   
          )         
{
   debugCase = "8";
   var showStatus = "#33aa33";
   
   unsetFlag(8);   

   var myStartShow = [0,0,0]; 
   
   myStartShow[0] = myEnd[0] - 1; //modify hours to show last hour of the event
   myStartShow[1] = myEnd[1];   //modify minutes
   myStartShow[2] = myStart[2];
   
      
   //updateInnerArc(startRad, endRad, nowRad); //call 6
   updateOuterArc(myStartShow, myEnd, myNow, showStatus);   //call 6
//   drawInnerArc(myStart, myEnd, myNow);

}
 else if  //case 9
          (   (isInOrder(myStart, myNow)             )
           && (isInOrder(myNow, myEnd)               )
           && (secondsLength(myStart,myNow)  > 3600  )
           && (secondsLength(myNow,myEnd)    > 3600  )   
          )         
{
   debugCase = 9;
   var showStatus = "#33aa33";
   
   unsetFlag(9);   

//   myStart[1] = myNow[1];
   var myEndShow = [0,0,0];
   var myStartShow = [0,0,0];

   myStartShow[0]   = myStart[0];
   myStartShow[1]   = myNow[1];
   myStartShow[2]   = myNow[2];

   myEndShow[0]   = myEnd[0];
   myEndShow[1]   = myNow[1] - 1;
   myEndShow[2]   = myEnd[2];
   
   
   updateOuterArc(myStartShow, myEndShow, myNow, showStatus);
   //updateInnerArc(startRad, endRad, nowRad); //call 7

}; //if //case 1  

      
}// function  drawSmartArc

function dropQuotes(inputString)
{
 return inputString.replace(/\"/g, ""); 
};//function dropQuotes


//////////////////////////////////////////////////////////////////////////////
function writeSmartTags(textToShow, textToShow2, textToShow3){

 
   $('.screentext').text(dropQuotes(textToShow[0]));
   $('.screentext2').text(textToShow2);
   $('.screentextNext').text(dropQuotes(textToShow[1]));
   $('.screentextDebugMessage').text(textToShow3);

//   if ( isEventOn(myStart, myEnd, myNow) )
//   {
//     $('.screentext').color("#0033ff");
//   }
//   else
//   {
//     $('.screentext').color("#33aa33");
//   }; //if 
//
         
}//function writeSmartTags


/////////////////////////////////////////////////////////////////////////////////
//
// this function gets evaluated every 100 ms, which is 10 times every second
// 
function tick() {
   mySnapshot = new Date();

   var seconds = mySnapshot.getSeconds();
   var minutes = mySnapshot.getMinutes();
   var hours = mySnapshot.getHours();
   var day = mySnapshot.getDate();
//   var timeZoneOffset = mySnapshot.getTimezoneOffset();

   var weekDayCode = mySnapshot.getDay();
   var titleblue = "TJ STADION"; 
   var titlered = "BRNO";
   
   var secAngle = seconds * 6;
   var minAngle = minutes * 6 + seconds * (360/3600);
   var hourAngle = hours * 30 + minutes * (360/720);

   weekDayNames = new Array("NEDĚLE", "PONDĚLÍ", "ÚTERÝ", "STŘEDA", "ČTVRTEK", "PÁTEK", "SOBOTA");
	// sunday goes first
   var weekday = weekDayNames[weekDayCode];
   
   $('.sec-hand').css('transform', 'rotate(' + secAngle + 'deg)');
   $('.min-hand').css('transform', 'rotate(' + minAngle + 'deg)');
   $('.hour-hand').css('transform', 'rotate(' + hourAngle + 'deg)');
   $('.date').text(day);
   $('.title-blue').text(titleblue);
   $('.title-red').text(titlered);
   $('.weekday').text(weekday);
 
}
/////////////////////////////////////////////////////////////////////////////////
//
// this function gets evaluated once every 5 s
// and is the main arc function
// 

function tickLong() {

   mySnapshot = new Date();
 
//get the events
   var eventToShow = getCurrentEvents(mySnapshot);

   var startValues = eventToShow [0];
   var endValues = eventToShow [1];
   var nowValues = eventToShow [2];
   var titleValues = eventToShow [3];

//DEBUG CASE shown   
//   writeSmartTags(titleValues, debugCase + ": " + timestart + '-' + timeend  ); //does it work like that? 
//ordinary - DEBUG CASE hidden
   writeSmartTags(titleValues, timestart + '-' + timeend, debugCase ); 


// draw or update the graphics
   drawSmartArc(startValues, endValues, nowValues, titleValues);

//
// working example
// [yyyy, mm, dd].join('-') + 'T' 

//debug values stabbed  
// anglesToShow[0] = -10; //start
// anglesToShow[1] = 40; //end 

//arc here start
//arc end 

}
/////////////////////////////////////////////////////////////////////////////////


function reloadAtTime(){

var d = new Date();
var current_hours = d.getHours();
var current_minutes = d.getMinutes();
var current_seconds = d.getSeconds();

// refresh the browser window at the specific hardcoded time - 1 AM
if(    (current_hours   == 1) 
    && (current_minutes == 0) 
    && (current_seconds == 0) 
  )
  {
  window.location=window.location;
  };

}//function
/////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////
/**
 * convert number to string and add a leading zero to numbers lower than 10
 *
 * @param {int} num - a number (or number string)
 * @returns {string}
 */
function addZero(num) {
    if (num < 10) {
        num = "0" + num;
    }
    return String(num);
}

///////////////////////////////////////////////////////////////////////////////
/**
 * format a date string
 *
 * @param {date object} 
 * @returns {string} formated date string for google's api: yyyy-mm-ddTHH:MM:ss-hh:MM
 */
function formatDateTime(theTime,MinutesOffset) {
    // minutes offset is a functional feature 
    // for the case that we need to show the event 
    // that is not cunning or ongoing NOW   
    //
    var yyyy = theTime.getFullYear();
    var mm = addZero(theTime.getMonth() + 1);
    var dd = addZero(theTime.getDate());
    var HH = theTime.getHours();
    var timeZoneOffset = theTime.getTimezoneOffset();    

//    create time strings out of numbers
//    and shift the hours out of the zupu time to the local time
//
//    For Prague, Brno in central Europe
//    if the timezone is UTC+2, (CEST, summer) then the timeZoneOffset obtained is -120
//    if the timezone is UTC+1 (CET, winter), then the timeZoneOffset obtained is -60
// 
//  convert 0-24 to 0-12 and 0-12
//
    if (HH < (-timeZoneOffset/60)) {
     HH = HH + 24 + (timeZoneOffset/60);
    } else {
     HH = HH + (timeZoneOffset/60);
     };
     var hh = addZero(HH); // create 00 to 12 string for hours symbol hh
     
    // subtract the TIMEZONE hours 
    // to list events starting not earlier than one hour ago
    //var hh = HH > 15 ? addZero(HH - 12 - 3) : HH; // 12 hour time
    var MM = addZero(theTime.getMinutes() + MinutesOffset);
    var SS = addZero(theTime.getSeconds());
//    return [yyyy, mm, dd].join('-') + 'T' + [HH, MM, SS].join(':') + '-' + [hh, MM].join(':');
    return [yyyy, mm, dd].join('-') + 'T' + [hh, MM, SS].join(':') + 'Z';
} //function formatDateTime

//////////////////////////////////////////////////////////////////////////////
function getStartTimeFull(inputItem){
 //return (inputItem.start.date) ? inputItem.start.date : inputItem.start.dateTime.split('T')[1];
 var valToReturn = inputItem.split('T')[1];
 return valToReturn;
}//function

//////////////////////////////////////////////////////////////////////////////
function getEndTimeFull(inputItem){
 //return (inputItem.start.date) ? inputItem.start.date : inputItem.start.dateTime.split('T')[1];
 var valToReturn = inputItem.split('T')[1];  
 return valToReturn;
}//function

//////////////////////////////////////////////////////////////////////////////
/**
 * get calendar events using google's calendar api
 *
 * @param {Object} JSON object of event results
 */
function getEvent(events) {

//    document.createTextNode('Just got into getEvent.');
//    var calDiv = document.getElementById('calcontent');

    if (events.items.length > 0) {
        var timestartfull = '';

        var timeendfull = '';
//        var li = '';
        var item = '';
//        var a = '';
        // build the html... 
//        var ul = document.createElement('ul');

        //cycle the ongoing events obtained
        for (var i = 0; i < events.items.length; i++) {
            item = events.items[i];
            
//            li = document.createElement('li');
//            li.appendChild(document.createTextNode(timestart + ' - ' + timeend + ' '));
//            li.appendChild(document.createTextNode(timeend + ' - '));            
//            a = document.createElement('a');
//            a.setAttribute('href', item.htmlLink);
//            a.appendChild(document.createTextNode(item.summary));

// read the title to display 
              nextTitle[i]=item.summary;

//            li.appendChild(a);

// read the time for the current or ongoing event            
            if (i==0) {
            // only the first event will be processed
            // the other ITEM EVENTS are just for the TEXT DESCRIPTION purpose
            // TODO - DISPLAY THE TEXT DESCRIPTION SOMWHERE ON THE CLOCK
            
            //get date
//            date = (item.start.date) ? item.start.date : item.start.dateTime.split('T')[0];
            //get time as string cut out of the whole datetime RFCxxxx representation  

//--------------------------------------------------------------------
            var timeStartRaw = item.start.dateTime;
            timestartfull = getStartTimeFull(timeStartRaw);
            //timestartfull = timeStartRaw;
            var timestartwithseconds = timestartfull.split("+")[0];
            timestart = timestartwithseconds.substring(0, timestartwithseconds.length-3);
            
            // compute arc parameters
//            startMinutes = timestart.split(":")[1]; 
//            startDegrees = Number(startMinutes)*6/180; //radians, seconds may be added as + start.minutes * 0.6
//--------------------------------------------------------------------                       
            var timeEndRaw = item.end.dateTime;
            timeendfull = getEndTimeFull(timeEndRaw);
            //timeendfull = timeEndRaw;
            var timeendwithseconds = timeendfull.split("+")[0];
            timeend = timeendwithseconds.substring(0, timeendwithseconds.length-3);
            // compute arc parameters
//            endMinutes = timeend.split(":")[1]; 
//            endDegrees = Number(endMinutes)*6/180; //radians, seconds may be added as + end.minutes * 0.6
//--------------------------------------------------------------------



            // TODO - get the timezones
            //var timeZoneOffset = myDateTime.getTimezoneOffset();
            //timestartTimezone = timestartfull.split("+")[1];
            //timeendTimezone = timeendfull.split("+")[1];
                         

                        // the first event on the obtained list
                        // we can also control the offset of the get method 
//              li.appendChild(document.createTextNode('\t start: ' + startDegrees + ', end = ' + endDegrees));
               
            // get start time values 
               myStart[0] = Number(timestartwithseconds.split(":")[0]); //00 thru 23
               myStart[1] = Number(timestartwithseconds.split(":")[1]); //00 thru 59
               myStart[2] = Number(timestartwithseconds.split(":")[2]); //00 thru 59

            // get end time values 
               myEnd[0] = Number(timeendwithseconds.split(":")[0]);
               myEnd[1] = Number(timeendwithseconds.split(":")[1]);
               myEnd[2] = Number(timeendwithseconds.split(":")[2]);

//              myMinutes[2]= current_minutes + current_seconds/60;
//              myMinutes[2] = 0; //by now zero., will be current minutes angle
            };//if

//            ul.appendChild(li);
//            calDiv.appendChild(ul);

//
        }; //for
    } else {
    // no ongoing events found, so just spit out some zeros 
        document.createTextNode('No ice activities to show now...');
               myStart[0] = 0;
               myStart[1] = 0;
               myStart[2] = 0;
               myEnd[0] = 0;
               myEnd[1] = 0;
               myEnd[2] = 0;
              
    };
     //if
    return [myStart, myEnd];     //fixme - this function shall return RAW time of start and end and the title

} //function getEvent

/////////////////////////////////////////////////////////////////////////////
/**
 * javascript native async requester.
 *
 * @param {string} request url
 * @param {function} callback function to handle response
 * @returns {json} response
 */
function httpGet(url, callback) {
//    document.write('DEBUG: Here i got to httpGet function.'); 

    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.onreadystatechange = function(oEvent) {
        if (oReq.readyState === 4 && oReq.status === 200) {
            // callback when we get response... 
            return callback(JSON.parse(oReq.responseText));
        } else {
            console.log("Response: ", oReq.status);
        }
    };
    oReq.send();
    
} //function httpGet

///////////////////////////////////////////////////////////////////////////////
function getCurrentEvents(theTime){


// include API key here
 
//production
var API_KEY = 'AIzaSyDnAaPgnj9VRETPAWbwvvwD2mdqCl0am-8';

//debugging
//var API_KEY = 'AIzaSyCqQAa1nczRQhTEYPBq1FJ2SQG7gf6LQLE';

//production
var CALENDAR_ID = 'tjstadionbrno@gmail.com';

//debugging
//var CALENDAR_ID = '03kjsop1ator7ais9d08u8gm0s@group.calendar.google.com';

/** current date object */
//var now = new Date();
var limitEvents = 3;

/**
 * Create a Google Calendar API http request 
 * {@link https://developers.google.com/google-apps/calendar/v3/reference/events}
 */
var request = 'https://www.googleapis.com/calendar/v3/calendars/' +
        CALENDAR_ID +
        '/events?singleEvents=true&orderBy=startTime&fields=items(description%2Csummary%2Clocation%2Cstart%2Cend%2ChtmlLink)&timeMin=' +
        formatDateTime(theTime,0) +
        '&maxResults=' + limitEvents +
        '&orderBy=startTime' +
        '&key=' +
        API_KEY;
//document.write('DEBUG: ' + request);


//////////////////////////////////////////////////////////////////////////
//
// build the request, make the async call, and callback listEents with results...
//
httpGet(request, getEvent);
//the above httpGet call populates the myTimMinutes global variable
//via getEvent evaluation 

// current time 
 
 myNow[0]= mySnapshot.getHours();
 myNow[1]= mySnapshot.getMinutes();
 myNow[2]= mySnapshot.getSeconds();
 
 return [myStart, myEnd, myNow, nextTitle];
 // decimal values
 
} //function getCurrentEvents

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
// PERIODIC CALLS that makes the clock ticking
//////////////////////////////////////////////////////////////////

setInterval(function(){ reloadAtTime(); }, 1000);
setInterval(tick, 100);
setInterval(tickLong, 5000);