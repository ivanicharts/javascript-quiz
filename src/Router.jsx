import React from 'react';
import { Home } from './pages';
import Questions from './pages/Questions';
import { BrowserRouter, Switch, Route } from "react-router-dom";

export default function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/questions" component={Questions} />
      </Switch>
    </BrowserRouter>
  )
}