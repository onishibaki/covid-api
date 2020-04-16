const mongoosePostModel = require("../model/postModel");
const moment = require("moment-timezone");

const calcDisplay = (covidDetail, countryParam) => {
  const filterCountry = covidDetail.filter(
    (covidDetails) => covidDetails.country == countryParam
  );

  const TotalPositive = filterCountry.reduce(
    (total, filterCountrys) => filterCountrys.covid_positive + total,
    0
  );

  const TotalDeath = filterCountry.reduce(
    (total, filterCountrys) => filterCountrys.covid_death + total,
    0
  );

  const TotalRecovered = filterCountry.reduce(
    (total, filterCountrys) => filterCountrys.covid_recovered + total,
    0
  );

  const checkByLatest = filterCountry.filter(
    (filterCountrys) =>
      filterCountrys.covid_date == moment().tz("Asia/Tokyo").format("L")
  );

  const covidResultsDisplay = {
    TotalPositive,
    TotalDeath,
    TotalRecovered,
    Latest: [],
  };

  checkByLatest.forEach((checkByLatests) => {
    const {
      country,
      covid_positive,
      covid_death,
      covid_recovered,
    } = checkByLatests;

    const checkExist = (o) => o.country == country;

    const checkByCountry = covidResultsDisplay.Latest.findIndex(checkExist);

    if (checkByCountry < 0) {
      covidResultsDisplay.Latest.push(checkByLatests);
    } else {
      checkByLatest[checkByCountry].covid_positive += covid_positive;
      checkByLatest[checkByCountry].covid_death += covid_death;
      checkByLatest[checkByCountry].covid_recovered += covid_recovered;
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
