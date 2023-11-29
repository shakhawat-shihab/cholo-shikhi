function getFormattedTime() {
  const date = new Date();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const time =
    date.getHours() +
    ":" +
    ("0" + date.getMinutes()).slice(-2) +
    ":" +
    ("0" + date.getSeconds()).slice(-2);
  const timeZone = date.toString().match(/\((.*?)\)/)[1];
  const formattedDate = `${dayOfWeek} ${month} ${day} ${year} ${time} GMT${
    date.getTimezoneOffset() / -60 > 0 ? "+" : "-"
  }${("0" + date.getTimezoneOffset() / -60).slice(-2)}00 (${timeZone})`;
  //   console.log(formattedDate);
  return formattedDate;
}

module.exports = { getFormattedTime };
