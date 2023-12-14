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
import { Add, DoNotDisturb, Edit, ManageSearch } from '@mui/icons-material';

import { selectUser } from '@containers/Client/selectors';
import { selectServices } from '@pages/LaundryServices/selectors';
import { actionDeleteService, actionGetServices, actionResetServices } from '@pages/LaundryServices/actions';

import classes from '@pages/LaundryServices/style.module.scss';

const LaundryServices = ({ user, services, intl: { formatMessage } }) => {
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
    if (user?.role !== 'laundry') {
      navigate('/');
    }
  }, [navigate, user]);

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
    <div className={classes.tableWrap}>
      <div className={classes.header}>
        <div>
          <h3>
            <FormattedMessage id="app_services_header" />
          </h3>
        </div>
        <div className={classes.searchInputWrap}>
          <ManageSearch />
          <input className={classes.searchInput} onChange={(e) => setSearch(e.target.value)} />
          <Button
            type="button"
            variant="contained"
            className={classes.buttonAdd}
            onClick={() => navigate(`/service/add`)}
            size="small"
          >
            <Add />
            <div className={classes.buttonText}>
              <FormattedMessage id="app_service_add_header" />
            </div>
          </Button>
        </div>
      </div>
      <Card className={classes.card}>
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
                    <div className={classes.tableAction}>
                      <Button
                        type="button"
                        className={classes.buttonActionAcc}
                        onClick={() => navigate(`/service/edit/${row.id}`)}
                        size="small"
                      >
                        <Edit />
                        <div className={classes.email}>
                          <FormattedMessage id="app_service_edit_header" />
                        </div>
                      </Button>
                      <Button
                        type="button"
                        className={classes.buttonActionDec}
                        onClick={() => dispatch(actionDeleteService(row.id))}
                      >
                        <DoNotDisturb />

                        <div className={classes.email}>
                          <FormattedMessage id="app_delete_service" />
                        </div>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {services?.data?.length === 0 && (
                <TableRow hover>
                  <TableCell colSpan={4}>
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
    </div>
  );
};

LaundryServices.propTypes = {
  intl: PropTypes.object,
  user: PropTypes.object,
  services: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  services: selectServices,
});

export default injectIntl(connect(mapStateToProps)(LaundryServices));
