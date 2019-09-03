import React from 'react';
import { Home } from './pages';
import Resource from './pages/Resource';
// import { Router } from 'react-navi'
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

// Define your routes
export default function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/resource/:id" component={Resource} />
      </Switch>
    </BrowserRouter>
  )
}