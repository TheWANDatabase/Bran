import { processRawMessage, defaultChannel as ch } from "./amqp";
import frb from './firebase';

export let floatplane_video = {
  live: false,
  details: {}
};
export let youtube_video = {
  live: false,
  details: {}
}
export let twitch_video = {
  live: false,
  details: {}
}

export async function floatplane(raw: any) {
  if (raw === null) return;
  if (raw.content.length === 0) return ch.ack(raw);
  try {
    if (raw.properties.headers.env !== process.env.ENV) return;
    const { data, error } = processRawMessage(raw);

    if (data.offline) {
      floatplane_video.live = false;
      floatplane_video.details = {};
    } else {
      if (data.isWAN) {
        floatplane_video.live = true;
        floatplane_video.details = data;
        let obj = {
          aired: new Date(data.timestamp).toISOString(),
          cast: [],
          duration: -1,
          title: data.title,
          floatplane: data.id,
          streamData: data,
          flags: {
            aod: false,
            corrupt: false,
            cw: false,
            event: false,
            live: true,
            mm: true,
            pl: false,
            private: false,
            stream: false,
            thumb: false,
            vod: false,
            vtt: false
          }
        };

        await frb.db.collection('live').doc('live').set(obj);
        console.log(process.env.FP_HOOK)
        if (process.env.FP_HOOK) {
          let x = await fetch(process.env.FP_HOOK, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "content": "",
              "tts": false,
              "embeds": [
                {
                  "id": 652627557,
                  "title": data.title,
                  "description": "A new episode of The WAN Show has started on Floatplane \n(This is likely the pre-show)",
                  "color": 34303,
                  "fields": [],
                  "url": "https://thewandb.com/live",
                  "image": {
                    "url": data.thumbnail.path
                  },
                  "timestamp": new Date(data.timestamp).toISOString(),
                  "footer": {
                    "text": "Powered by Floatplane",
                    "icon_url": "https://frontend.floatplane.com/4.1.25/assets/images/brand/floatplane/favicon/classic/196x196.png"
                  }
                }
              ],
            })
          })
        }
      }
    }

    if (error) return;
    ch.ack(raw);
  } catch (e) {
    console.log(e)
    // ch.nack(raw)
  }
}

export async function youtube(raw: any) {
  if (raw === null) return;
  if (raw.content.length === 0) return ch.ack(raw);
  try {
    const msg = processRawMessage(raw);
    console.log(msg);
    if (msg.error) return;
    ch.ack(raw);
  } catch (e) {
    console.log(e)
    // ch.nack(msg)
  }
}

export async function bingo(raw: any) {
  if (raw === null) return;
  if (raw.content.length === 0) return ch.ack(raw);
  try {
    const msg = processRawMessage(raw);
    console.log(msg);
    if (msg.error) return;
    ch.ack(raw);
  } catch (e) {
    console.log(e)
    // ch.nack(msg)
  }
}