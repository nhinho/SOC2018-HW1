
var express = require('express'),
    app = express(),
    path = require('path');
var readline = require('readline');
var fs = require('fs');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('/Users/TuPham/Downloads/MLDS_hw2_data/testing_data/vod'));

//HTTP server Listen
var server = app.listen(55555, function(){
    console.log('This server is running on the port ' + this.address().port );
});

app.get('/Hello', function(req, res){
	console.log('GET Hello from a client');
 	res.send('Hello, world!');
  	res.end();
});

/*
    video list
 */
var filepath = '/Users/TuPham/Downloads/MLDS_hw2_data/';

var myInterface = readline.createInterface({
    input: fs.createReadStream(filepath + 'testing_id.txt')
});

var video_list = [];
var lineno = 0;
myInterface.on('line', function (line) {
    lineno++;
    video_list.push({id: line, name: 'video ' + lineno, status: 0 });
});

var execsync= require('child_process').execSync;
var exec = require('child_process').exec;

app.post('/',  function (req, res) {

    if (req.body.name === 'get_video_list') {
        res.send(video_list);
    }
    if(req.body.name === 'dash') {
        /*
        DASH video selected if video is not encoded
         */
        var i = 0;
        while(i < video_list.length){
            if(video_list[i].id === req.body.id){
                if(video_list[i].status === 0){
                    //video not encode
                    var filepath = '/Users/TuPham/Downloads/MLDS_hw2_data/testing_data/vod';
                    var input = req.body.id;
                    var tsfile = input + '.ts';
                    var output = tsfile + '.mp4';


                    var cmd = 'cd ' + filepath +'\n' +
                        'ffmpeg -i ' + input + ' -vcodec libx264 -s 1280x720 -b:v 2000k -keyint_min 150 -an ' + tsfile + '\n' +
                        'MP4Box -add ' + tsfile +' '+ output + '\n' +
                        'MP4Box -dash 5000 -segment-name ./segment_ ' + output;
                    execsync(cmd, {stdio: 'pipe'});
                    video_list[i].status = 1;
                }
                res.send('video encoded!');
                res.end();
                break;
            }
            i++;
        }
    }
    if(req.body.name === 'stream'){
        /*
        stream video selected if video has been encoded
         */
        var i = 0;
        while(i < video_list.length){
            if(req.body.id === video_list[i].id){
                if(video_list[i].status === 1){
                    //send url
                    var url = '/Users/TuPham/Downloads/MLDS_hw2_data/testing_data/vod/' + req.body.id + '.ts_dash.mpd';
                    //res.send({id: url, name: 'url'});

                    // send caption
                    var caption = 'some caption';
                    fs.writeFile('/Users/TuPham/Downloads/MLDS_hw2_data/testing_id1.txt',req.body.id , function () {
                            var cmd = 'cd /Users/TuPham/OneDrive/Fall2018/EE614_Service_Oriented_Computing_Systems/HW/HW1/MLDS2017/hw2\n' +
                                'sh run.sh /Users/TuPham/Downloads/MLDS_hw2_data/testing_id1.txt /Users/TuPham/Downloads/MLDS_hw2_data/testing_data/feat';
                            execsync(cmd);
                            fs.readFile('/Users/TuPham/OneDrive/Fall2018/EE614_Service_Oriented_Computing_Systems/HW/HW1/MLDS2017/hw2/output.json', function (err, data) {
                                console.log(data);
                            })
                        });

                    res.send({id: caption, name: 'caption'});
                    res.end();
                }
                else{
                    res.send('you need to encode video first!');
                }
                break;
            }
            i++;
        }
    }

});





