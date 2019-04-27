const mqlight = require('mqlight');

const startClient = ()=>{
    return new Promise((resolve, reject) => {
        const service = `amqp://${process.env.MQLIGHT_SERVICE_HOST}:${process.env.MQLIGHT_SERVICE_PORT_AMQP}`;
        console.log(`attempting to connect to mq service `)
        const sendClient = mqlight.createClient({service});
        sendClient.on('started', function() {
            console.log('started mq');
            resolve(sendClient)
        });
    });
}
const sendMessage = ({client, topic, data}) =>{
    return new Promise((resolve, reject)=>{
        client.send(topic, data, function (err, data) {
            if(err){
                reject(err);
            }
            console.log('Sent mq:', data, data);
            resolve();
        });
    });
}
module.exports= {
    sendMessage,
    startClient
}