
//var connection = new signalR.HubConnectionBuilder().withUrl("/notificationHub").build();

//connection.start().then(function () {
//    debugger;
//    console.log('connected to hub');
//}).catch(function (err) {
//    return console.error(err.toString());
//});

//connection.on("OnConnected", function () {
//    OnConnected();
//});

//function OnConnected() {
//    var username = $('#username').html();
//    console.log("UserName");
//    console.log(username);
//    connection.invoke("SaveUserConnection", username).catch(function (err) {
//        return console.error(err.toString());
//    })
//}

//connection.on("ReceivedNotification", function (message) {
//    console.log(message);
//    DisplayGeneralNotification(message, 'General Message');
//});

//connection.on("ReceivedPersonalNotification", function (message, username) {
//    DisplayPersonalNotification(message, 'Hey ' + username);
//});

////connection.on("ReceivedGroupNotification", function (message, username) {
////    DisplayGroupNotification(message, 'Team ' + username);
////});