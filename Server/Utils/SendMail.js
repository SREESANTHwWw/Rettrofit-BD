const nodemailer = require("nodemailer");
const ErrorHandler = require("./ErrorHandler");
const CatchAsyncError = require("../Middlewares/CatchAsyncError");

const SendMail = CatchAsyncError(async (options, next) => {
  try {
    // 📌 Create Transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true, // Important for port 465
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    //  Email to Store Owner/Admin
    let adminMailOptions = {
      from: process.env.SMTP_EMAIL,
      to: process.env.SMTP_OWNER, 
      subject: `New Order - ${options._id}`,
      html: `
        <h1>📦 New Order Received!</h1>
        <h3>Customer Details:</h3>
        <p><strong>Name:</strong> ${options.name}</p>
        <p><strong>Address:</strong> ${options.address}</p>
        <p><strong>Phone:</strong> ${options.number}</p>
        <p><strong>Email:</strong> ${options.email}</p>
        <p><strong>City:</strong> ${options.city}</p>
        <p><strong>Pincode:</strong> ${options.pincode}</p>
        <h3>Order Details:</h3>
        <p><strong>Items:</strong> ${options.productname}</p>
        <p><strong>Order Date:</strong> ${new Date(options.date).toLocaleString()}</p>
      `,
    };

    // Email to Customer (Order Confirmation)
    let customerMailOptions = {
      from: process.env.SMTP_EMAIL,
      to: options.email,
      subject: "🛍️ Order Confirmation - Thank You for Your Purchase!",
      html: `
         <h1><center> 🤖 RettroFit </center></h1>
        <h2>✅ Thank You for Your Order, ${options.name}!</h2>
        <p>We have received your order and will process it soon.</p>
        <p><strong>Order Items:</strong> ${options.productname}</p>
        <p>📅 <strong>Order Date:</strong> ${new Date(options.date).toLocaleString()}</p>
        <p>🚚 We will notify you when your order is shipped.</p>
        <p>Thank you for shopping with us! 🎉</p>
      `,
    };

    
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(customerMailOptions);

    console.log("✅ Emails sent successfully");
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = SendMail;
