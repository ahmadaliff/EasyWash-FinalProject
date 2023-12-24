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
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { ArrowBack, ArrowRight, Delete, DoNotDisturb, Search, Unpublished, Verified } from '@mui/icons-material';
import styled from 'styled-components';

import {
  actionDeleteUser,
  actionGetUnverifiedUsers,
  actionGetUsers,
  actionResetUsers,
  actionVerifyUser,
} from '@pages/Users/actions';
import { selectUsers } from '@pages/Users/selectors';

import classes from '@pages/Users/style.module.scss';
import MerchantInfo from '@components/MerchantInfo';
import MapLeaflet from '@components/MapLeaflet';

const StyledToggle = styled(ToggleButton)({
  '&.Mui-selected, &.Mui-selected:hover': {
    color: 'white',
    border: 'none',
  },
});

const Users = ({ users, intl: { formatMessage } }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [merchant, setMerchant] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isVerifiedUsers, setIsVerifiedUsers] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  useEffect(() => {
    isVerifiedUsers
      ? dispatch(actionGetUsers(search, rowsPerPage, page))
      : dispatch(actionGetUnverifiedUsers(search, rowsPerPage, page));

    return () => {
      if (users) {
        dispatch(actionResetUsers());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, rowsPerPage, isVerifiedUsers]);

  useEffect(() => {
    const timeOutId = setTimeout(() => dispatch(actionGetUsers(search, rowsPerPage, page)), 1000);
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

  const columns = [
    { id: 'fullName', label: formatMessage({ id: 'app_user_fullName' }), minWidth: 170 },
    { id: 'email', label: formatMessage({ id: 'app_user_email' }), minWidth: 100 },
    {
      id: 'role',
      label: formatMessage({ id: 'app_role_user' }),
      minWidth: 170,
    },
  ];

  return (
    <main className={classes.mainWrap}>
      <div className={classes.header}>
        <div className={classes.rowOne}>
          <h3>
            <FormattedMessage id="app_user_page_header" />
          </h3>
          <Button
            variant="contained"
            className={classes.backButton}
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            <FormattedMessage id="app_back" />
          </Button>
        </div>
        <div className={classes.rowTwo}>
          <ToggleButtonGroup
            value={isVerifiedUsers}
            exclusive
            onClick={() => setIsVerifiedUsers(!isVerifiedUsers)}
            fullWidth
            className={classes.toggleRole}
            size="small"
          >
            <StyledToggle value={false}>
              <Verified /> <FormattedMessage id="app_account_verified" />
            </StyledToggle>
            <StyledToggle value>
              <Unpublished /> <FormattedMessage id="app_account_unverified" />
            </StyledToggle>
          </ToggleButtonGroup>
          <div className={classes.searchInputWrap}>
            <Search className={classes.iconSearch} />
            <input className={classes.searchInput} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>
      <Card className={classes.card}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    className={`${classes.tableHead} ${column.id === 'email' && classes.email}`}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell className={classes.tableHead}>
                  <FormattedMessage id="app_action" />
                </TableCell>
                {!isVerifiedUsers && <TableCell className={classes.tableHead}>Detail</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.data?.map((row) => (
                <TableRow hover key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        key={column.id}
                        className={`${classes.tableBody} ${column.id === 'email' && classes.email}`}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                  <TableCell className={classes.tableBody}>
                    <div className={classes.tableAction}>
                      {isVerifiedUsers ? (
                        <Button
                          type="button"
                          className={classes.buttonAction}
                          onClick={() => dispatch(actionDeleteUser(row.id))}
                        >
                          <Delete />
                          <div className={classes.email}>
                            <FormattedMessage id="app_delete_account" />
                          </div>
                        </Button>
                      ) : (
                        <>
                          <Button
                            type="button"
                            className={classes.buttonActionAcc}
                            onClick={() => dispatch(actionVerifyUser(row.id))}
                            size="small"
                          >
                            <Verified />
                            <div className={classes.email}>
                              <FormattedMessage id="app_verify_action" />
                            </div>
                          </Button>
                          <Button
                            type="button"
                            className={classes.buttonActionDec}
                            onClick={() => dispatch(actionDeleteUser(row.id))}
                          >
                            <DoNotDisturb />
                            <div className={classes.email}>
                              <FormattedMessage id="app_decline" />
                            </div>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                  {!isVerifiedUsers && (
                    <TableCell className={classes.tableBody}>
                      <IconButton
                        onClick={() => {
                          setMerchant(row.Merchant);
                          setDialogOpen(true);
                        }}
                      >
                        <ArrowRight />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {users?.data?.length === 0 && (
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
          count={users?.totalRows || 0}
          rowsPerPage={rowsPerPage}
          page={users ? page : 0}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>X</Button>
        </DialogActions>
        <DialogContent>
          <MerchantInfo merchant={merchant} chat={false} />
          <br />
          <MapLeaflet islocated={merchant && JSON.parse(merchant?.location)} />
        </DialogContent>
      </Dialog>
    </main>
  );
};

Users.propTypes = {
  intl: PropTypes.object,
  users: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  users: selectUsers,
});

export default injectIntl(connect(mapStateToProps)(Users));
