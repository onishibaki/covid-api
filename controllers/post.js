const mongoosePostModel = require('../model/postModel');
const moment = require('moment-timezone');
  
const calcDisplay = (covidDetail,countryParam) => {
    const covidDetailFilter = covidDetail.filter((covidDetails)=> {
        return covidDetails.country == countryParam;
    });
    const covidTotalPositive = covidDetailFilter.reduce((Totalitems, covidDetailFilters)=> {
        return covidDetailFilters.covid_positive + Totalitems;
    },0);
    const covidTotalDeath = covidDetailFilter.reduce((Totalitems, covidDetailFilters)=> {
        return covidDetailFilters.covid_death + Totalitems;
    },0);
    const covidTotalRecovered = covidDetailFilter.reduce((Totalitems, covidDetailFilters)=> {
        return covidDetailFilters.covid_recovered + Totalitems;
    },0);
    const checkByLatest = covidDetailFilter.filter((covidDetailFilters)=> {
        return covidDetailFilters.covid_date == moment().tz("Asia/Tokyo").format('L');
    });
    const covidResultsDisplay = {
        TotalPositive: covidTotalPositive,
        TotalDeath: covidTotalDeath,
        TotalRecovered: covidTotalRecovered,
        Latest:[]
   };

   checkByLatest.forEach((checkByLatests)=>{
    const checkByCountry = covidResultsDisplay.Latest.findIndex(function(o) { return o.country == checkByLatests.country; });
        if ( checkByCountry < 0) {
            covidResultsDisplay.Latest.push(checkByLatests)
        } else{
            checkByLatest[checkByCountry].covid_positive += checkByLatests.covid_positive;
            checkByLatest[checkByCountry].covid_death += checkByLatests.covid_death;
            checkByLatest[checkByCountry].covid_recovered += checkByLatests.covid_recovered;
        }
    });

    return covidResultsDisplay;
};

exports.getPosts = (req, res) => {
    const covidDetail = mongoosePostModel.find()
    .select("country covid_positive covid_death covid_recovered covid_date")
    .then(covidDetail => {
       const countryParam = req.query.country;
       res.send({
        covid: calcDisplay(covidDetail,countryParam)
       });
    })
    .catch(err => console.log(err));
};

exports.createPost = (req, res) => {
      const post = new mongoosePostModel(req.body);
      post.save().then(result => {
        res.send({
            post: result
        });
    });
};
