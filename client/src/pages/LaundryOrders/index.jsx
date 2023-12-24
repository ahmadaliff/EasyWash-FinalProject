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
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { ArrowBack, ArrowRight, DoNotDisturb, Done } from '@mui/icons-material';

import DetailOrder from '@components/DetailOrder';

import { selectOrders } from '@pages/LaundryOrders/selectors';
import { actionChangeStatus, actionGetOrders, actionResetOrders } from '@pages/LaundryOrders/actions';
import { actionAddChannel, actionDeleteChannel } from '@pages/ChatPage/actions';

import classes from '@pages/LaundryOrders/style.module.scss';

const LaundryOrders = ({ orders, intl: { formatMessage } }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [orderState, setOrderState] = useState(null);

  const columns = [
    { id: 'id', label: formatMessage({ id: 'app_order_id' }), maxWidth: 50 },
    { id: 'totalPrice', label: formatMessage({ id: 'app_total_price' }), minWidth: 100 },
    { id: 'status', label: 'status', minWidth: 100 },
  ];

  const formattedPrice = (val) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);

  useEffect(() => {
    dispatch(actionGetOrders(rowsPerPage, page));
    return () => {
      if (orders) {
        dispatch(actionResetOrders());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, rowsPerPage]);

  const buttonComp = (newStatus, row, idIntl, callback, nameClass = classes.buttonActionAcc) => (
    <Button
      type="button"
      className={nameClass}
      onClick={() => dispatch(actionChangeStatus(row.id, newStatus, callback))}
    >
      {nameClass === classes.buttonActionAcc ? <Done /> : <DoNotDisturb />}
      <div className={classes.email}>
        <FormattedMessage id={idIntl} />
      </div>
    </Button>
  );

  const actionComp = (order) => {
    switch (order.status) {
      case 'app_pending':
        return (
          <>
            {buttonComp('app_payment', order, 'app_acc', () => dispatch(actionAddChannel(order?.userId)))}
            {buttonComp('app_rejected', order, 'app_decline', undefined, classes.buttonActionDec)}
          </>
        );
      case 'app_pickUp':
        return buttonComp('app_onProcess', order, 'app_onProcess');
      case 'app_onProcess':
        return buttonComp('app_onDelivery', order, 'app_onDelivery');
      case 'app_onDelivery':
        return buttonComp('app_finish', order, 'app_finish', () => dispatch(actionDeleteChannel(order?.userId)));
      default:
        return 'No Action';
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <main className={classes.mainWrap}>
      <div className={classes.header}>
        <div>
          <h3>
            <FormattedMessage id="app_orders_header" />
          </h3>
        </div>
        <Button
          variant="contained"
          className={classes.backButton}
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          <FormattedMessage id="app_back" />
        </Button>
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
                <TableCell className={classes.tableHead}>
                  <FormattedMessage id="app_action" />
                </TableCell>
                <TableCell className={classes.tableHead}>Detail</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.data?.map((order) => (
                <TableRow hover key={order.id}>
                  {columns.map((column) => {
                    const value = order[column.id];
                    return (
                      <TableCell key={column.id} className={classes.tableBody}>
                        {
                          // eslint-disable-next-line no-nested-ternary
                          column.id === 'status'
                            ? formatMessage({ id: value })
                            : column.id === 'totalPrice'
                            ? formattedPrice(value)
                            : value
                        }
                      </TableCell>
                    );
                  })}

                  <TableCell className={classes.tableBody}>
                    <div className={classes.tableAction}>{actionComp(order)}</div>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setOrderState(order);
                        setIsDetailOpen(true);
                      }}
                    >
                      <ArrowRight />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <DetailOrder
                order={orderState}
                open={isDetailOpen}
                handleClose={() => {
                  setIsDetailOpen(false);
                }}
              />
              {orders?.data?.length === 0 && (
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
          count={orders?.totalRows || 0}
          rowsPerPage={rowsPerPage}
          page={orders ? page : 0}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </main>
  );
};

LaundryOrders.propTypes = {
  intl: PropTypes.object,
  orders: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  orders: selectOrders,
});

export default injectIntl(connect(mapStateToProps)(LaundryOrders));
