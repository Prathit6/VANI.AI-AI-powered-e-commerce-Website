const adminModel = require("../models/admin.model");
const { responseReturn } = require("../utils/response");
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/tokenCreate");

class AuthController {
  admin_login = async (req, res) => {
    console.log("🔹 Route Hit: /api/admin-login");
    console.log("🔹 Body received:", req.body);

    const { email, password } = req.body;

    try {
      const admin = await adminModel.findOne({ email }).select("+password");
      console.log("🔹 Found admin:", admin);

      if (!admin) {
        return responseReturn(res, 400, { error: "Email not found" });
      }

      // Password check
      const match = await bcrypt.compare(password, admin.password);
      if (!match) {
        return responseReturn(res, 400, { error: "Incorrect password" });
      }

      // Create token
      const token = await createToken({
        id: admin.id,
        role: admin.role,
      });

      // Set cookie
      res.cookie("accessToken", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false,
      });

      // Success response
      return responseReturn(res, 200, { token, message: "Login Success" });
    } catch (error) {
      console.error("Error:", error.message);
      return responseReturn(res, 500, { error: error.message });
    }
  };

  getUser = async (req, res) => {
    const { id, role } = req;

    try {
      if (role === "admin") {
        const user = await adminModel.findById(id);
        responseReturn(res, 200, { userInfo: user });
      } else {
        console.log("Seller Info");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
}

module.exports = new AuthController();
