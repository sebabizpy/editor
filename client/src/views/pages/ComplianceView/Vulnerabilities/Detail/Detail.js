import React, { useEffect } from 'react';
import { getPolicy } from 'src/redux/slices/policies';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Grid, Card, CardContent, TableContainer } from '@material-ui/core';

export default function Detail() {
  const { policyId } = useParams();
  const dispatch = useDispatch();

  const policy = useSelector((state) => {
    return state.policies.policiesMap[policyId];
  });
  console.log(policy);

  useEffect(() => {
    if (!policy) {
      dispatch(getPolicy());
    }
  }, [dispatch, policy]);

  return (
    <>
      <Grid container spacing={3}>
        <TableContainer>
          <Card>
            <CardContent>
              <>
                {/* Improve all the view of this information */}
                "id": {policy.id}
                <br />
                "description": {policy.description}
                <br />
                "createdAt": {policy.createdAt}
                <br />
                "updatedAt": {policy.updatedAt}
                <br />
                "active": {policy.active}
                <br />
                "token": {policy.token}
                <br />
                "vuln_id": {policy.vuln_id}
                <br />
                "severity": {policy.severity}
                <br />
                "text": {policy.text}
                <br />
                "text_cnt": {policy.text_cnt}
                <br />
                "parent": {policy.parent}
                <br />
                "when": {policy.when}
                <br />
              </>
            </CardContent>
          </Card>
        </TableContainer>
      </Grid>
    </>
  );
}
