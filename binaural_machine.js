var osci1 = null;
var osci2 = null;
var oscis = new Array();
var gains = new Array();

var brownNoise;
var brownNoiseGain;
function brownnoise(){
    let audioCtx = new AudioContext();
    var bufferSize = 4096;
    brownNoise = (function() {
        var lastOut = 0.0;
        var node = audioCtx.createScriptProcessor(bufferSize, 1, 1);
        node.onaudioprocess = function(e) {
            var output = e.outputBuffer.getChannelData(0);
            for (var i = 0; i < bufferSize; i++) {
                var white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5; // (roughly) compensate for gain
            }
        }
        return node;
    })();

    //create Gain node
    let gain = audioCtx.createGain();
    brownNoiseGain = gain;
    let volume = $('#vol_brownnoise').val();
    gain.gain.value = volume;

    brownNoise.connect(gain);
    gain.connect(audioCtx.destination);
}

function attach_sample_events(){
    for(x in samples){
        $( "#vol_" + x ).change(function() {
          change_sample_volume(x,$(this).val());
        });
    }
}
function play_sample(sample_id){
    let sample_url = samples[sample_id]['url'];
    samples[sample_id]['audio'] = new Audio(sample_url);
    let audio = samples[sample_id]['audio'];
    let volume = $('#vol_'+sample_id).val();
    console.log(volume);
    audio.volume = volume;
    audio.play();
}
function stop_sample(sample_id){
    let audio = samples[sample_id]['audio'];
    console.log(audio);
    audio.pause();
    audio.currentTime = 0;

}
function change_sample_volume(sample_id,volume){
    console.log('change sample volume',sample_id,volume);
    let audio = samples[sample_id]['audio'];
    audio.volume = volume;
}
function change_brownnoise_volume(volume){
    console.log('change brownnoise volume',volume);
    brownNoiseGain.gain.value = volume;
}


function test_oscillo_play(){
    test_oscillo_stop();
    let freq1 = $('#freq1').val();
    let freq2 = $('#freq2').val();
    let vol = $('#vol').val();
    osci1 = createOscillo(freq1,vol,-1);
    oscis[1] = osci1;
    osci2 = createOscillo(freq2,vol,1);
    oscis[2] = osci2;
    show_freq_difference();
}
function test_oscillo_stop(){
    if(osci_exists(1)){
        osci1.stop();
    }
    if(osci_exists(2)){
        osci2.stop();
    }
    gains = new Array();
}
function osci_exists(number){
    if(oscis[number] != null && typeof oscis[number] == 'object' && oscis[number].constructor.name=='OscillatorNode'){
        return true;
    }else{
        return false;
    }
}

function createOscillo(frequency,volume,panning){
    // create web audio api context
    let audioCtx = new AudioContext();

    // create Oscillator node
    let oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine'; //square, sine
    oscillator.frequency.value = frequency; // value in hertz


    //create Gain node
    let gain = audioCtx.createGain();
    gain.gain.value = volume;
    //add to gains array for later control
    gains.push(gain);

    //create Panner node
    let panner = audioCtx.createStereoPanner();
    panner.pan.value = panning;


    //connect oscillator in gain
    oscillator.connect(gain);

    //connect gain in panner
    gain.connect(panner);

    //connect panner to destination
    panner.connect(audioCtx.destination);

    //start osci
    oscillator.start();

    return oscillator;
}

var tofixy = 2;
function get_freq_difference(){
    return parseFloat(parseFloat(osci2.frequency.value).toFixed(tofixy)
        - parseFloat(osci1.frequency.value).toFixed(tofixy)).toFixed(tofixy);
}
function get_input_freq_difference(){
    return parseFloat(parseFloat($( "#freq2" ).val()).toFixed(tofixy)
        - parseFloat($( "#freq1" ).val()).toFixed(tofixy)).toFixed(tofixy);
}
function show_freq_difference(){
    let difference;
    if(osci_exists(1) && osci_exists(2)){
        difference = get_freq_difference();
    }else{
        difference = get_input_freq_difference();
    }
    $('#freq_difference').html(difference);
}

$(document).ready(function () {

    $( "#start_oscillator" ).click(function() {
      test_oscillo_play();
    });
    $( "#stop_oscillator" ).click(function() {
      test_oscillo_stop();
    });
    $( "#freq1" ).change(function() {
        if(osci_exists(1)) {
            osci1.frequency.value = this.value;
        }
        show_freq_difference();
    });
    $( "#freq2" ).change(function() {
        if(osci_exists(2)) {
            osci2.frequency.value = this.value;
        }
        show_freq_difference();
    });
    $( "#vol" ).change(function() {
        for(x in gains){
            gains[x].gain.value = this.value;
        }
    });
    $( ".play_sample" ).click(function() {
      let sample_id = $(this).attr('data-sample-id');
      console.log(sample_id);
      play_sample(sample_id);
    });
    $( ".stop_sample" ).click(function() {
      let sample_id = $(this).attr('data-sample-id');
      console.log(sample_id);
      stop_sample(sample_id);
    });

    $( "#play_brownnoise" ).click(function() {
      brownnoise();
    });
    $( "#vol_brownnoise").change(function() {
      change_brownnoise_volume($(this).val());
    });


    show_freq_difference();
    attach_sample_events();
});