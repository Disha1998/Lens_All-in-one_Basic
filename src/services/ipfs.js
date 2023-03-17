 

import { create } from 'ipfs-http-client'; 
import {Buffer} from 'buffer';

const auth =
  "Basic " +
  Buffer.from(
    process.env.REACT_APP_INFURA_PROJECT_KEY + ":" + process.env.REACT_APP_INFURA_APP_SECRET_KEY
  ).toString("base64");
 

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const uploadIpfs = async (data) => {  
  return await client.add(data);
};

export default uploadIpfs;