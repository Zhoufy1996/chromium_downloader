import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import menuConfig, { redirectPath } from './MenuConfig';

const AppRoutes: React.FC<unknown> = () => {
  return (
    <Switch>
      {menuConfig.map((s) => {
        return (
          <Route key={s.key} path={s.path} exact component={s.component} />
        );
      })}
      <Redirect key="redirect" to={redirectPath} />
    </Switch>
  );
};

export default AppRoutes;
