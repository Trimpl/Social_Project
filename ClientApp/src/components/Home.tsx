import * as React from 'react';
import { connect } from 'react-redux';
import ListOfPosts from './Posts/ListOfPosts';

interface IState {
  isAuthenticated: boolean,
  user: any
}

class Home extends React.PureComponent<{}, IState> {
  constructor(props: {}){
    super(props)
    this.state = {
      isAuthenticated: false,
      user: undefined
    }
  }

  render() {
    return (
      <div>
        <ListOfPosts />
      </div>
    )
  }
}

export default connect()(Home);
