(function ($, URI) {

  ZoomMtg.preLoadWasm();
  ZoomMtg.prepareJssdk();

  var join = function () {

    var leaveUrl = 'https://wisembly.github.io/wisembly-zoom/end.html';

    var apiEndpoints = {
      prod: 'https://api.wisembly.com/core/zoom',
      prp: 'https://prpapi.wisembly.com/core/zoom',
      dev: 'http://api.wisembly.biz/app_dev.php/core/zoom',

    };

    var uri = new URI(window.location);
    var search = uri.search(true);

    if (!search.meeting) {
      document.getElementById('container').innerText = 'An error occured. No meeting number given.';
      return;
    }

    var meetingNumber = search.meeting;
    var role = search.role || 0;
    var userName = search.name || 'anonymous_' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

    var apiEndpoint = apiEndpoints[search.env] || apiEndpoints['prod'];

    $.post(apiEndpoint, {
        number: meetingNumber,
        role: search.role || 0
      },
      function (data) {
        if (!data.success) {
          document.getElementById('container').innerText = 'An error occured while trying to connect.';
          return;
        }

        document.getElementById('container').innerText = 'Meeting found! Loading Zoom web player...';

        var apiKey = data.success.data.api_key;
        var signature = data.success.data.signature;

        console.log('init');
        ZoomMtg.init({
          leaveUrl: leaveUrl,
          isSupportAV: search.onedir ? false : true,
          disableJoinAudio: false,
          success () {
            ZoomMtg.join({
              meetingNumber: meetingNumber,
              userName: userName,
              userEmail: search.email || '',
              passWord: search.password || '',
              signature: signature,
              apiKey: apiKey,
              success (res) {
                document.getElementById('container').innerText = 'Meeting loaded!';

                setTimeout(function () {
                  document.getElementById('navbar').classList.add('u-hidden');
                }, 500);
              },
              error (res) {
                document.getElementById('container').innerText = 'Error while trying to join. ' + res.errorMessage;
              }
            });
          },
          error (res) {
            document.getElementById('container').innerText = 'Error while loading Zoom player.';
          }
        })
      })
      .fail(function (err) {
        document.getElementById('container').innerText = 'Error while generating Zoom player signature.';
        console.log(err.responseJSON.error.code);
      });
  };

  join();

})(jQuery, URI);
