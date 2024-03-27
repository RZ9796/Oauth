const { ContinueWithGoogle, logout } = require("../controller/authController");

const router = require("express").Router();

router.post("/continue-with-google", ContinueWithGoogle);
router.post("/logout", logout);

module.exports = router;
