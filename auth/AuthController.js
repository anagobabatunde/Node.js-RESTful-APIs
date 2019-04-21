var express    = require('express');
var router     = express.Router(); 
var bodyParser = require('body-parser');
var User       = require('../user/User');
var jwt        = require('jsonwebtoken');
var bcrypt     = require('bcryptjs');
var config     = require('../config');

router.use(bodyParser.urlencoded({extended : false}));
router.use(bodyParser.json());

router.post('/register', function(req, res) {
    var hashedPwd = bcrypt.hashSync(req.body.password, 8);

    User.create({
        name     : req.body.name,
        email    : req.body.email,
        password : hashedPwd
    },
        function(err, user) {
            if (err) {
                return res.status(500).send("problem registering the user.");
            }

            //je crée le token
            var token = jwt.sign({id: user._id}, config.secret, {
                expiresIn: 86400
            });
            res.status(200).send({auth: true, token: token}) 
        }
    );
});

router.get('/me', function(req, res) {
    var token = res.header['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(error, decoded) {
        if (error) return res.status(500).send({ auth: false, message : 'failed to authenticate token.'});

        res.status(200).send(decoded)
    });
})

module.exports = router;