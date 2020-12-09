
window.onload = function () {
    tinymce.init({
        selector: '#tiny-mce-post-body',
        plugins: ["a11ychecker advcode advlist lists link checklist autolink autosave code",
            'preview', 'searchreplace', 'wordcount', 'media table emotions image imagetools'],
        toolbar: 'bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | forecolor backcolor emotions |code preview',
        height: 300,
        automatic_upload: true,
        images_upload_url: '/uploads/postimage',
        relative_urls = false,
        image_upload_handler: function (blobInfo, success, failures) {
            let headers = new Headers()
            headers.append('Accept', 'Application/JSON')

            let formData = new FormData()
            formData.append('post-image', blobInfo.blob(), blobInfo.filename())

            let req = new Request('/upload/postImage', {
                method: 'POST',
                headers,
                node: 'cors',
                body: formData
            })
            fetch(req)
                .then(res => { res.json()})
                .then(data => success(data.imageUrl))
                .catch(() => failures('HTTP ERROR'))
        }
    });
}