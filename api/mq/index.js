const mqlight = require('mqlight');

const sendMessage = (topic, topicData)=>{
    return new Promise((resolve, reject) => {
        const sendClient = mqlight.createClient({service: `amqp://${process.env.MQLIGHT_SERVICE_HOST}:${process.env.MQLIGHT_SERVICE_PORT_AMQP}`});
        sendClient.on('started', function() {
            console.log('started mq');
            sendClient.send(topic, topicData, function (err, data) {
                if(err){
                    reject(err);
                }
                console.log('Sent mq:', data, topicData);
                sendClient.stop();
                resolve();
            });
        });
    });
}
module.exports= {
    sendMessage
}