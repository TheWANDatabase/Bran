import { castCache, orgCache } from "../cache";
import firebase from "../firebase";


export interface CastMember {
  id: string;
  alias?: string;
  avatar?: string;
  debut?: string;
  forename: string;
  surname?: string;
  outlet?: Organization;
  outlet_role?: string;
  priorit: number;
  socials: {
    imdb?: string;
    instagram?: string;
    linkedin?: string;
    ltt_forum?: string;
    twitter?: string;
    wikipedia?: string
  }
}

export interface Organization {
  name: string;
  url?: string;
}

export async function resolveCast(cast: string[]): Promise<CastMember[]> {
  let cc = firebase.db.collection('cast');
  let oc = firebase.db.collection('outlets');
  let c = [];
  for (let i = 0; i < cast.length; i++) {
    let c1 = cast[i];

    if (castCache.has(c1)) {
      c.push(castCache.get(c1))
    } else {
      let ref = await cc.doc(c1).get();
      let c2 = ref.data();
      if (c2) {
        if (orgCache.has(c2.outlet)) {
          c2.outlet = orgCache.get(c2.outlet);
        } else {
          let oref = await oc.doc(c2.outlet).get();
          let o = oref.data();
          orgCache.set(c2.outlet, o)
          c2.outlet = o;
        }
      }
      castCache.set(c1, c2)
      c.push(c2 as CastMember);
    }
  }

  return c
}