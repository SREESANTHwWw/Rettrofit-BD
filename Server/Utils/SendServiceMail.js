const nodemailer = require("nodemailer");
const ErrorHandler = require("./ErrorHandler");
const CatchAsyncError = require("../Middlewares/CatchAsyncError");

const SendServiceMail = CatchAsyncError(async (options, next) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: options.email,
      subject: "Service Order",
      html: `
            <h1><center> 🤖 RettroFit </center></h1>        
            <h2>✅ Thank You for Your Order, ${options.name}!</h2>
            <p>We have received your order and will process it soon.</p>
            <p><strong>Order Items:</strong> ${options.servicename}</p>
            <p>📅 <strong>Order Date:</strong> ${new Date(
              options.date
            ).toLocaleString()}</p>            
            <p>🚚 We will notify you when your order is shipped.</p>            
            <p>Thank you for shopping with us! 🎉</p>           
  `,
    };
    let adminMailOptions = {
        from: process.env.SMTP_EMAIL,
        to: process.env.SMTP_OWNER, 
        subject: `Service Order`,
        html: `
          <h1>📦 New Service Order Received!</h1>
          <h3>Customer Details:</h3>
          <p><strong>Name:</strong> ${options.name}</p>
          <p><strong>Address:</strong> ${options.address}</p>
          <p><strong>Phone:</strong> ${options.number}</p>
          <p><strong>Email:</strong> ${options.email}</p>
          <p><strong>City:</strong> ${options.city}</p>
          <p><strong>Pincode:</strong> ${options.pincode}</p>
          <h3>Order Details:</h3>
          <p><strong>Items:</strong> ${options.servicename}</p>
          <p><strong>Order Date:</strong> ${new Date(options.date).toLocaleString()}</p>
        `,
      };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(adminMailOptions);
    console.log("✅ Emails sent successfully");
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = SendServiceMail;
