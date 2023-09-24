import amqplib from "amqplib";
import * as notifications from "./notifications";

export let connection: amqplib.Connection;
export let defaultChannel: amqplib.Channel;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

connect().then(() => {
  console.log("Connected to AMQP host")
})

export async function connect() {
  let retries = 0;

  while (retries < 3) {
    retries++;

    try {
      const REAL_URI: string = `amqp://${process.env.AMQP_USER}:${process.env.AMQP_PASS}@159.65.94.78:5672/`;
      console.debug("[DEBG] Attempting to connect to AMQP host");
      console.debug(REAL_URI)

      connection = await amqplib.connect(REAL_URI, {

      });
      defaultChannel = await connection.createChannel();
      break;
    } catch (e: any) {
      if (e.code !== 'ECONNREFUSED') {
        console.error(e);
        console.log(JSON.parse(JSON.stringify(e, Object.getOwnPropertyNames(e))))
        retries = 3;
        throw new Error("Failed to connect to AMQP host");
      }
      console.warn(`[WARN] Failed to connect to AMQP host - Retrying in 2s (${retries}/3)`)
      await sleep(2_000)
    }

  }


  if (defaultChannel) {
    console.log("Assigning queue")
    await defaultChannel.assertQueue(process.env.ENV + '.fp.notifications.bran', {
      durable: true,
      autoDelete: false
    })

    await defaultChannel.assertQueue(process.env.ENV + '.yt.notifications.bran', {
      durable: true,
      autoDelete: false
    })

    await defaultChannel.assertQueue(process.env.ENV + '.bingo.notifications.bran', {
      durable: true,
      autoDelete: false
    })


    console.log("Binding Floatplane")
    await defaultChannel.bindQueue(process.env.ENV + '.fp.notifications.bran', 'fp.notifications', '');

    console.log("Binding Youtube")
    await defaultChannel.bindQueue(process.env.ENV + '.yt.notifications.bran', 'yt.notifications', '');

    console.log("Binding Bingo")
    await defaultChannel.bindQueue(process.env.ENV + '.bingo.notifications.bran', 'bingo.notifications', '');

    console.log("Waiting for incoming messages to notifications.bran")
    await defaultChannel.consume(process.env.ENV + '.fp.notifications.bran', notifications.floatplane)
    await defaultChannel.consume(process.env.ENV + '.yt.notifications.bran', notifications.youtube)
    await defaultChannel.consume(process.env.ENV + '.bingo.notifications.bran', notifications.bingo)
  }
}

export function transmit(exchange: string, key: string, body: string, format: string = 'json'): boolean {
  return defaultChannel.publish(exchange, key, Buffer.from(body), {
    headers: {
      'format': format
    }
  })
}

export function processRawMessage(raw: amqplib.ConsumeMessage, islbg: boolean = false): any {
  try {
    if (raw.properties.headers['format']) {
      switch (raw.properties.headers['format']) {
        case 'json':
          return {
            data: JSON.parse(raw.content.toString('utf-8')),
            error: false
          };

        case 'error':
          let temp = {
            data: JSON.parse(raw.content.toString('utf-8')),
            error: false
          };

          temp.data.error = JSON.parse(temp.data.error);
          return temp;

        default:
          throw new Error("Message is not in an accepted format");

      }
    } else {
      throw new Error("Message is missing required headers", {


      });
    }
  } catch (e: any) {
    defaultChannel.ack(raw);
    if (!islbg) {
      transmit('lumberjack', '', JSON.stringify({
        message: raw,
        error: JSON.stringify(e, Object.getOwnPropertyNames(e)),
        timestamp: Date.now(),
        severity: {
          id: 3,
          name: 'normal'
        }
      }), 'error');
    } else {
      console.log('lumberjack encountered an error: ', e)
    }
  }
  return {
    data: null,
    error: true
  };
}

