// Class DataManipulator breakes weather forecast array to map and creates analytics for each forecast day
// Analytics helps creating 5 days forecastBlock
class ForecastData {
  constructor(weatherArray) {
    this.weatherMap = this.splitWeatherArrayByDates(weatherArray);
  }
  //Creates a Map with a keys - day timestamp in Unix time and values = slices of weather array
  splitWeatherArrayByDates(weatherArray) {
    let [{ dt: startDate }] = weatherArray;
    let date = new Date(startDate * 1000).setHours(0, 0, 0, 0);
    const msRange = 24 * 60 * 60 * 1000;
    let pointer = 0;
    let entries = [];
    for (let i = 1; i < 6; i++) {
      let nextDate = date + msRange;
      let indexTo = weatherArray.findIndex(({ dt }) => {
        return dt * 1000 >= nextDate;
      });
      let partArray = weatherArray.slice(pointer, indexTo);
      pointer = indexTo;
      entries.push([date / 1000, partArray]);
      date = nextDate;
    }
    return new Map(entries);
  }
  //sets word description to the average day temperature
  getTempDescription(min, max) {
    let avg = (min + max) / 2;
    let resStr = "Very cold";
    if (avg > 30) {
      resStr = "Hot";
    } else if (avg > 18) {
      resStr = "Warm";
    } else if (avg > 5) {
      resStr = "Cold";
    }
    return resStr;
  }
  //get min, max and average temperature description for a day
  getDayTempRange(array) {
    let { minTemp, maxTemp } = array.reduce(
      (acc, { main: { temp } }) => {
        acc.minTemp = Math.min(acc.minTemp, temp);
        acc.maxTemp = Math.max(acc.maxTemp, temp);
        return acc;
      },
      { minTemp: Infinity, maxTemp: -Infinity }
    );
    let tempDescr = this.getTempDescription(minTemp, maxTemp);
    return {
      minTemp,
      maxTemp,
      tempDescr,
    };
  }
  //gets prevail weather description and icon for a day
  getDayWeatherDescription(array) {
    let arrayToAnalyse = array.map(({ weather: [{ main, icon }] }) => {
      return [main, icon];
    });

    let mainFrequencyObj = {};
    let iconFrequencyObj = {};
    //counts each entry number in the object (key - entry, value - number)
    for (let [main, icon] of arrayToAnalyse) {
      mainFrequencyObj[main] = (mainFrequencyObj[main] || 0) + 1;
      iconFrequencyObj[icon] = (iconFrequencyObj[icon] || 0) + 1;
    }
    let mainFrequency = 0;
    let main;
    for (let key in mainFrequencyObj) {
      if (mainFrequencyObj[key] > mainFrequency) {
        main = key;
        mainFrequency = mainFrequencyObj[key];
      }
    }

    let iconFrequency = 0;
    let icon;
    for (let key in iconFrequencyObj) {
      if (iconFrequencyObj[key] > iconFrequency) {
        icon = key;
        iconFrequency = iconFrequencyObj[key];
      }
    }

    return {
      main,
      icon,
    };
  }
  //joins two types of weather description (min temp, max temp, temp descr, weather descr, icon)
  getDayWeatherObj(array) {
    return Object.assign({}, this.getDayTempRange(array), this.getDayWeatherDescription(array));
  }
  //returns array of analytic weather information for 5 days. Each element equals a day.
  getAllDaysWeatherArray() {
    let array = [];
    this.weatherMap.forEach((value, key) => {
      let weatherObj = this.getDayWeatherObj(value);
      weatherObj.dt = key;
      array.push(weatherObj);
    });
    return array;
  }
}
