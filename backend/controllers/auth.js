const config = require("../config/auth");
const db = require("../models");
const jwt = require("jsonwebtoken");
const User = db.user;

exports.signup = (req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
    });

    console.log('reg', req);

    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        res.status(200).send({ message: "User was registered successfully!" });


    });
};

exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            console.log(req.body.password, user.password);

            const passwordIsValid = req.body.password === user.password;

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });


            res.status(200).send({
                id: user._id,
                email: user.email,
                accessToken: token
            });
        });
};