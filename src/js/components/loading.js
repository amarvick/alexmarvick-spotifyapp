/* File Name: loading.js                                            *
 * Description: Loading screen                                      */

import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography';

class Loading extends Component {
  constructor(props) {
    super(props)
  }

  // The question template
  render(props) {   
    let style = {
      fontSize: 100
    }  
    
    return (
      <div style={style}>
          <i className="fa fa-circle-o-notch fa-spin"/><br/>
          <Typography variant="display4">
            LOADING...
          </Typography>
      </div>
    )
  }
}

export default Loading
