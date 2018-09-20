(function () {

  //pre load wasm when user type meeting number. it can save time when use joining meeting.
  function requestWasmFunc(url) {
      var xmlhttp;
      if (window.ActiveXObject) xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
      else xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          try {
              console.log('pre load wasm success:', url);
          } catch (e) {
              console.warn('pre load wasm fail:', url);
          }
        }
      };
      xmlhttp.open("GET", url, true);
      xmlhttp.send();
  }

  var userAgent = navigator.userAgent.toLowerCase();
  var isOpera = /opera|opr\/[\d]+/.test(userAgent);
  var isIE = !isOpera && /(msie|trident)/.test(userAgent);

  var isSupportAv = true;
  if (isSupportAv && !isIE) {
      var fetchAudioUrl = 'lib/av/audio.encode.wasm';
      var fetchVideoUrl = 'lib/av/video.decode.wasm';
      requestWasmFunc(fetchAudioUrl);
      requestWasmFunc(fetchVideoUrl);
  }

  var fetchSharingUrl = 'lib/av/sharing.wasm';
  requestWasmFunc(fetchSharingUrl);

})();
