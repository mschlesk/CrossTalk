
export default class Gatherer {

  constructor(socket, idToken) {
    if (arguments.length < 2) { throw 'Gatherer requires a socket and and id token'; };
    this.socket = socket;
    this.idToken = idToken;
    this.startTime = null;
    this.fromLang = null;
    this.toLang = null;

    // Class Method Bindings
    this.startCallWatcher = this.startCallWatcher.bind(this);
    this.sendCallData = this.sendCallData.bind(this);
  };

  startCallWatcher(fromLang, toLang) {
    this.startTime = new Date;
    this.fromLang = fromLang;
    this.toLang = toLang;
    console.log('MetricsGatherer: Started watching video call');
  };

  sendCallData() {
    console.log('MetricsGatherer: Sending call data');
    if (this.startTime) {
      let endTime = new Date;
      this.socket.emit('metric', {
        type: 'call',
        idToken: this.idToken,
        sessionData: {
          date: this.startTime,
          duration: Math.round(( endTime - this.startTime ) / 1000),  // The call duration in seconds
          fromLang: this.fromLang,
          toLang: this.toLang
        }
      });
      this.startTime = null;  // Reset start time, just in case
    } else {
      console.error('MetricsGatherer: No data to send. Was .startCallWatcher() called?');
    }
  };

}
