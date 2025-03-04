const sendToken = (user, statusCode, res) => {
    // Generate JWT token
    const token = user.getJwtToken(); 

    // Options for Cookies
    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "Strict",
    };

    res.status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
            token,
        });
};

module.exports = sendToken;
