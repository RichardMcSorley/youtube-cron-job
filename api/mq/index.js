const mqlight = require('mqlight');

const sendMessage = (topic, topicData)=>{
    return new Promise((resolve, reject) => {
        const sendClient = mqlight.createClient({service: `amqp://${process.env.MQLIGHT_SERVICE_SERVICE_HOST}:${process.env.MQLIGHT_SERVICE_SERVICE_PORT_AMQP}`});
        sendClient.on('started', function() {
            sendClient.send(topic, topicData, function (err, data) {
                if(err){
                    reject(err);
                }
                console.log('Sent:', data);
                sendClient.stop();
                resolve();
            });
        });
    });
}
module.exports= {
    sendMessage
}