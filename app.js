"use strict";

function Calendar() {
  this.events;
}

// Creates calendar labeling and structure
Calendar.prototype.initialize = function() {
  this.generateHourDividers();
  this.generateTimeBlocks();
}
// Generates Hour Dividers on cal-container
Calendar.prototype.generateHourDividers = function () {
  let allHoursDiv = document.getElementById('all-hour-dividers');
  for (let i=0; i<12; i++) {
    let newDivider = document.createElement('div');
    newDivider.className = 'hour-divider';
    allHoursDiv.appendChild(newDivider);
  }
};

// Generates hour time-blocks left of cal container
Calendar.prototype.generateTimeBlocks = function () {
  let allTimeBlocksDiv = document.getElementById('all-times');
  for (let i=9; i<=21; i++) {
    let time = i;
    let meridiem = 'AM';
    if (i > 11) {
      meridiem = 'PM';
    }
    if (i > 12) {
      time -= 12;
    }
    let newTimeBlock = document.createElement('div');
    newTimeBlock.className = 'time-block';
    newTimeBlock.innerHTML = time + ':00 '
                                  + '<span class="small-gray">'
                                  + meridiem
                                  + '</span>';
    if (i !== 21) {
      let halfHourMark = document.createElement('div');
      halfHourMark.className = 'small-gray half-hour-mark';
      halfHourMark.innerHTML = time + ':30';
      newTimeBlock.appendChild(halfHourMark);
    }

    allTimeBlocksDiv.appendChild(newTimeBlock);
  }
};

// Add array of events to DOM
Calendar.prototype.insertEvents = function (calEvents) {
  this.reset();
  this.events = this.generateDimensions(calEvents);
  calEvents.forEach((singleEvent,index)=>{
    let newEvent = document.createElement('div');
    newEvent.className = 'cal-event';
    newEvent.innerHTML = 'Sample Event' + '<span class="small-gray block">2355 High Street</span>';
    newEvent.style.top = singleEvent.top;
    newEvent.style.height = singleEvent.height;
    newEvent.style.width = singleEvent.width;
    newEvent.style.left = singleEvent.left;
    newEvent.style.color = this.randomColor(index);
    if (singleEvent.padding) newEvent.style.padding = singleEvent.padding;
    const calContainer = document.getElementById('cal-container');
    calContainer.insertBefore(newEvent, calContainer.firstChild);
  })
}

// Clears any events currently active
Calendar.prototype.reset = function (calEvents) {
  let allEvents = document.getElementsByClassName('cal-event');
  while (allEvents.length) {
    allEvents[0].parentNode.removeChild(allEvents[0]);
  }
}

// Adds properties for height, top, width, & left values
Calendar.prototype.generateDimensions = function (calEvents) {
  let timeArr = this.countOfEventsPerMinute(calEvents);
  this.addRowCountAndOrder(calEvents,timeArr);

  calEvents.forEach(singleEvent=>{
    singleEvent.top = singleEvent.start + 'px';
    let height = singleEvent.end - singleEvent.start
    singleEvent.height = height + 'px';
    if (height < 20) {
      singleEvent.padding = '0 10px'
    }
    let blockSize = 580 / singleEvent.countInRow;
    singleEvent.width = blockSize + 'px';
    singleEvent.left = blockSize * singleEvent.order - blockSize + 10 + 'px';
  });
}

// Populates hash with count of events at each minute
Calendar.prototype.countOfEventsPerMinute = function (calEvents) {
  let timeArr = [];
  calEvents.forEach(singleEvent=>{
    for (let i=singleEvent.start; i<singleEvent.end; i++) {
      if (timeArr[i]) {
        timeArr[i].timeSlots.push(singleEvent);
      } else {
        timeArr[i] = {}
        timeArr[i].timeSlots = [singleEvent];
      }
      timeArr[i].takenSlots = [];
    }
  });
  return timeArr;
}

// Adds row count and order to event object
Calendar.prototype.addRowCountAndOrder = function(calEvents,timeArr) {
  calEvents.forEach(singleEvent=>{
    singleEvent.countInRow = 1;
    singleEvent.order = 1;

    for (let i=singleEvent.start; i<singleEvent.end; i++) {
      singleEvent.countInRow = Math.max(singleEvent.countInRow, timeArr[i].timeSlots.length);
      let availableSlot = 1;
      while (timeArr[i].takenSlots[availableSlot-1]) {
        availableSlot++;
      }
      singleEvent.order = Math.max(singleEvent.order,availableSlot);
    }

    for (let i=singleEvent.start; i<singleEvent.end; i++) {
      timeArr[i].takenSlots[singleEvent.order-1] = true;
    }
  });

  this.getMaxCountFromNeighbors(calEvents,timeArr);
}

// CountInRow must be the Max of the neighbors' CountInRow
Calendar.prototype.getMaxCountFromNeighbors = function (calEvents,timeArr) {
  calEvents.forEach(singleEvent=>{
    for (let i=singleEvent.start; i<singleEvent.end; i++) {
      timeArr[i].timeSlots.forEach(overlappingEvent=>{
        singleEvent.countInRow = Math.max(singleEvent.countInRow, overlappingEvent.countInRow);
      })
    }
  })
}

// Returns a color in a pallete for event border+title
Calendar.prototype.randomColor = function (index) {
  const materialDesign400 = ['#EF5350','#EC407A','#AB47BC','#7E57C2','#5C6BC0',
                             '#42A5F5','#29B6F6','#26C6DA','#26A69A','#66BB6A',
                             '#9CCC65','#D4E157','#FFEE58','#FFCA28','#FFA726',
                             '#FF7043','#8D6E63','#78909C'];
  return materialDesign400[index % materialDesign400.length];
}

////////

let sampleEvents = [
  {start: 30, end: 90},
  {start: 540, end: 600},
  {start: 560, end: 620},
  {start: 610, end: 670}
]

const myCalendar = new Calendar();
myCalendar.initialize();
myCalendar.insertEvents(sampleEvents);

window.layOutDay = myCalendar.insertEvents.bind(myCalendar);
