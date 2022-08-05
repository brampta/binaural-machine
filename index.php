<?php
define('BP',dirname(__FILE__));
?>
<html>
<head>
    <script>
        var samples = new Array();
    </script>
    <link rel="stylesheet" href="/binaural_machine.css">
</head>
<body>

    <h1>My Supa Simple Binaural Machine!</h1>

    <h4>Binaural beat:</h4>

    freq left: <input type="number" id="freq1" class="freq" value="220.25" step=".01"> | freq right: <input type="number" id="freq2" class="freq" value="232.21" step=".01"><br>
    (difference: <span id="freq_difference"></span>Hz)<br>
    volume: <input type="number" id="vol" class="vol" value="0.24" step=".01"><br>
    <button id="start_oscillator">play</button>
    <button id="stop_oscillator">stop</button>

    <h4>Background effect:</h4>
    <h5>Thunder:</h5>
    <?php
    $glob_path = BP."/samples/thunderstorm/*";
    $files = glob($glob_path);
    foreach($files as $file){
        $sample_url = '/samples/thunderstorm/'.basename($file);
        $sample_id = md5($sample_url);
        echo '<script>
    let sample = new Array();
    sample["url"]='.json_encode($sample_url).';
    samples['.json_encode($sample_id).'] = sample;
</script>
'.basename($file).'<br>
<button class="play_sample" data-sample-id="'.$sample_id.'" style="cursor:pointer">play</button>
<button class="stop_sample" data-sample-id="'.$sample_id.'" style="cursor:pointer">stop</button>
volume: <input type="number" id="vol_'.$sample_id.'" class="vol" value="0.11" step=".01"><br>';
    }
    ?>

    <h4>Noise:</h4>
    Brown noise:
    <button id="play_brownnoise">play</button>
    <button id="stop_brownnoise">stop</button>
    volume: <input type="number" id="vol_brownnoise" class="vol" value="0.07" step=".01">

    <!-- jQuery -->
    <link rel="stylesheet" href="//code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
    <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>

    <script type="text/javascript" src="binaural_machine.js"></script>
</body>
</html>