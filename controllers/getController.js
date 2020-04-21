const mongoosePostModel = require("../model/postModel");
const moment = require("moment-timezone");

const calcDisplay = (covidDetail, countryParam) => {
  const covidResultsDisplay = {
    TotalPositive: 0,
    TotalDeath: 0,
    TotalRecovered: 0,
    Latest: [],
  };

  const filterCountry = covidDetail.filter(
    (covidDetails) => covidDetails.country == countryParam
  );

  const checkExistData = (detailParam) => {
    const {
      covid_date,
      covid_positive,
      covid_death,
      covid_recovered,
    } = detailParam;

    const checkExist = (o) => o.covid_date == covid_date;

    const checkByCountry = covidResultsDisplay.Latest.findIndex(checkExist);

    if (checkByCountry < 0) {
      covidResultsDisplay.Latest.push(detailParam);
    } else {
      covidResultsDisplay.Latest[
        checkByCountry
      ].covid_positive += covid_positive;
      covidResultsDisplay.Latest[checkByCountry].covid_death += covid_death;
      covidResultsDisplay.Latest[
        checkByCountry
      ].covid_recovered += covid_recovered;
    }
  };

  filterCountry.forEach((checkByLatests) => {
    const { covid_positive, covid_death, covid_recovered } = checkByLatests;

    covidResultsDisplay.TotalPositive += covid_positive;
    covidResultsDisplay.TotalDeath += covid_death;
    covidResultsDisplay.TotalRecovered += covid_recovered;

    checkExistData(checkByLatests);
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
