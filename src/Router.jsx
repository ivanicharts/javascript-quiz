import React from 'react';
import { Home } from './pages';
import Questions from './pages/Questions';
import { Progress } from './pages/Progress';
import { HashRouter, Switch, Route } from "react-router-dom";

export default function Router() {
  return (
    <HashRouter basename="/">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/questions/:id?" component={Questions} />
        <Route path="/progress" component={Progress} />
      </Switch>
    </HashRouter>
  )
}