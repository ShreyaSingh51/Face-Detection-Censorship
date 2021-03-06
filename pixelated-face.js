
const video  = document.querySelector('.webcam');
const canvas = document.querySelector('.video');
const ctx=canvas.getContext('2d');

const faceCanvas=document.querySelector('.face');
const facectx=faceCanvas.getContext('2d');

const optionInputs=document.querySelectorAll('.controls input[type="range"]')

const options={
    SIZE:10,
    SCALE:1.35,
};

const faceDetector=new FaceDetector();
//console.log(video,canvas,faceCanvas,faceDetector);

async function populateVideo(){
    const stream= await navigator.mediaDevices.getUserMedia({
        video:{width:800,height:450},
    });
    console.log(stream);
    video.srcObject=stream;
    await video.play();

    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
    faceCanvas.width=video.videoWidth;
    faceCanvas.height=video.videoHeight ;
};

async function detect(){
    const faces=await faceDetector.detect(video);
    console.log(faces.length);
    faces.forEach(drawFace);
    faces.forEach(censor);
    requestAnimationFrame(detect); //recursion
}

function drawFace(face){
    console.log(face);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle='#ffc600';
    ctx.lineWidth=2;
    const {left,top,height,width}=face.boundingBox;
    ctx.strokeRect(left,top,width,height);

}

function handleOptions(event){
    const {name,value}=event.currentTarget;
    options[name]=parseFloat(value);
}

Array.from(optionInputs).forEach(input => input.addEventListener('input',handleOptions));


function censor(face){
    const faceDetail=face.boundingBox;
    facectx.imageSmoothingEnabled=false;
    facectx.clearRect(0,0, faceCanvas.width,faceCanvas.height);
    facectx.drawImage(
        video,
        faceDetail.x,
        faceDetail.y,
        faceDetail.width,
        faceDetail.height,

       
        faceDetail.x,
        faceDetail.y,
        options.SIZE,
        options.SIZE
    );
    const width=faceDetail.width*options.SCALE;
    const height=faceDetail.height*options.SCALE;
    facectx.drawImage(
        video,
        faceDetail.x,
        faceDetail.y,
        options.SIZE,
        options.SIZE,

       
        faceDetail.x-(width-faceDetail.width)/2,
        faceDetail.y-(height-faceDetail.height)/2,
        width,
        height,
       
    );


}
populateVideo().then(detect);


