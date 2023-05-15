const Notificatin = require("./Notification");

module.exports = {
  hasUnreadNotifications: () =>
    new Notificatin(
      "You have unread notifications",
      "لديك إشعارات غير مقروءة",
      "You have unread notifications, please check it out",
      "لديك إشعارات غير مقروءة، يرجى تفحّصها",
      "",
      "notifications"
    ),

  newLoginActivity: (date) =>
    new Notificatin(
      "Security Alert! Recent login activity detected on your account",
      "تنبيه أمان! تم إكتشاف نشاط تسجيل الدخول الأخير على حسابك",
      `There was a login to your account from a new device on ${date.toDateString()}. Review it now.`,
      `كان هناك تسجيل دخول إلى حسابك من جهاز جديد في ${date.toDateString()}، راجعه الآن`,
      "",
      "loginActivities"
    ),

  inactiveUser: () =>
    new Notificatin(
      "We miss you!",
      "نحن نفتقدك!",
      `Hello, it seems like you haven't been using our app lately. We wanted to remind you that there are new features and updates that you might be interested in. We'd love to see you back on the app and using its features! If you have any feedback or suggestions for us, we'd love to hear from you. Thank you for being a valued user`,
      `مرحبًا، يبدو أنك لم تستخدم تطبيقنا مؤخرًا. أردنا أن نذكرك بأن هناك ميزات وتحديثات جديدة قد تكون مهتمًا بها. نود أن نراك مرة أخرى على التطبيق واستخدام ميزاته! إذا كان لديك أي ملاحظات أو اقتراحات لنا، يسعدنا أن نسمع منك. شكرا لكونك مستخدم قيم`
    ),

  referredUser: () =>
    new Notificatin(
      "You've earned a reward!",
      "لقد ربحت مكافأة!",
      `Congratulations! You have successfully referred a new user to our app. As a token of our appreciation, we have credited your account with a reward. Thank you for spreading the word about our app and helping us grow. Keep up the good work!`,
      `تهانينا! لقد نجحت في إحالة مستخدم جديد إلى تطبيقنا. كعربون تقدير منا ، قمنا بإضافة مكافأة إلى حسابك. شكرًا لك على نشر الكلمة حول تطبيقنا ومساعدتنا على النمو. ثابر على العمل الجيد!`
    ),
};
