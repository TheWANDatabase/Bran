import amqplib from "amqplib";

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


}

export function transmit(exchange: string, key: string, body: string, format: string = 'json'): boolean {
  return defaultChannel.publish(exchange, key, Buffer.from(body), {
    headers: {
      'format': format
    }
  })
}