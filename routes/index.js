var express = require('express');
var router = express.Router();
var User = require('../lib/User');
var Twit = require('twit');

var T = new Twit({
    consumer_key:         'zPCkDSdZtpWNt9BgL4IcNKGBg',
    consumer_secret:      'TvrqSgbWzYL5QlPVOFjBZTaxaqMzN9KqgdPq6VRmaaC9g760E2',
    access_token:         '43681805-gL7a3eIOWNilNNt1fhAJ1H3Q2m0cRIw9fmg18e4Gf',
    access_token_secret:  'PdW826U9mTZpoW1v3SpT68EMfMysfGk8QT1fTTI94eBu7',
    timeout_ms:           60*1000  // optional HTTP request timeout to apply to all requests.
});

/* GET home page. */
router.get('/', function(req, res) {
    return res.render('login');
});

router.get('/signin', function(req, res) {
        return res.render('register');
});

router.post('/login', function(req, res) {

    console.log(req);
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({username: username, password: password}, function(err, user) {
        if(err) {
            console.log(err);
            return res.status(500).send();
        }

        if(!user) {
          return res.status(404).send();
        }
        req.session.user = user;
        // return res.render('index', { title: 'Dashboard', user: user });
        return res.redirect('/dashboard');

        // return res.status(200).send();
    })
});

router.get('/dashboard', function(req, res) {
   // if(!req.session.user) {
   //     return res.status(401).send();
   // }
    //
//  get the list of user id's that follow @tolga_tezel
//
    T.get('/followers/ids', { screen_name: 'PPiet11' },  function (err, data, response) {
        console.log(data)
    });

    //
//  stream a sample of public statuses
//
//     var stream = T.stream('statuses/sample');
//
//     stream.on('tweet', function (tweet) {
//         console.log(tweet)
//     });
   user = req.session.user;
   return res.render('index', { title: 'Dashboard', user: user });
});

router.post('/register', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;

    var newuser = new User();
    newuser.username = username;
    newuser.password = password;
    newuser.firstname = firstname;
    newuser.lastname = lastname;
    newuser.save(function(err, savedUser) {
      if(err) {
        console.log(err);
        return res.status(500).send();
      }

      return res.render('login');
    })
});

router.post('/search', function(req, res, twit) {
    var tweetId = req.body.id;

    T.get('statuses/show', {id: tweetId}, function(err, data, response) {
        if(err) {
            return res.status(500).send();
        }
        if(!data) {
            return res.status(400).send();
        }
        return res.render('tweet', { title: 'Tweet', tweet: data });
        // return res.status(200).send(data);
    });
});
module.exports = router;
