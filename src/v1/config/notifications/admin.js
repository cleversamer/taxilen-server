const Notificatin = require("./Notification");

module.exports = {
  serverErrorsOccurred: (count) =>
    new Notificatin(
      `${count} errors occurred on the server`,
      `هناك ${count} أخطاء حدثت على الخادم`,
      `There are ${count} errors that occurred on the server that need to be fixed. This may be affecting the performance of the application server. Please contact the development team immediately`,
      `هناك ${count} أخطاء حدثت على الخادم بحاجة إلى إصلاح، ربما يؤثر هذا على أداء خادم التطبيق. يرجى الاتصال بفريق التطوير على الفور`,
      "",
      "serverErrors"
    ),
  newServerErrorJustHappened: (serverErrorId) =>
    new Notificatin(
      "An error has now occurred on the server",
      "حدث خطأ الآن على الخادم",
      `An error has now occurred on the server and it needs to be fixed. This may be affecting the performance of the application server. Please contact the development team immediately`,
      `حدث خطأ الآن على الخادم ويحتاج إلى الإصلاح. قد يؤثر هذا على أداء خادم التطبيق. يرجى الاتصال بفريق التطوير على الفور`,
      "",
      "serverErrors",
      serverErrorId
    ),
};
