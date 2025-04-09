const amqplib = require('amqplib');

const queueName = "rpc_queue";

function fibonacci(n) {
    if (n == 0 || n == 1)
        return n;
    else
        return fibonacci(n - 1) + fibonacci(n - 2);
}

const processTask = async () => {
    try {
        const connection = await amqplib.connect('amqp://user:KWRZSa76GW9NPK4l@20.188.237.198:5672/');
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: false });
        channel.prefetch(1);
        console.log(' [x] Awaiting RPC requests');

        channel.consume(queueName, msg => {
            const n = parseInt(msg.content.toString());
            console.log(" [.] fib(%d)", n);

            const fibNum = fibonacci(n);

            channel.sendToQueue(msg.properties.replyTo, Buffer.from(fibNum.toString()), {
                correlationId: msg.properties.correlationId
            });

            channel.ack(msg);

        }, { noAck: false })
    } catch (e) {
        console.log(`${e.message}`);

    }

}

processTask();