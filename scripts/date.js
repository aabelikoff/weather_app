function getTimeStr(time) {
  const date = new Date(time * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let half = hours >= 12 && hours != 0 ? "PM" : "AM";
  if (hours > 12 && hours != 0) {
    hours -= 12;
  } else if (!hours) {
    hours = 12;
  }
  return `${hours}:${formatWithLeadZero(minutes)} ${half}`;
}

function getDateStr(time) {
  const date = new Date(time * 1000);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${formatWithLeadZero(day)}.${formatWithLeadZero(month)}.${year}`;
}

function formatWithLeadZero(num) {
  return num < 10 ? `0${num}` : num;
}

function getTimeDifferenceStr(start, end) {
  if (start > end) {
    [start, end] = [end, start];
  }
  let diff = end - start;
  let mins = Math.floor((diff % 3600) / 60);
  let hours = Math.floor(diff / 3600);
  return `${hours}:${formatWithLeadZero(mins)} hr`;
}

function getWeekDayName(num) {
  if (num >= 0 && num < 7) {
    return ["Sunday", "Monday", "Tuesday", "Wednsday", "Thursday", "Friday", "Saturday"][num];
  }
}

function getMonthName(num) {
  if (num >= 0 && num < 12) {
    return ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][num];
  }
}

function geShorttWeekDay(time) {
  const date = new Date(time * 1000);
  let weekDay = date.getDay();
  let str = getWeekDayName(weekDay).slice(0, 3).toUpperCase();
  return str;
}

function getShortDateStr(time) {
  const date = new Date(time * 1000);
  let month = date.getMonth();
  let day = date.getDate();
  return `${getMonthName(month)} ${formatWithLeadZero(day)}`;
}

function getDayPart(dateObj) {
  const hour = dateObj.getHours();
  if (hour >= 4 && hour < 12) {
    return "THIS MORNING";
  } else if (hour >= 12 && hour < 18) {
    return "TODAY";
  } else {
    return "TONIGHT";
  }
}

let time = Date.now() / 1000;

console.log(geShorttWeekDay(time));
console.log(getShortDateStr(time));
