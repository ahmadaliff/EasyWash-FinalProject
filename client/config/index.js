import development from '@config/development';
import production from '@config/production';
import test from '@config/test.env';

const nodeENV = process.env.NODE_ENV || 'development';

const env = { production, development, test }[nodeENV];

const config = {
  api: {
    host: env.API_HOST,
    server: env.SERVER,
    secretKeyCrypto: env.CRYPTOJS_SECRET,
    midtransKey: env.MIDTRANS_CLIENT,
    midtransSrc: env.SNAP_MIDTRANS_LINK,
    streamKey: env.STREAM_KEY,
  },
};

export default config;
