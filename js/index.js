
const dropZone = document.querySelector('.drop-zone')

const browseBtn = document.querySelector('.browsebtn')
const fileInput = document.querySelector('#fileInput')
const copyBtn = document.querySelector('#copyBtn')

const url = 'https://innshare.herokuapp.com/'
const uploadUrl = `${url}api/files`
const emailUrl = `${url}api/files/send`

const bgProgress = document.querySelector('.bg-progress')
const progressContainer = document.querySelector('.progress-container')
const progressBar = document.querySelector('.progress-bar')
const status = document.querySelector('.status')
const progressPercent = document.querySelector('#progressPercent')
const fileInputUrl = document.querySelector('#fileUrl')
const shareContainer = document.querySelector('.share-container')
const formEmail = document.querySelector('#formId')
const toastMessage = document.querySelector('.toast')
const maxfileSize = 100 * 1024 * 1024 // 100MB
// For dragging image here
dropZone.addEventListener('dragover', (e) =>{
    e.preventDefault()
    // console.log('dragging');

   if(!dropZone.classList.contains('dragged')){
       dropZone.classList.add('dragged')
   }
})

// For leaving dragging image here
dropZone.addEventListener('dragleave', (e) =>{
    e.preventDefault()
    dropZone.classList.remove("dragged");
})

// For  dropping image here
dropZone.addEventListener('drop', (e) =>{
    e.preventDefault()
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files
    if (files.length) {
        fileInput.files = files
        uploadFile()
    }
})

//For Browse button
 browseBtn.addEventListener('click', ()=>{
     fileInput.click()
 })


 // Uploading files here

 const uploadFile = () =>{
     if(fileInput.files.length > 1){
         resetFileInput()
         showToast('Upload only 1 file at a time!')
         return
        }
        const file = fileInput.files[0]
        if(file.size  > maxfileSize){
            showToast("Can't upload max size will be less than 100MB")
            resetFileInput()
            return
        }
        progressContainer.display = 'block'
     const formData = new FormData()

     formData.append('myfile',file[0])

      // Show the uploader
      progressContainer.style.display = 'block'
       
      // Upload files 
      const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () =>{
            if(xhr.readyState === XMLHttpRequest.DONE){
                console.log(xhr.response)
                showLink(JSON.parse(xhr.response))
            }
        } 
      xhr.upload.onprogress = updateProgress;
      xhr.open('POST', uploadUrl)
      xhr.send(formData)

 };


 // Update progress
 const updateProgress = (e) =>{
    let percent = Math.round((100 * e.loaded) / e.total);
    console.log(percent);
    progressPercent.innerText = percent;
    const scaleX = `scaleX(${percent / 100})`;
    bgProgress.style.width = scaleX;
    progressBar.style.transform = scaleX;
    progressPercent.innerText  = percent;
 };

 // ShowLink

    const showLink = ({file : url}) => {
        resetFileInput()
        formEmail[2].removeAttribute('disabled')
        progressContainer.style.display = 'none'
        fileInputUrl.value = url
    }

 copyBtn.addEventListener('click', ()=>{
        fileInputUrl.select()
        document.execCommand('copy')
    });


    // Reset file input

    const resetFileInput = () =>{
        fileInput.value = ''
    }

// Sending Form

formEmail.addEventListener('click', (e)=>{
        e.preventDefault()
        const url = fileInputUrl.value 
        const formData = {
            uuid : url.split('/').splice(-1, 1)[0],
            emailTo: formEmail.elements['to_email'].value,
            emailFrom : formEmail.elements['from_email'].value
        }
         
        formEmail[2].setAttribute('disabled','true')
         
        fetch(emailUrl, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(FormData)
            }).then(res=> res.json())
            .then(({success})=>{
                if(success){
                    shareContainer.style.display = 'none'
                }
            })
});
 

// Toast message
let toastTimer;
const showToast = (msg) =>{
    toastMessage.innerText = msg;
    toastMessage.style.transform = 'translate(-50% , 0)'
     clearTimeout(toastMessage)
     toastTimer =  setTimeout(()=>{
        toastMessage.style.transform = 'translate(-50% , 60px)'
     },2000);
}