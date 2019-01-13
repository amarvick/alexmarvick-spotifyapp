/* File Name: loading.js                                            *
 * Description: Loading screen                                      */

import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography';

class Loading extends Component {
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
