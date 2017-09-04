/*
  Test suite for random cases
*/

function generateEventsArr() {
  let eventsArr = [];
  let randomNumOfEvents = Math.floor(Math.random() * 19) + 1
  for (let i=0; i<randomNumOfEvents; i++) {
    eventsArr.push(generateSingleEvent())
  }
  console.log(JSON.stringify(eventsArr))
  return eventsArr;
}

function generateSingleEvent() {
  let event = {};
  let startTime = Math.floor(Math.random() * 720)
  let endTime = Math.floor(Math.random() * 720) + startTime;
  if (endTime > 720) {
    endTime = 720;
  }
  event.start = startTime;
  event.end = endTime;
  return event;
}

function setLayoutAndLog(eventArr) {
  layOutDay(eventArr);
  console.log(eventArr);
}

function executeTest() {
  let eventArr = generateEventsArr();
  setLayoutAndLog(eventArr);
}
