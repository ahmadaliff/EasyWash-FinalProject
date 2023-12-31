import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

import { Button, Card, CardContent, FormControl, Switch } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import InputRHF from '@components/InputRHF';

import { actionAddService } from '@pages/FormService/actions';

import classes from '@pages/FormService/style.module.scss';

const FormService = ({ intl: { formatMessage } }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isUnit, setIsUnit] = useState(true);
  const [isEnable, setIsEnable] = useState(true);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    data.isUnit = isUnit;
    data.enable = isEnable;
    dispatch(
      actionAddService(data, () => {
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      })
    );
  };

  return (
    <main className={classes.mainWrap}>
      <div className={classes.header}>
        <h3>
          <FormattedMessage id="app_service_add_header" />
        </h3>
        <Button
          variant="contained"
          className={classes.backButton}
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          data-testid="back-button"
        >
          <FormattedMessage id="app_back" />
        </Button>
      </div>
      <Card className={classes.cardWrap}>
        <CardContent className={classes.cardContent}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.inputWrap}>
              <div className={classes.inputLabel}>
                <p className={classes.inputLabelTitle}>
                  <FormattedMessage id="app_service_name" />
                </p>
                <p>
                  <FormattedMessage
                    id="app_service_name_desc"
                    values={{
                      // eslint-disable-next-line react/no-unstable-nested-components
                      b: (chunks) => <b>{chunks}</b>,
                    }}
                  />
                </p>
              </div>
              <InputRHF
                input={{
                  name: 'name',
                  required: formatMessage({ id: 'app_service_name_require_message' }),
                  type: 'text',
                  label: formatMessage({ id: 'app_service_name' }),
                }}
                register={register}
                errors={errors}
              />
            </div>
            <div className={classes.inputWrap}>
              <div className={classes.inputLabel}>
                <p className={classes.inputLabelTitle}>
                  <FormattedMessage id="app_service_price" />
                </p>
                <p>
                  <FormattedMessage id="app_service_price_desc" />
                </p>
              </div>
              <InputRHF
                input={{
                  name: 'price',
                  required: formatMessage({ id: 'app_service_price_require_message' }),
                  type: 'number',
                  label: formatMessage({ id: 'app_service_price' }),
                }}
                register={register}
                errors={errors}
              />
            </div>
            <div className={classes.inputWrap}>
              <div className={classes.inputLabel}>
                <p className={classes.inputLabelTitle}>
                  <FormattedMessage id="app_service_isUnit" />
                </p>
                <p>
                  <FormattedMessage id="app_service_isUnit_desc" />
                </p>
              </div>
              <FormControl fullWidth>
                <Switch onChange={(e) => setIsUnit(e.target.checked)} defaultChecked />
              </FormControl>
            </div>
            <div className={classes.inputWrap}>
              <div className={classes.inputLabel}>
                <p className={classes.inputLabelTitle}>
                  <FormattedMessage id="app_service_enable" />
                </p>
                <p>
                  <FormattedMessage id="app_service_enable_desc" />
                </p>
              </div>
              <FormControl fullWidth>
                <Switch onChange={(e) => setIsEnable(e.target.checked)} defaultChecked />
              </FormControl>
            </div>
            <button type="submit" className={classes.buttonEditProfile} data-testid="button-submit">
              <FormattedMessage id="app_service_add_header" />
            </button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

FormService.propTypes = {
  intl: PropTypes.object,
};

export default injectIntl(FormService);
