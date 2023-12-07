import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';
import { selectUser } from '@containers/Client/selectors';
import { selectUsers } from '@pages/Users/selectors';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch } from 'react-redux';
import {
  Alert,
  Button,
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
import { useNavigate } from 'react-router-dom';
import {
  actionDeleteUser,
  actionGetUnverifiedUsers,
  actionGetUsers,
  actionResetUsers,
  actionVerifyUser,
} from '@pages/Users/actions';

import classes from '@pages/Users/style.module.scss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { DoNotDisturb, PersonSearch, Unpublished, Verified } from '@mui/icons-material';
import styled from 'styled-components';

const Users = ({ user, users, intl: { formatMessage } }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isVerifiedUsers, setIsVerifiedUsers] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/');
    }
  }, [navigate, user]);

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

  const StyledToggleButton = styled(ToggleButton)({
    '&.Mui-selected, &.Mui-selected:hover': {
      color: 'white',
      backgroundColor: '#7ac94c',
      border: 'none',
    },
  });

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
    <div className={classes.tableWrap}>
      <div className={classes.header}>
        <div>
          <h3>
            <FormattedMessage id="app_user_page_header" />
          </h3>
          <ToggleButtonGroup
            value={isVerifiedUsers}
            exclusive
            onChange={() => setIsVerifiedUsers(!isVerifiedUsers)}
            fullWidth
            className={classes.toggleRole}
            size="small"
          >
            <StyledToggleButton value>
              <Verified /> <FormattedMessage id="app_account_verified" />
            </StyledToggleButton>
            <StyledToggleButton value={false}>
              <Unpublished /> <FormattedMessage id="app_account_unverified" />
            </StyledToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className={classes.searchInputWrap}>
          <PersonSearch />
          <input className={classes.searchInput} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} className={`${classes.tableHead} ${column.id === 'email' && classes.email}`}>
                  {column.label}
                </TableCell>
              ))}
              <TableCell className={classes.tableHead}>
                <FormattedMessage id="app_action" />
              </TableCell>
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
                <TableCell className={`${classes.tableBody} ${classes.tableAction}`}>
                  {isVerifiedUsers ? (
                    <Button
                      type="button"
                      className={classes.buttonAction}
                      onClick={() => dispatch(actionDeleteUser(row.id))}
                    >
                      <FormattedMessage id="app_delete_account" />
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
                        <FormattedMessage id="app_verify_action" />
                      </Button>
                      <Button
                        type="button"
                        className={classes.buttonActionDec}
                        onClick={() => dispatch(actionDeleteUser(row.id))}
                      >
                        <DoNotDisturb />
                        <FormattedMessage id="app_decline" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {users?.data?.length === 0 && (
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
        count={users?.totalRows || 0}
        rowsPerPage={rowsPerPage}
        page={users ? page : 0}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

Users.propTypes = {
  intl: PropTypes.object,
  user: PropTypes.object,
  users: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  users: selectUsers,
});

export default injectIntl(connect(mapStateToProps)(Users));
