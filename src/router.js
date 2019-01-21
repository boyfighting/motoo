import React from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import Login from "./pages/login";
import Admin from "./Admin";
import AllComponents from "./pages";
const {
  DeviceGroup,
  Authorize,
  PartManagement,
  AuthorizationCode,
  Devices,
  MemberManagement,
  DeviceManagement,
  EmergencyBroadcast,
  UnGroupDevice
} = AllComponents;

export default () => (
  <Router>
    <Switch>
      <Route
        exact
        path="/"
        render={() => <Redirect to="/login" push component={Login} />}
      />
      <Route path="/login" component={Login} />
      <Route
        path="/admin"
        render={({ history, location, match }) => (
          <Admin history={history} location={location} match={location}>
            <Switch>
              <Route
                path="/admin/devicemanagement"
                render={({ history, location, match }) => (
                  <DeviceManagement
                    history={history}
                    location={location}
                    match={location}
                  >
                    <Route
                      path="/admin/devicemanagement/devicegroup"
                      exact
                      component={DeviceGroup}
                    />
                    <Route
                      path="/admin/devicemanagement/unGroupDevice"
                      exact
                      component={UnGroupDevice}
                    />

                    <Route
                      path="/admin/devicemanagement/devicegroup/members/:id"
                      component={MemberManagement}
                    />
                    <Route
                      path="/admin/devicemanagement/devicegroup/devices/:id"
                      component={Devices}
                    />
                  </DeviceManagement>
                )}
              />
              <Route path="/admin/authorize" component={Authorize} />
              <Route path="/admin/partManagement" component={PartManagement} />
              <Route
                path="/admin/authorizationcode"
                component={AuthorizationCode}
              />
              <Route
                path="/admin/EmergencyBroadcast"
                component={EmergencyBroadcast}
              />
            </Switch>
          </Admin>
        )}
      />
    </Switch>
  </Router>
);
