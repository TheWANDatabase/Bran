import { processRawMessage, defaultChannel as ch } from "./amqp";
import db from './firebase';

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