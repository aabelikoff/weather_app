function getTimeStr(time) {
  const date = new Date(time * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const half = hours > 12 ? "PM" : "AM";
  return `${hours > 12 ? hours - 12 : hours}:${minutes} ${half}`;
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
