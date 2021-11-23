const socket = io();

async function loadMsgs() {

    const allMsgs = await axios.get('/allmessages');
    console.log(allMsgs);

    for(let msg of allMsgs.data) {
        let today = new Date();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        $('#all-msg-container').append(`<li> <span> ${msg.user} ${time} </span> <p> ${msg.content} </p></li>`);
    }
}

loadMsgs();

$('#send-msg-btn').click(() => {
    const textMsg = $('#msg-text').val();
    socket.emit('send-msg', {
        user: currentUser,
        msg:textMsg
    })
    $('#msg-text').val("");
})

socket.on('recieved-msg', (data)=> {
    console.log(data.msg);

    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    $('#all-msg-container').append(`<li> <span> ${data.user} ${time} </span> <p> ${data.msg} </p></li>`);
})

console.log(currentUser);