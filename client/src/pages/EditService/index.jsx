import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';

import { Button, Card, CardContent, FormControl, Switch } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import InputRHF from '@components/InputRHF';

import { actionEditService, actionGetService, actionResetService } from '@pages/EditService/actions';
import { selectService } from '@pages/EditService/selectors';

import classes from '@pages/EditService/style.module.scss';

const EditService = ({ service, intl: { formatMessage } }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isUnit, setIsUnit] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!service) dispatch(actionGetService(id));
    else setIsUnit(!!service.isUnit);
    return () => {
      if (service) dispatch(actionResetService());
    };
  }, [dispatch, id, service]);

  const onSubmit = (data) => {
    delete data.name;
    data.isUnit = isUnit;
    dispatch(
      actionEditService(service.id, data, () => {
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      })
    );
  };

  return (
    <main className={classes.mainWrap} data-testid="editservice-page">
      <div className={classes.header}>
        <h3>
          <FormattedMessage id="app_service_edit_header" />
        </h3>
        <Button
          variant="contained"
          className={classes.backButton}
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          data-testid="button-back"
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
                  type: 'text',
                  label: formatMessage({ id: 'app_service_name' }),
                  value: service?.name,
                }}
                disabled
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
                  value: service?.price.toString(),
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
                {service && (
                  <Switch
                    onChange={(e) => setIsUnit(e.target.checked)}
                    checked={!!service?.isUnit}
                    data-testid="isUnit"
                  />
                )}
              </FormControl>
            </div>
            <button type="submit" className={classes.buttonEditProfile} data-testid="button-submit">
              <FormattedMessage id="app_service_edit_header" />
            </button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

EditService.propTypes = {
  intl: PropTypes.object,
  service: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  service: selectService,
});

export default injectIntl(connect(mapStateToProps)(EditService));
