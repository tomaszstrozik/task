const express = require('express');
const axios = require('axios');

const router = express.Router();

/*
 * const 
 */

const GITHUB_USER_API_URL = 'https://api.github.com/users/';
const DISTANCE_API_URL = 'http://www.dystans.org/route.json';
const MAX_RESULTS = 10;

/*
 * helpers
 */

function getUserGithubUrl (username) {
    return GITHUB_USER_API_URL + username;
}

function getRequestPromise (urlProvider, params) {
    return axios.get(urlProvider.apply(this, params));
}

function getPaginationParams (perPage, pageNumber) {
    return `?per_page=${perPage}&page=${pageNumber}`;
}

function getFollowersUrl (followersUrl, perPage, pageNumber) {
    return followersUrl + getPaginationParams(perPage, pageNumber);
}

function getCitiesParams (fromCity, toCity) {
    return `?stops=${fromCity}|${toCity}`;
}

function getDistanceApiUrl (fromCity, toCity) {
    return DISTANCE_API_URL + getCitiesParams(fromCity, toCity);
}

function sortDistance (first, second) {
    return second.distance - first.distance;
}

function createErrorMsg (msg) {
  return {
    success: false,
    status: 'error',
    message: msg
  }
}

/*
 * middlewares 
 */

/*
 * Get github data by given username
 */
function getUserData (req, res, next) {
  
  let username = req.params.username,
      userPromise = getRequestPromise(getUserGithubUrl, [username]);
  
  userPromise
    .then(response => {

      let user = {
        name: username,
        location: response.data.location,
        followersUrl: response.data.followers_url
      };
      
      if (user.location !== null) {
        res.locals.user = user;
        next();
      } else {
        res.json(createErrorMsg('Given user location doesn\'t exist'))
      }
    })
    .catch(err => res.json(createErrorMsg(err.message)));
};

/*
 * Get all user's followers
 */
function getAllFollowers (res, next, pageNumber) {
  let perPage = 100,
      followersUrl = res.locals.user.followersUrl;
  
  res.locals.user.followers = res.locals.user.followers || [];

  getRequestPromise(getFollowersUrl, [followersUrl, perPage, pageNumber])
    .then(response => {

      let followersChunk = response.data.map(user => user.login);
      res.locals.user.followers = res.locals.user.followers.concat(followersChunk);
      
      if (followersChunk.length === perPage) {
        getAllFollowers(res, next, pageNumber + 1);
      } else {
        next();
      }

    })
    .catch(err => res.json(createErrorMsg(err.message)));
};

function getAllFollowersWrapper (req, res, next) {
  
  let pageNumber = 1;
  
  getAllFollowers(res, next, pageNumber);

};

/*
 * Get detailed data for each follower
 * Filter followers depend on existance of profile location
 */
function getFollowersWithLocation (req, res, next) {

  let followers = res.locals.user.followers,
      promises = [],
      followersWithLocation;

  if (followers.length) {
    followers
      .forEach(follower => {
        promises.push(getRequestPromise(getUserGithubUrl, [follower]))
      });
    
    axios
      .all(promises)
      .then(results => {
        followersWithLocation = results
          .filter(result => {
            return result.data.location !== null;
          })
          .map(resultWithLocation => { 
            return {
              login: resultWithLocation.data.login,
              location: resultWithLocation.data.location
            }
          });
          
        res.locals.user.followersWithLocation = followersWithLocation;

        next();
      })
      .catch(err => res.json(createErrorMsg(err.message)));

  } else {
    res.json(createErrorMsg('User has no followers'));
  }

};

/*
 * Get distances between user and followers and return results
 */
function calculateDistances (req, res, next) {
  let promises = [],
      fromCity = res.locals.user.location,
      followersWithLocation = res.locals.user.followersWithLocation,
      distances = [];

  if (followersWithLocation.length) {
    followersWithLocation
      .forEach(follower => {
        promises.push(
          getRequestPromise(getDistanceApiUrl, [fromCity, follower.location])
            .then(response => {

              let distanceObj = {
                distance: response.data.distance,
                isTargetCityExist: response.data.distances.length
              };

              if (distanceObj.isTargetCityExist) {
                distances.push({
                  follower: follower.login,
                  distance: distanceObj.distance
                })
              };
            })
        );
      });

    axios
      .all(promises)
      .then(() => {
        let result = distances.length > 10 ?
          distances.sort(sortDistance).slice(0, MAX_RESULTS) :
          distances.sort(sortDistance) ;

        res.json({
          success: true,
          status: 'success',
          results: result
        })
        return;
      })
      .catch(err => res.json(createErrorMsg(err.message)));      

  } else {
    res.json(createErrorMsg('Doesn\'t have followers with defined location'));
  }
};

router.get(
  '/followers/:username',
  getUserData,
  getAllFollowersWrapper,
  getFollowersWithLocation,
  calculateDistances
);

module.exports = router;