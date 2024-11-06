const key = "AIzaSyDjq7WxIwA57mQNvFkQMc5i_HWzgpgbKK4";

const token = "fZ06InCsemaQwz55lBB_kf:APA91bHjTx_tNC8myLErOP1LhUwVP7QyNHlYl7WZ--tMS6a_R8aGSQxDYf_bsNUYYjEygRtZnGwBt6geg_MADT6WHc2lB47SZe5nTW-Kyldc_HpwE0dpY4ykVzQj19zZtJJqCPzeK8xH";

const notification = 
  {
    "message": {
      "topic": "test",
      "notification": {
        "title": "Flurry",
        "body": "Hey Flurries!",
      },
      "data": {
        "story_id": "story_001",
      }
    }
  }

function notificationCall() {
  fetch("https://fcm.googleapis.com/v1/projects/flurry-chat/messages:send", {
    "method": "POST",
    "headers": {
      // "Authorization": import.meta.env.GOOGLE_APPLICATION_CREDENTIALS,
      "Content-Type": "application/json",
    },
    "body": JSON.stringify({
      "notification": notification,
      "to": token,
      "direct_boot_ok": true,
    })
  })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log("An error occurred!", err);
    });
}

