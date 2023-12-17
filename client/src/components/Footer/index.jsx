import { Copyright, Email, GitHub, LinkedIn } from '@mui/icons-material';

import classes from '@components/Footer/style.module.scss';
import { FormattedMessage } from 'react-intl';

const Footer = () => (
  <footer className={classes.footer}>
    <hr className={classes.line} />
    <div className={classes.footerContent}>
      <div className={classes.leftContent}>
        <img src="/longLogo.svg" alt="logo" className={classes.logo} />
        <span className={classes.develop}>
          <FormattedMessage id="app_develop_by" /> :
        </span>
        <span className={classes.link}>
          <LinkedIn />
          <a
            className={classes.anchorLink}
            target="_blank"
            href="https://www.linkedin.com/in/alifahmaaad/"
            rel="noreferrer"
          >
            Ahmad Alif Sofian
          </a>
        </span>
        <span className={classes.link}>
          <GitHub />
          <a href="https://github.com/alifahmaaad" target="_blank" className={classes.anchorLink} rel="noreferrer">
            Ahmad Alif Sofian
          </a>
        </span>
        <span className={classes.link}>
          <Email />
          <a className={classes.anchorLink} href="mailto:alif12sofian@gmail.com">
            alif12sofian@gmail.com
          </a>
        </span>
      </div>

      <div className={classes.rightContent}>
        <img className={classes.ilustrator} src="/footer.svg" alt="https://storyset.com/" />
        <div className={classes.bootomText}>
          <Copyright />
          2023, EasyWash - Ahmad Alif Sofian
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
