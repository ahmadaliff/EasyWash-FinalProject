import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';

import {
  Alert,
  Button,
  Card,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { Add, ArrowBack, Edit, Search } from '@mui/icons-material';

import { selectServices } from '@pages/LaundryServices/selectors';
import { actionGetServices, actionResetServices, actionStatusService } from '@pages/LaundryServices/actions';

import classes from '@pages/LaundryServices/style.module.scss';

const LaundryServices = ({ services, intl: { formatMessage } }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  const columns = [
    { id: 'name', label: formatMessage({ id: 'app_service_name' }), minWidth: 170 },
    { id: 'price', label: formatMessage({ id: 'app_service_price' }), minWidth: 100 },
  ];

  const formattedPrice = (val) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);

  useEffect(() => {
    dispatch(actionGetServices(search, rowsPerPage, page));
    return () => {
      if (services) {
        dispatch(actionResetServices());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, rowsPerPage]);

  useEffect(() => {
    const timeOutId = setTimeout(() => dispatch(actionGetServices(search, rowsPerPage, page)), 1000);
    return () => clearTimeout(timeOutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <main className={classes.mainWrap} data-testid="laundry-services">
      <div className={classes.header}>
        <div>
          <h3>
            <FormattedMessage id="app_services_header" />
          </h3>
        </div>
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
      <Card className={classes.card}>
        <div className={classes.searchInputWrap}>
          <Search className={classes.iconSearch} />
          <input className={classes.searchInput} onChange={(e) => setSearch(e.target.value)} />
          <Button
            type="button"
            variant="contained"
            className={classes.buttonAdd}
            onClick={() => navigate(`/service/add`)}
            size="small"
            data-testid="button-add"
          >
            <Add />
            <div className={classes.buttonText}>
              <FormattedMessage id="app_service_add_header" />
            </div>
          </Button>
        </div>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} className={classes.tableHead}>
                    {column.label}
                  </TableCell>
                ))}
                <TableCell className={`${classes.tableHead} ${classes.email}`}>
                  <FormattedMessage id="app_service_isUnit" />
                </TableCell>
                <TableCell className={classes.tableHead}>
                  <FormattedMessage id="app_service_enable" />
                </TableCell>
                <TableCell className={classes.tableHead}>
                  <FormattedMessage id="app_action" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services?.data?.map((row) => (
                <TableRow hover key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} className={classes.tableBody}>
                        {typeof value !== 'string' ? formattedPrice(value) : value}
                      </TableCell>
                    );
                  })}
                  <TableCell className={`${classes.tableBody} ${classes.email}`}>
                    <Switch defaultChecked={row.isUnit} disabled />
                  </TableCell>
                  <TableCell className={classes.tableBody}>
                    <Switch defaultChecked={!!row.enable} onChange={() => dispatch(actionStatusService(row.id))} />
                  </TableCell>
                  <TableCell className={classes.tableBody}>
                    <div className={classes.tableAction}>
                      <Button
                        type="button"
                        className={classes.buttonActionAcc}
                        onClick={() => navigate(`/service/edit/${row.id}`)}
                        size="small"
                        data-testid="button-edit"
                      >
                        <Edit />
                        <div className={classes.email}>
                          <FormattedMessage id="app_service_edit_header" />
                        </div>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {services?.data?.length === 0 && (
                <TableRow hover>
                  <TableCell colSpan={5}>
                    <Stack sx={{ width: '100%' }} spacing={2}>
                      <Alert severity="error">
                        <FormattedMessage id="app_404" />
                      </Alert>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          className={classes.tablePagination}
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={services?.totalRows || 0}
          rowsPerPage={rowsPerPage}
          page={services ? page : 0}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </main>
  );
};

LaundryServices.propTypes = {
  intl: PropTypes.object,
  services: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  services: selectServices,
});

export default injectIntl(connect(mapStateToProps)(LaundryServices));
