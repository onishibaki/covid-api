const mongoosePostModel = require("../model/postModel");
const moment = require("moment-timezone");

const calcDisplay = (covidDetail, countryParam) => {
  const ystDate = moment().subtract(1, "days").tz("Asia/Tokyo").format("L");
  const tdyDate = moment().tz("Asia/Tokyo").format("L");
  const covidResultsDisplay = {
    TotalPositive: 0,
    TotalDeath: 0,
    TotalRecovered: 0,
    Latest: [],
  };

  const filterCountry = covidDetail.filter(
    (covidDetails) => covidDetails.country == countryParam
  );

  const checkLatestDate = filterCountry.some(
    (filterCountrys) => filterCountrys.covid_date == tdyDate
  );

  const checkExistData = (detailParam) => {
    const { covid_positive, covid_death, covid_recovered } = detailParam;

    if (Object.keys(covidResultsDisplay.Latest).length === 0) {
      covidResultsDisplay.Latest.push(detailParam);
    } else {
      covidResultsDisplay.Latest[0].covid_positive += covid_positive;
      covidResultsDisplay.Latest[0].covid_death += covid_death;
      covidResultsDisplay.Latest[0].covid_recovered += covid_recovered;
    }
  };

  filterCountry.forEach((checkByLatests) => {
    const {
      covid_date,
      covid_positive,
      covid_death,
      covid_recovered,
    } = checkByLatests;

    covidResultsDisplay.TotalPositive += covid_positive;
    covidResultsDisplay.TotalDeath += covid_death;
    covidResultsDisplay.TotalRecovered += covid_recovered;

    if (covid_date === tdyDate && checkLatestDate) {
      checkExistData(checkByLatests);
    }

    if (covid_date === ystDate && !checkLatestDate) {
      checkExistData(checkByLatests);
    }
  });

  return covidResultsDisplay;
};

exports.getPosts = (req, res) => {
  const covidDetail = mongoosePostModel
    .find()
    .select("country covid_positive covid_death covid_recovered covid_date")
    .then((covidDetail) => {
      const countryParam = req.query.country;
      res.send({
        covid: calcDisplay(covidDetail, countryParam),
      });
    })
    .catch((err) => console.log(err));
};
