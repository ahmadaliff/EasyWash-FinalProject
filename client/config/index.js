import development from '@config/development';
import production from '@config/production';

const nodeENV = process.env.NODE_ENV || 'development';

const env = { production, development }[nodeENV];

const config = {
  api: {
    host: env.API_HOST,
    server: env.SERVER,
    secretKeyCrypto: env.CRYPTOJS_SECRET,
    midtransKey: env.MIDTRANS_CLIENT,
    midtransSrc: env.SNAP_MIDTRANS_LINK,
  },
};

export default config;
