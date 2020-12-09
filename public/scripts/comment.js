window.onload = function() {
   let comment = document.getElementById("comment")
   let commentHolder = document.getElementById("comment-holder")

   comment.addEventListener('keypress', function(e) {
       if(e.key == 'Enter') {
           if(e.target.value) {
               let postId = comment.dataset.post
               let data = {
                   body : e.target.value
               }
               let req = reqGenerate(`/api/${postId}/comment`, 'POST', data)
               fetch(req)
               .then(res => res.json())
               .then(data => {
                   let commentElement = createCommet(data)
                   commentHolder.insertBefore(commentElement, commentHolder.children[0])
                   e.target.value = ''
               })
               .catch(e => {
                   console.log(e)
                   alert(e.message)
               })
           } else {
               alert('Please Enter a valid comment')
           }
       }
   })
   commentHolder.addEventListener('keypress', function(e) {
       if(commentHolder.hasChildNodes(e.target)) {
           if(e.key === 'Enter') {
               let commentId = e.target.dataset.comment
               let value = e.target.value
               if(value) {
                   let data = {
                       body : e.target.value
                   }
                   let req = reqGenerate(`/api/comment/${commentId}/replies`, 'POST', data)
                   fetch(req)
                   .then(res => res.json())
                   .then(data => {
                       let replayElement = createReplay(data)
                       let parent = e.target.parentElement
                       parent.previousElementSibling.appendChild(replayElement)
                       e.target.value = ''
                   })
                   .catch(e => {
                       console.log(e)
                       alert(e.message)
                   })
               } else {
                   alert('Please Provide a Valid Text')
               }
           }
       }
   })
}

function reqGenerate(url, method, body) {
    let headers = new Headers()
    headers.append('Accept','Application/JSON')
    headers.append('Content-Type','Application/JSON')

    let req = new Request(url, {
        method,
        headers,
        body : JSON.stringify(body),
        mode : 'cors'
    })
    return req
}

function createCommet(comment) {
    let innerHTML = `
    <img 
        src="${comment.user.profile_pic}"
        class="rounded-circle mx-3 my-3" style="width: 40px">
        <div class="media-body my-3">
            <p>${comment.body}</p>
            <small>
                    moment( ${comment.createdAt })
            </small>
            <div class="my-3">
                <input type="text" placeholder="Please Enter to Replay" class="form-control"
                name="replay" data-comment="${ comment._id }">
            </div>
        </div>
    `
    let div = document.createElement('div')
    div.className = 'media-border'
    div.innerHTML = innerHTML

    return div
}

function createReplay(replay) {
    let innerHTML = `
        <img src="${ replay.profilePics }"
         class="align-selt-start mr-3 rounded-circle" 
         style="width: 40px">
        <div class="media-body">
            <p> ${ replay.body }</p>
        </div>
    `
    let div = document.createElement('div')
    div.className = 'media mt-3'
    div.innerHTML = innerHTML

    return div
}