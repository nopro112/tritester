importScripts("https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js");

var config = {
	apiKey: "xxxx",
	authDomain: "xxx-xx-xxx.firebaseapp.com",
	databaseURL: "https://xx-xx-xx.firebaseio.com",
	projectId: "fcm-xx-xx",
	storageBucket: "xx-xxx-xxxx.appspot.com",
	messagingSenderId: "xxxxxxx",
	appId: "xxxxxxxxxxxxxxxxx"
};


firebase.initializeApp(config);
notification = [];
icon = '';
base_url = '';
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {

  notification = JSON.parse(payload.data.data);
  icon = notification.icon;
  base_url = notification.base_url;

  if (notification.type == 'message') {
    var picture = notification.title;
    var message = notification.body;
    var from_id_fmc = notification.from_id;

    // single user msg
    if (notification.chat_type == 'person') {
      const notificationTitle = picture;
      const notificationOptions = {
        body: message,
        icon: icon
      };
      return self.registration.showNotification(notificationTitle, notificationOptions);
    } else {
      // group user msg
      const notificationTitle = picture;
      const notificationOptions = {
        body: message,
        icon: icon
      };
      return self.registration.showNotification(notificationTitle, notificationOptions);
    }
  }
});

self.addEventListener('notificationclick', function (event) {
  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then(function (clientList) {
        for (var i = 0; i < clientList.length; ++i) {
          var client = clientList[i];

          if (
            (client.url === base_url && 'focus' in client) ||
            (client.url === base_url + '#' && 'focus' in client) ||
            (client.url === base_url + '/' && 'focus' in client)
          ) {
            return client.focus();
          }
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(base_url);
        }
      })
  );
});