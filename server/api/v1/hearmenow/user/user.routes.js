const userController = require("./user.controller");
const express = require("express");
const noAuthRoutes = express.Router();
const router = express.Router();


/*
 * Used to retrieve all users
 *
 * Route: /user (GET)
 */
router.get("", userController.getAllUsers);

/*
 * Used login a user
 *
 * Route: /user/login (POST)
 */
noAuthRoutes.post("/login", userController.login);

/*
 * Used logout a user
 *
 * Route: /user/logout (POST)
 */
router.post("/logout", userController.logout);

/*
 * Used to get a user activity (user with populated project reference fields)
 *
 * Route: /user/activities/:userId (GET)
 */
router.get("/activities/:userId", userController.getUserActivities);

/*
 * Used to get a add a project to a user's favorites list
 *
 * Route: /user/favorite (POST)
 */
router.post("/favorite", userController.addToFavorites)


/*
 * Used to remove a project from a user's favorites list
 *
 * Route: /user/favorite/:projectId (DELETE)
 */
router.delete("/favorite/:projectId", userController.removeFromFavorites)

/*
 * Used to get, update, and delete a specific user
 *
 * Route: /user/:userId (GET, PUT, DELETE)
 */
router.route("/:userId").get(userController.getUser).put(userController.updateUser).delete(userController.deleteUser);

/*
 * Used to create a new user
 *
 * Route: /user (POST)
 */
noAuthRoutes.post("/", userController.createUser);

/**
 * Used to confirm a new email
 * 
 * Route: /user/confirmEmail (POST)
 */
router.post('/confirmEmail', userController.confirmEmail);

/**
 * Used to update user email
 * 
 * Route: /user/updateEmail (POST)
 */
 router.post('/updateEmail', userController.updateEmail);

/**
 * Used to resend email token
 * 
 * Route: /user/resendToken (POST)
 */
router.post('/resendToken', userController.resendToken);

/*
 * Used to start password reset process
 *
 *  Route: /user/forgotPassword (POST)
 */
noAuthRoutes.post("/forgotPassword", userController.forgotPassword);

/*
 * Used to reset user's password
 *
 *  Route: /user/resetPassword (POST)
 */
noAuthRoutes.post("/resetPassword", userController.resetPassword);

/**
 * Used to change user's password
 * 
 *  Route: /user/changePassword (POST)
 */
router.post("/changePassword", userController.changePassword)

/**
 * Used to query user groups
 * 
 *  Route: /user/group/:searchQuery (GET)
 */
 noAuthRoutes.get("/group/:searchQuery", userController.searchGroups)

/**
 * Used to change ban a user (Admin only)
 * 
 *  Route: /user/ban (POST)
 */
router.post("/ban", userController.banUser)

/**
 * Used to change un ban a user (Admin only)
 * 
 *  Route: /user/unban (POST)
 */
router.post("/unban", userController.unBanUser)


module.exports = { router, noAuthRoutes };
