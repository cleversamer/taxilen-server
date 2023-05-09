const { User } = require("../../../models/user/user");
const jwt = require("jsonwebtoken");
const userAgentParser = require("ua-parser-js");
const requestIp = require("request-ip");

module.exports.parseUserAgent = (request) => {
  try {
    const userAgent = userAgentParser(request.headers["user-agent"]);

    const { os, browser, cpu, device, engine, ua } = userAgent;
    const osName =
      os.name && os.version ? `${os.name} ${os.version}` : os.name || "";

    const ip = requestIp.getClientIp(request);

    return {
      osName,
      ip,
      browser,
      cpu,
      device,
      engine,
      ua,
    };
  } catch (err) {
    throw err;
  }
};

module.exports.findAdmins = async () => {
  try {
    return await User.find({ role: "admin", deleted: false });
  } catch (err) {
    throw err;
  }
};

module.exports.validateToken = (token) => {
  try {
    return jwt.verify(token, process.env["JWT_PRIVATE_KEY"]);
  } catch (err) {
    throw err;
  }
};
